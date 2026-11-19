-- =====================================================================
-- EcoSentryDB  -  upiti/statistika.sql
--
-- Upiti za statistiku koju vidi komunalni redar (F-020 i zadatak:
-- broj prijava po mjesecima, najkritičniji kvartovi, postotak uspješnosti).
--
-- OVO NIJE MIGRACIJA. Datoteka se nikad ne izvršava automatski i ne mijenja bazu.
-- Upiti samo čitaju podatke (SELECT). Koriste se:
--   * za ručnu provjeru u Neon SQL Editoru,
--   * kao predložak kad backend bude radio statistiku (npr. @Query u repozitoriju),
--   * za brojke u dokumentaciji i na demonstraciji.
--
-- Odbačene prijave (ODBACENO) ne ulaze u statistiku: to su lažne prijave.
-- "Riješena" prijava: OCISCENO ili SLUZBENA_SANACIJA (komunalna služba ju je preuzela).
-- Ako tim odluči da se broji samo OCISCENO, promijeniti uvjet u upitima 2 i 3.
-- Mjeseci se računaju u vremenskoj zoni sesije (na Neonu je zadano UTC); za
-- hrvatsko vrijeme prije upita pokrenuti: SET TIME ZONE 'Europe/Zagreb';
-- =====================================================================


-- 1. Broj prijava po mjesecima ----------------------------------------
SELECT to_char(date_trunc('month', datum_kreiranja), 'YYYY-MM') AS mjesec,
       COUNT(*)                                                 AS broj_prijava
FROM prijava
WHERE status <> 'ODBACENO'
GROUP BY 1
ORDER BY 1;


-- 2. Postotak riješenih prijava po mjesecima ---------------------------
SELECT to_char(date_trunc('month', datum_kreiranja), 'YYYY-MM') AS mjesec,
       COUNT(*)                                                 AS broj_prijava,
       COUNT(*) FILTER (WHERE status IN ('OCISCENO', 'SLUZBENA_SANACIJA')) AS rijesene,
       ROUND(100.0 * COUNT(*) FILTER (WHERE status IN ('OCISCENO', 'SLUZBENA_SANACIJA'))
             / COUNT(*), 1)                                     AS postotak_rijesenih
FROM prijava
WHERE status <> 'ODBACENO'
GROUP BY 1
ORDER BY 1;


-- 3. Ukupni postotak uspješnosti (jedan broj za cijelo razdoblje) -------
SELECT COUNT(*)                                                         AS ukupno_prijava,
       COUNT(*) FILTER (WHERE status = 'OCISCENO')                      AS ocisceno,
       COUNT(*) FILTER (WHERE status = 'SLUZBENA_SANACIJA')             AS sluzbena_sanacija,
       ROUND(100.0 * COUNT(*) FILTER (WHERE status IN ('OCISCENO', 'SLUZBENA_SANACIJA'))
             / NULLIF(COUNT(*), 0), 1)                                  AS postotak_uspjesnosti
FROM prijava
WHERE status <> 'ODBACENO';


-- 4. Najkritičniji kvartovi (najviše neriješenih prijava) ---------------
-- Prijave bez kvarta (geokodiranje nije uspjelo) skupljene su pod "Nepoznato".
SELECT COALESCE(kvart, 'Nepoznato')                                     AS kvart,
       COUNT(*)                                                         AS ukupno_prijava,
       COUNT(*) FILTER (WHERE status IN ('PRIJAVLJENO', 'AKCIJA_U_TIJEKU')) AS nerijesene
FROM prijava
WHERE status <> 'ODBACENO'
GROUP BY 1
ORDER BY nerijesene DESC, ukupno_prijava DESC
LIMIT 10;


-- 5. Prijave po kategoriji otpada --------------------------------------
-- LEFT JOIN da se vide i kategorije bez ijedne prijave (broj 0).
SELECT k.kategorija_naziv AS kategorija,
       COUNT(p.id_prijava) AS broj_prijava
FROM kategorija k
LEFT JOIN prijava p
       ON p.id_kategorija = k.id_kategorija
      AND p.status <> 'ODBACENO'
GROUP BY k.kategorija_naziv
ORDER BY broj_prijava DESC, kategorija;


-- 6. Trenutačno stanje: prijave po statusu ------------------------------
SELECT status,
       COUNT(*) AS broj_prijava
FROM prijava
GROUP BY status
ORDER BY broj_prijava DESC;
