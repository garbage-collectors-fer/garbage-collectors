-- =====================================================================
-- EcoSentryDB  -  V1__init.sql   (PostgreSQL 18, Neon; Flyway migracija; ** nakndano uskaladeno sa Java kodom,
--ID-ovi BIGINT = Java Long)
-- Repozitorij: backend/src/main/resources/db/migration/V1__init.sql
--
-- Konvencije kojih sam se odlucio drzati:
--  * imena tablica i stupaca: snake_case, mala slova
--  * statusi i uloge: ASCII kodovi VELIKIM SLOVIMA (mapiraju se na Java enum);
--    prikazni nazivi s dijakriticima ("Građanin", "Očišćeno") rješava frontend
--  * vrijeme: TIMESTAMPTZ
-- =====================================================================

-- 1. KATEGORIJA (šifrarnik vrsta otpada)
CREATE TABLE kategorija (
    id_kategorija    BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    kategorija_naziv VARCHAR(100) NOT NULL UNIQUE
);

-- 2. KORISNIK (građani/volonteri, udruge, redari; prijava samo preko OAuth 2.0)
CREATE TABLE korisnik (
    id_korisnik        BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    oauth_provider     VARCHAR(30)  NOT NULL DEFAULT 'google',
    id_oauth           VARCHAR(255),              -- 'sub' iz OIDC-a; NULL dok se unaprijed dodan redar ne prijavi prvi put
    email              VARCHAR(255) NOT NULL UNIQUE,
    ime                VARCHAR(50)  NOT NULL,
    prezime            VARCHAR(50)  NOT NULL,
    uloga              VARCHAR(20)  NOT NULL DEFAULT 'GRADANIN'
                       CHECK (uloga IN ('GRADANIN', 'UDRUGA', 'REDAR')),
    status_racuna      VARCHAR(20)  NOT NULL DEFAULT 'AKTIVAN'
                       CHECK (status_racuna IN ('AKTIVAN', 'BLOKIRAN', 'NA_CEKANJU')),
    organizacija_naziv VARCHAR(100),              -- samo za ulogu UDRUGA
    razlog_blokade     TEXT,                      -- popunjeno kad je status BLOKIRAN
    datum_registracije TIMESTAMPTZ  NOT NULL DEFAULT now(),
    CONSTRAINT uq_korisnik_oauth UNIQUE (oauth_provider, id_oauth),
    CONSTRAINT ck_korisnik_udruga
        CHECK ((uloga = 'UDRUGA') = (organizacija_naziv IS NOT NULL)),
    CONSTRAINT ck_korisnik_blokada
        CHECK (status_racuna <> 'BLOKIRAN' OR razlog_blokade IS NOT NULL)
);

-- 3. GOOGLE_TOKEN (refresh token za Google Calendar API; vrijednost spremati ŠIFRIRANO)
CREATE TABLE google_token (
    id_korisnik       BIGINT PRIMARY KEY REFERENCES korisnik(id_korisnik) ON DELETE CASCADE,
    refresh_token_enc TEXT        NOT NULL,
    scope             TEXT,
    datum_azuriranja  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4. PRIJAVA (prijavljeno divlje odlagalište)
CREATE TABLE prijava (
    id_prijava        BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_korisnik       BIGINT          NOT NULL REFERENCES korisnik(id_korisnik),
    id_kategorija     BIGINT          NOT NULL REFERENCES kategorija(id_kategorija),
    latituda          NUMERIC(9,6) NOT NULL CHECK (latituda  BETWEEN  -90 AND  90),
    longituda         NUMERIC(9,6) NOT NULL CHECK (longituda BETWEEN -180 AND 180),
    adresa            VARCHAR(255),               -- iz geokodiranja, Google-ov geocoding API(prema F-013)
    kvart             VARCHAR(100),               -- za statistiku po kvartovima (zadatak?, )
    opis              TEXT,
    url_fotografija   VARCHAR(500) NOT NULL,
    volumen_estm      VARCHAR(50),
    status            VARCHAR(30)  NOT NULL DEFAULT 'PRIJAVLJENO'
                      CHECK (status IN ('PRIJAVLJENO', 'AKCIJA_U_TIJEKU', 'OCISCENO',
                                        'SLUZBENA_SANACIJA', 'ODBACENO')),
    provjerena        BOOLEAN      NOT NULL DEFAULT FALSE,   -- redar je prihvatio prijavu
    nacin_sanacije    VARCHAR(20)                            -- redar odlucuje: udruge ili sluzbena sanacija
                      CHECK (nacin_sanacije IN ('UDRUGA', 'SLUZBENA')),
    nalog_broj        VARCHAR(50)  UNIQUE,
    url_foto_sanacija VARCHAR(500),               -- kad redar sam zatvara prijavu ( prema F-019)
    datum_kreiranja   TIMESTAMPTZ  NOT NULL DEFAULT now(),
    CONSTRAINT ck_prijava_nalog
        CHECK (status <> 'SLUZBENA_SANACIJA' OR nalog_broj IS NOT NULL),
    -- svaki status osim PRIJAVLJENO i ODBACENO podrazumijeva da je redar prihvatio prijavu
    CONSTRAINT ck_prijava_provjerena
        CHECK (status IN ('PRIJAVLJENO', 'ODBACENO') OR provjerena)
);

-- 5. AKCIJA (akcija čišćenja koju organizira udruga)
CREATE TABLE akcija (
    id_akcija           BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_udruga           BIGINT          NOT NULL REFERENCES korisnik(id_korisnik),
    akcija_naziv        VARCHAR(150) NOT NULL,
    akcija_opis         TEXT,
    datum_vrijeme       TIMESTAMPTZ  NOT NULL,
    latituda            NUMERIC(9,6) NOT NULL CHECK (latituda  BETWEEN  -90 AND  90),
    longituda           NUMERIC(9,6) NOT NULL CHECK (longituda BETWEEN -180 AND 180),
    maxbr_volonteri     INT          NOT NULL CHECK (maxbr_volonteri > 0),
    status_akcija       VARCHAR(30)  NOT NULL DEFAULT 'PLANIRANO'
                        CHECK (status_akcija IN ('PLANIRANO', 'ZATVARANJE_ZATRAZENO',
                                                 'ZAVRSENO', 'OTKAZANO')),
    razlog_otkazivanja  TEXT,
    id_google_event     VARCHAR(255),             -- događaj u kalendaru UDRUGE
    url_foto_dokaz      VARCHAR(500),             -- dokaz o sanaciji
    CONSTRAINT ck_akcija_dokaz
        CHECK (status_akcija NOT IN ('ZATVARANJE_ZATRAZENO', 'ZAVRSENO')
               OR url_foto_dokaz IS NOT NULL)
);

-- 6. STATUS_LOG (digitalni trag svake promjene statusa prijave)
CREATE TABLE status_log (
    id_surogat_log       BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_prijava           BIGINT         NOT NULL REFERENCES prijava(id_prijava),
    id_korisnik_promjena BIGINT         NOT NULL REFERENCES korisnik(id_korisnik),
    status_stari         VARCHAR(30),             -- NULL kod prvog zapisa, odnosno kreiranja prijave
    status_novi          VARCHAR(30) NOT NULL,
    datum_vrijeme        TIMESTAMPTZ NOT NULL DEFAULT now(),
    napomena             TEXT
);

-- 7. AKCIJA_PRIJAVA (M:N veaz: akcija obuhvaća više odlagališta)
CREATE TABLE akcija_prijava (
    id_akcija  BIGINT NOT NULL REFERENCES akcija(id_akcija),
    id_prijava BIGINT NOT NULL REFERENCES prijava(id_prijava),
    PRIMARY KEY (id_akcija, id_prijava)
);

-- 8. VOLONTER_PRIJAVA (M:N veza: volonteri na akcijama)
CREATE TABLE volonter_prijava (
    id_korisnik     BIGINT         NOT NULL REFERENCES korisnik(id_korisnik),
    id_akcija       BIGINT         NOT NULL REFERENCES akcija(id_akcija),
    datum_prijave   TIMESTAMPTZ NOT NULL DEFAULT now(),
    id_google_event VARCHAR(255),                 -- događaj u kalendaru VOLONTERA
    PRIMARY KEY (id_korisnik, id_akcija)
);

-- 9. OBAVIJEST (obavijesti unutar aplikacije)
CREATE TABLE obavijest (
    id_obavijest BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_korisnik  BIGINT         NOT NULL REFERENCES korisnik(id_korisnik),
    id_prijava   BIGINT         REFERENCES prijava(id_prijava),
    id_akcija    BIGINT         REFERENCES akcija(id_akcija),
    tip          VARCHAR(30) NOT NULL
                 CHECK (tip IN ('STATUS_PRIJAVE', 'PRIJAVA_ODBACENA', 'AKCIJA_IZMIJENJENA',
                                'AKCIJA_OTKAZANA', 'SANACIJA_ODBIJENA')),
    poruka       TEXT        NOT NULL,
    datum        TIMESTAMPTZ NOT NULL DEFAULT now(),
    procitana    BOOLEAN     NOT NULL DEFAULT FALSE
);

-- Indeksi
CREATE INDEX idx_korisnik_uloga      ON korisnik (uloga, status_racuna);
CREATE INDEX idx_prijava_korisnik    ON prijava (id_korisnik);
CREATE INDEX idx_prijava_kategorija  ON prijava (id_kategorija);
CREATE INDEX idx_prijava_status      ON prijava (status);
CREATE INDEX idx_prijava_datum       ON prijava (datum_kreiranja);
CREATE INDEX idx_prijava_lokacija    ON prijava (latituda, longituda);
CREATE INDEX idx_akcija_udruga       ON akcija (id_udruga);
CREATE INDEX idx_akcija_datum        ON akcija (datum_vrijeme);
CREATE INDEX idx_statuslog_prijava   ON status_log (id_prijava);
CREATE INDEX idx_statuslog_korisnik  ON status_log (id_korisnik_promjena);
CREATE INDEX idx_akcprij_prijava     ON akcija_prijava (id_prijava);
CREATE INDEX idx_volonter_akcija     ON volonter_prijava (id_akcija);
CREATE INDEX idx_obavijest_korisnik  ON obavijest (id_korisnik, procitana);