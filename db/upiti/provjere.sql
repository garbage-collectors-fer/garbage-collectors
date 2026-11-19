-- =====================================================================
-- EcoSentryDB  -  upiti/provjere.sql
--
-- Upiti za brzu provjeru stanja baze (npr. nakon nove migracije, prije
-- demonstracije ili kad nešto ne radi kako treba).
--
-- OVO NIJE MIGRACIJA. Upiti samo čitaju podatke (SELECT) i ništa ne mijenjaju.
-- Pokreću se ručno u Neon SQL Editoru, jedan po jedan.
-- =====================================================================


-- 1. Koje su migracije izvršene i kada ---------------------------------
-- Ako zadnja migracija nije ovdje ili ima success = false, Flyway je stao.
SELECT installed_rank, version, description, installed_on, success
FROM flyway_schema_history
ORDER BY installed_rank;


-- 2. Korisnici po ulozi i statusu računa ------------------------------
SELECT uloga, status_racuna, COUNT(*) AS broj_korisnika
FROM korisnik
GROUP BY uloga, status_racuna
ORDER BY uloga, status_racuna;


-- 3. Redari i udruge (tko ima posebnu ulogu) ---------------------------
-- id_oauth je predviđen za Googleov 'sub'. Trenutačni backend korisnika
-- prepoznaje po e-mailu i id_oauth još ne popunjava, pa je stupac
-- povezan_s_googleom zasad false za sve (vidi db_dokumentacija.md, odstupanja).
SELECT id_korisnik, email, ime, prezime, uloga, status_racuna,
       organizacija_naziv, id_oauth IS NOT NULL AS povezan_s_googleom
FROM korisnik
WHERE uloga IN ('REDAR', 'UDRUGA')
ORDER BY uloga, email;


-- 4. Blokirani korisnici i razlog blokade ------------------------------
SELECT id_korisnik, email, ime, prezime, razlog_blokade
FROM korisnik
WHERE status_racuna = 'BLOKIRAN';


-- 5. Udruge koje čekaju odobrenje redara -------------------------------
SELECT id_korisnik, email, ime, prezime, organizacija_naziv, datum_registracije
FROM korisnik
WHERE uloga = 'UDRUGA' AND status_racuna = 'NA_CEKANJU'
ORDER BY datum_registracije;


-- 6. Prijave koje čekaju odluku redara --------------------------------
-- a) neprovjerene (redar ih još nije prihvatio ni odbacio)
SELECT p.id_prijava, p.datum_kreiranja, k.kategorija_naziv, u.email AS prijavitelj
FROM prijava p
JOIN kategorija k ON k.id_kategorija = p.id_kategorija
JOIN korisnik  u ON u.id_korisnik  = p.id_korisnik
WHERE p.status = 'PRIJAVLJENO' AND NOT p.provjerena
ORDER BY p.datum_kreiranja;

-- b) prihvaćene, ali redar još nije odlučio idu li udrugama ili na službenu sanaciju
SELECT p.id_prijava, p.datum_kreiranja, k.kategorija_naziv
FROM prijava p
JOIN kategorija k ON k.id_kategorija = p.id_kategorija
WHERE p.status = 'PRIJAVLJENO' AND p.provjerena AND p.nacin_sanacije IS NULL
ORDER BY p.datum_kreiranja;


-- 7. Prijave koje vide udruge (poslane udrugama, još nisu u akciji) -----
SELECT p.id_prijava, p.datum_kreiranja, k.kategorija_naziv, p.adresa, p.kvart
FROM prijava p
JOIN kategorija k ON k.id_kategorija = p.id_kategorija
WHERE p.status = 'PRIJAVLJENO' AND p.provjerena AND p.nacin_sanacije = 'UDRUGA'
ORDER BY p.datum_kreiranja;


-- 8. Kontrola podataka: prijave bez adrese ili kvarta -------------------
-- Korisno dok geokodiranje (F-013) ne radi: koliko prijava nema adresu.
SELECT COUNT(*)                              AS ukupno,
       COUNT(*) FILTER (WHERE adresa IS NULL) AS bez_adrese,
       COUNT(*) FILTER (WHERE kvart  IS NULL) AS bez_kvarta
FROM prijava;
