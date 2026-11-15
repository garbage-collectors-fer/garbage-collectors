-- =====================================================================
-- EcoSentryDB  -  V2__seed.sql   (Flyway migracija, početni podaci)
-- Repozitorij: backend/src/main/resources/db/migration/V2__seed.sql
-- =====================================================================

-- Kategorije otpada
INSERT INTO kategorija (kategorija_naziv) VALUES
    ('Plastika'),
    ('Glomazni otpad'),
    ('Građevinski otpad'),
    ('Metal'),
    ('Staklo'),
    ('Papir i karton'),
    ('Elektronički otpad'),
    ('Opasni otpad'),
    ('Biootpad'),
    ('Miješani otpad');

-- Prvi komunalni redar(administrator).
-- id_oauth ostaje NULL; popunit će ga backend kad se ovaj korisnik
-- prvi put prijavi Google računom s istim e-mailom.
-- PRIJE COMMITA: zamijeniti e-mail pravim Google računom (V2 se izvršava samo jednom).
INSERT INTO korisnik (email, ime, prezime, uloga, status_racuna)
VALUES ('pavao.marsic@gmail.com', 'Pavao', 'Maršić', 'REDAR', 'AKTIVAN');