-- =====================================================================
-- EcoSentryDB  -  V3__nalog_kategorije_uloge.sql   (Flyway migracija)
-- Repozitorij: backend/src/main/resources/db/migration/V3__nalog_kategorije_uloge.sql
--
-- 1. Sluzbeni nalog izbacen: brise se pravilo ck_prijava_nalog i stupac nalog_broj
-- 2. Kategorije uskladene s F-006: Plastika, Građevinski otpad, Glomazni otpad, Ostalo ; vraceno na prijasnje stanje
-- 3. Uloge clanova tima za testiranje: drugi redar i udruga
-- =====================================================================

-- 1. NALOG ------------------------------------------------------------
ALTER TABLE prijava DROP CONSTRAINT ck_prijava_nalog;
ALTER TABLE prijava DROP COLUMN nalog_broj;


-- 2. KATEGORIJE --------------------------------------------------------
-- "Miješani otpad" postaje "Ostalo"
UPDATE kategorija SET kategorija_naziv = 'Ostalo'
WHERE kategorija_naziv = 'Miješani otpad';

-- prijave s kategorijama koje nestaju prebacuju se na "Ostalo"
-- (inace bi DELETE puknuo zbog stranog kljuca)
UPDATE prijava
SET id_kategorija = (SELECT id_kategorija FROM kategorija WHERE kategorija_naziv = 'Ostalo')
WHERE id_kategorija IN (
    SELECT id_kategorija FROM kategorija
    WHERE kategorija_naziv NOT IN ('Plastika', 'Građevinski otpad', 'Glomazni otpad', 'Ostalo'));

DELETE FROM kategorija
WHERE kategorija_naziv NOT IN ('Plastika', 'Građevinski otpad', 'Glomazni otpad', 'Ostalo');


-- 3. ULOGE -------------------------------------------------------------
-- Ako se korisnik vec prijavio Googleom, redak postoji pa se samo mijenja uloga.
-- Ako se jos nije prijavio, redak se stvara unaprijed (kao prvi redar u V2);
-- backend ga pri prvoj prijavi poveze po e-mailu.

-- drugi komunalni redar
INSERT INTO korisnik (email, ime, prezime, uloga, status_racuna)
VALUES ('markovinovicivana57@gmail.com', 'Ivana', 'Markovinovic', 'REDAR', 'AKTIVAN')
ON CONFLICT (email) DO UPDATE
SET uloga              = 'REDAR',
    organizacija_naziv = NULL,
    status_racuna      = 'AKTIVAN',
    razlog_blokade     = NULL;

-- eko-udruga (naziv organizacije je obavezan za ulogu UDRUGA)
INSERT INTO korisnik (email, ime, prezime, uloga, status_racuna, organizacija_naziv)
VALUES ('leo.zigman@gmail.com', 'Leo', 'Zigman', 'UDRUGA', 'AKTIVAN', 'Zelena akcija')
ON CONFLICT (email) DO UPDATE
SET uloga              = 'UDRUGA',
    organizacija_naziv = EXCLUDED.organizacija_naziv,
    status_racuna      = 'AKTIVAN',
    razlog_blokade     = NULL;