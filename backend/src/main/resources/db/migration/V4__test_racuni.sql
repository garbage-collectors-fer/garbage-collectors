-- =====================================================================
-- EcoSentryDB  -  V4__test_racuni.sql   (Flyway migracija)
-- Repozitorij: backend/src/main/resources/db/migration/V4__test_racuni.sql
--
-- Zajednicki test racuni tima (Google racuni dodani kao test korisnici u Google Cloud).
-- Gradanin ne treba unos: pri prvoj prijavi automatski dobiva ulogu GRADANIN.
-- Ako se racun vec prijavio, mijenja se samo uloga; ako nije, redak se stvara unaprijed.
-- Lozinke se NE spremaju u bazu (prijava ide preko Googlea).
-- =====================================================================

-- test redar
INSERT INTO korisnik (email, ime, prezime, uloga, status_racuna)
VALUES ('ecosentry.redar@gmail.com', 'Test', 'Redar', 'REDAR', 'AKTIVAN')
ON CONFLICT (email) DO UPDATE
SET uloga              = 'REDAR',
    organizacija_naziv = NULL,
    status_racuna      = 'AKTIVAN',
    razlog_blokade     = NULL;

-- test udruga (naziv organizacije je obavezan za ulogu UDRUGA)
INSERT INTO korisnik (email, ime, prezime, uloga, status_racuna, organizacija_naziv)
VALUES ('ecosentry.udruga@gmail.com', 'Test', 'Udruga', 'UDRUGA', 'AKTIVAN', 'Test udruga EcoSentry')
ON CONFLICT (email) DO UPDATE
SET uloga              = 'UDRUGA',
    organizacija_naziv = EXCLUDED.organizacija_naziv,
    status_racuna      = 'AKTIVAN',
    razlog_blokade     = NULL;