package hr.fer.ecosentry.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.function.Executable;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;
import org.mockito.ArgumentCaptor;
import org.springframework.http.HttpStatus;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.web.server.ResponseStatusException;

import hr.fer.ecosentry.dto.PrijavaDto;
import hr.fer.ecosentry.dto.PrijavaIzmjenaDto;
import hr.fer.ecosentry.model.Kategorija;
import hr.fer.ecosentry.model.Korisnik;
import hr.fer.ecosentry.model.NacinSanacije;
import hr.fer.ecosentry.model.Prijava;
import hr.fer.ecosentry.model.StatusPrijave;
import hr.fer.ecosentry.model.Uloga;
import hr.fer.ecosentry.repository.KategorijaRepository;
import hr.fer.ecosentry.repository.KorisnikRepository;
import hr.fer.ecosentry.repository.PrijavaRepository;

/**
 * Jedinicni testovi poslovnih pravila prijava otpada (PrijavaService).
 * Repozitoriji i SlikaService su lazni (Mockito), pa testovi NE trebaju bazu,
 * Google ni mrezu. Pokretanje: ./mvnw test (iz mape backend).
 *
 * Oznake CT-xx odgovaraju ispitnim slucajevima u docs/5-Ispitivanje.md.
 */
class PrijavaServiceTest {

    private PrijavaRepository prijavaRepository;
    private KorisnikRepository korisnikRepository;
    private KategorijaRepository kategorijaRepository;
    private SlikaService slikaService;
    private PrijavaService service;

    private Korisnik ana;      // gradanka, id 1
    private Korisnik ivo;      // gradanin, id 2
    private Korisnik redar;    // redar, id 3
    private Korisnik udruga;   // udruga, id 4
    private Kategorija plastika;
    private MockMultipartFile slika;

    @BeforeEach
    void priprema() {
        prijavaRepository = mock(PrijavaRepository.class);
        korisnikRepository = mock(KorisnikRepository.class);
        kategorijaRepository = mock(KategorijaRepository.class);
        slikaService = mock(SlikaService.class);
        service = new PrijavaService(prijavaRepository, korisnikRepository, kategorijaRepository, slikaService);

        ana = korisnik(1L, "ana@example.com", Uloga.GRADANIN);
        ivo = korisnik(2L, "ivo@example.com", Uloga.GRADANIN);
        redar = korisnik(3L, "redar@example.com", Uloga.REDAR);
        udruga = korisnik(4L, "udruga@example.com", Uloga.UDRUGA);
        plastika = kategorija(1L, "Plastika");
        slika = new MockMultipartFile("slika", "otpad.jpg", "image/jpeg", new byte[] {1, 2, 3});

        when(korisnikRepository.findByEmail("ana@example.com")).thenReturn(Optional.of(ana));
        when(korisnikRepository.findByEmail("ivo@example.com")).thenReturn(Optional.of(ivo));
        when(korisnikRepository.findByEmail("redar@example.com")).thenReturn(Optional.of(redar));
        when(korisnikRepository.findByEmail("udruga@example.com")).thenReturn(Optional.of(udruga));
        when(prijavaRepository.save(any(Prijava.class))).thenAnswer(poziv -> poziv.getArgument(0));
    }

    // ---------------------------------------------------------------- stvori

    // CT-01
    @Test
    void stvori_valjanaPrijava_spremaSePrijavaSaStatusomPrijavljeno() {
        when(kategorijaRepository.findById(1L)).thenReturn(Optional.of(plastika));
        when(slikaService.spremi(slika)).thenReturn("http://localhost:8080/uploads/a.jpg");

        PrijavaDto dto = service.stvori("ana@example.com", slika, 45.8150, 15.9819, 1L);

        assertEquals(StatusPrijave.PRIJAVLJENO, dto.status());
        assertFalse(dto.provjerena());
        assertEquals("http://localhost:8080/uploads/a.jpg", dto.slikaUrl());
        assertEquals(45.8150, dto.lat().doubleValue(), 1e-9);
        assertEquals(15.9819, dto.lng().doubleValue(), 1e-9);
        assertEquals("Plastika", dto.kategorija().naziv());
        assertNotNull(dto.prijavitelj());
        assertEquals(1L, dto.prijavitelj().id());

        ArgumentCaptor<Prijava> spremljena = ArgumentCaptor.forClass(Prijava.class);
        verify(prijavaRepository).save(spremljena.capture());
        assertEquals(ana, spremljena.getValue().getPrijavitelj());
    }

    // CT-02
    @ParameterizedTest
    @CsvSource({"90.5,10", "-90.5,10", "10,180.5", "10,-180.5"})
    void stvori_lokacijaIzvanGranica_vracaBadRequestINistaSeNeSprema(double lat, double lng) {
        ResponseStatusException e = greska(() -> service.stvori("ana@example.com", slika, lat, lng, 1L));

        assertEquals(HttpStatus.BAD_REQUEST.value(), e.getStatusCode().value());
        verify(slikaService, never()).spremi(any());
        verify(prijavaRepository, never()).save(any());
    }

    // CT-03
    @Test
    void stvori_bezKategorije_vracaBadRequest() {
        ResponseStatusException e = greska(() -> service.stvori("ana@example.com", slika, 45.8, 15.9, null));

        assertEquals(HttpStatus.BAD_REQUEST.value(), e.getStatusCode().value());
        verify(prijavaRepository, never()).save(any());
    }

    // CT-04
    @Test
    void stvori_nepostojecaKategorija_vracaBadRequestINeSpremaSliku() {
        when(kategorijaRepository.findById(99L)).thenReturn(Optional.empty());

        ResponseStatusException e = greska(() -> service.stvori("ana@example.com", slika, 45.8, 15.9, 99L));

        assertEquals(HttpStatus.BAD_REQUEST.value(), e.getStatusCode().value());
        verify(slikaService, never()).spremi(any());
        verify(prijavaRepository, never()).save(any());
    }

    // CT-05
    @Test
    void stvori_blokiranKorisnik_vracaForbidden() {
        ana.blokiraj("lazne prijave");

        ResponseStatusException e = greska(() -> service.stvori("ana@example.com", slika, 45.8, 15.9, 1L));

        assertEquals(HttpStatus.FORBIDDEN.value(), e.getStatusCode().value());
        verify(slikaService, never()).spremi(any());
        verify(prijavaRepository, never()).save(any());
    }

    // CT-06
    @Test
    void stvori_nepoznatKorisnik_vracaUnauthorized() {
        ResponseStatusException e = greska(() -> service.stvori("nepoznat@example.com", slika, 45.8, 15.9, 1L));

        assertEquals(HttpStatus.UNAUTHORIZED.value(), e.getStatusCode().value());
        verify(prijavaRepository, never()).save(any());
    }

    // -------------------------------------------------------------- izmijeni

    // CT-07
    @Test
    void izmijeni_bezPodataka_vracaBadRequest() {
        ResponseStatusException e = greska(() -> service.izmijeni(10L, izmjena(null, null, null, null)));

        assertEquals(HttpStatus.BAD_REQUEST.value(), e.getStatusCode().value());
    }

    // CT-08
    @Test
    void izmijeni_prihvacanje_postavljaProvjerenaIStatusOstajePrijavljeno() {
        Prijava p = prijava(10L, ana, StatusPrijave.PRIJAVLJENO, false);
        when(prijavaRepository.findById(10L)).thenReturn(Optional.of(p));

        PrijavaDto dto = service.izmijeni(10L, izmjena(true, null, null, null));

        assertTrue(dto.provjerena());
        assertEquals(StatusPrijave.PRIJAVLJENO, dto.status());
    }

    // CT-09
    @Test
    void izmijeni_odbacivanje_postavljaStatusOdbacenoIProvjerena() {
        Prijava p = prijava(10L, ana, StatusPrijave.PRIJAVLJENO, false);
        when(prijavaRepository.findById(10L)).thenReturn(Optional.of(p));

        PrijavaDto dto = service.izmijeni(10L, izmjena(null, StatusPrijave.ODBACENO, null, null));

        assertEquals(StatusPrijave.ODBACENO, dto.status());
        assertTrue(dto.provjerena());
    }

    // CT-10
    @Test
    void izmijeni_vecOdbacenaPrijava_prihvacanjeIOdbacivanjeVracajuConflict() {
        Prijava p = prijava(10L, ana, StatusPrijave.ODBACENO, true);
        when(prijavaRepository.findById(10L)).thenReturn(Optional.of(p));

        ResponseStatusException prihvacanje = greska(() -> service.izmijeni(10L, izmjena(true, null, null, null)));
        ResponseStatusException odbacivanje =
                greska(() -> service.izmijeni(10L, izmjena(null, StatusPrijave.ODBACENO, null, null)));

        assertEquals(HttpStatus.CONFLICT.value(), prihvacanje.getStatusCode().value());
        assertEquals(HttpStatus.CONFLICT.value(), odbacivanje.getStatusCode().value());
    }

    // CT-11
    @Test
    void izmijeni_nepostojecaPrijava_vracaNotFound() {
        when(prijavaRepository.findById(404L)).thenReturn(Optional.empty());

        ResponseStatusException e = greska(() -> service.izmijeni(404L, izmjena(true, null, null, null)));

        assertEquals(HttpStatus.NOT_FOUND.value(), e.getStatusCode().value());
    }

    // CT-12
    @Test
    void izmijeni_slanjeUdrugamaPrijeNegoJePrihvacena_vracaConflict() {
        Prijava p = prijava(10L, ana, StatusPrijave.PRIJAVLJENO, false);
        when(prijavaRepository.findById(10L)).thenReturn(Optional.of(p));

        ResponseStatusException e =
                greska(() -> service.izmijeni(10L, izmjena(null, null, NacinSanacije.UDRUGA, null)));

        assertEquals(HttpStatus.CONFLICT.value(), e.getStatusCode().value());
    }

    // CT-13
    @Test
    void izmijeni_slanjeUdrugamaNakonPrihvacanja_postavljaNacinSanacije() {
        Prijava p = prijava(10L, ana, StatusPrijave.PRIJAVLJENO, true);
        when(prijavaRepository.findById(10L)).thenReturn(Optional.of(p));

        PrijavaDto dto = service.izmijeni(10L, izmjena(null, null, NacinSanacije.UDRUGA, null));

        assertEquals(NacinSanacije.UDRUGA, dto.nacinSanacije());
        assertEquals(StatusPrijave.PRIJAVLJENO, dto.status());
    }

    // CT-14
    @Test
    void izmijeni_promjenaKategorije_mijenjaKategorijuAliNeOdbacenojPrijavi() {
        Kategorija staklo = kategorija(2L, "Staklo");
        when(kategorijaRepository.findById(2L)).thenReturn(Optional.of(staklo));
        Prijava aktivna = prijava(10L, ana, StatusPrijave.PRIJAVLJENO, false);
        Prijava odbacena = prijava(11L, ana, StatusPrijave.ODBACENO, true);
        when(prijavaRepository.findById(10L)).thenReturn(Optional.of(aktivna));
        when(prijavaRepository.findById(11L)).thenReturn(Optional.of(odbacena));

        PrijavaDto dto = service.izmijeni(10L, izmjena(null, null, null, 2L));
        ResponseStatusException e = greska(() -> service.izmijeni(11L, izmjena(null, null, null, 2L)));

        assertEquals("Staklo", dto.kategorija().naziv());
        assertEquals(HttpStatus.CONFLICT.value(), e.getStatusCode().value());
    }

    // ------------------------------------------------------- dohvatiVidljive

    // CT-15
    @Test
    void dohvatiVidljive_gradaninVidiPrijaviteljaSamoSvojihPrijava_redarSvih() {
        Prijava anina = prijava(10L, ana, StatusPrijave.PRIJAVLJENO, false);
        Prijava ivina = prijava(11L, ivo, StatusPrijave.PRIJAVLJENO, false);
        when(prijavaRepository.findByStatusNotInOrderByDatumDesc(any())).thenReturn(List.of(anina, ivina));

        List<PrijavaDto> zaAnu = service.dohvatiVidljive("ana@example.com", null, null);
        List<PrijavaDto> zaRedara = service.dohvatiVidljive("redar@example.com", null, null);

        assertEquals(2, zaAnu.size());
        assertNotNull(zaAnu.get(0).prijavitelj());
        assertNull(zaAnu.get(1).prijavitelj());
        assertNotNull(zaRedara.get(0).prijavitelj());
        assertNotNull(zaRedara.get(1).prijavitelj());
    }

    // CT-16
    @Test
    void dohvatiVidljive_udrugaVidiSamoPrijavePoslaneUdrugama() {
        Prijava zaUdrugu = prijava(10L, ana, StatusPrijave.PRIJAVLJENO, true);
        zaUdrugu.setNacinSanacije(NacinSanacije.UDRUGA);
        Prijava bezOdluke = prijava(11L, ana, StatusPrijave.PRIJAVLJENO, false);
        when(prijavaRepository.findByStatusNotInOrderByDatumDesc(any())).thenReturn(List.of(zaUdrugu, bezOdluke));

        List<PrijavaDto> rezultat = service.dohvatiVidljive("udruga@example.com", null, null);

        assertEquals(1, rezultat.size());
        assertEquals(10L, rezultat.get(0).id());
    }

    // CT-17
    @Test
    void dohvatiVidljive_filtriStatusIProvjerenaSuzavajuPopis() {
        Prijava nova = prijava(10L, ana, StatusPrijave.PRIJAVLJENO, false);
        Prijava prihvacena = prijava(11L, ana, StatusPrijave.PRIJAVLJENO, true);
        Prijava uAkciji = prijava(12L, ana, StatusPrijave.AKCIJA_U_TIJEKU, true);
        when(prijavaRepository.findByStatusNotInOrderByDatumDesc(any())).thenReturn(List.of(nova, prihvacena, uAkciji));

        List<PrijavaDto> neprovjerene = service.dohvatiVidljive("redar@example.com", null, false);
        List<PrijavaDto> uTijeku = service.dohvatiVidljive("redar@example.com", StatusPrijave.AKCIJA_U_TIJEKU, null);

        assertEquals(1, neprovjerene.size());
        assertEquals(10L, neprovjerene.get(0).id());
        assertEquals(1, uTijeku.size());
        assertEquals(12L, uTijeku.get(0).id());
    }

    // CT-18
    @Test
    @SuppressWarnings("unchecked")
    void dohvatiVidljive_upitIskljucujeOdbaceneISluzbeneSanacije() {
        when(prijavaRepository.findByStatusNotInOrderByDatumDesc(any())).thenReturn(List.of());

        service.dohvatiVidljive("ana@example.com", null, null);

        ArgumentCaptor<Collection<StatusPrijave>> statusi = ArgumentCaptor.forClass(Collection.class);
        verify(prijavaRepository).findByStatusNotInOrderByDatumDesc(statusi.capture());
        assertTrue(statusi.getValue().contains(StatusPrijave.ODBACENO));
        assertTrue(statusi.getValue().contains(StatusPrijave.SLUZBENA_SANACIJA));
    }

    // --------------------------------------------------------------- dohvati

    // CT-19
    @Test
    void dohvati_tudjaOdbacenaPrijava_vracaNotFound() {
        Prijava ivina = prijava(10L, ivo, StatusPrijave.ODBACENO, true);
        when(prijavaRepository.findById(10L)).thenReturn(Optional.of(ivina));

        ResponseStatusException e = greska(() -> service.dohvati(10L, "ana@example.com"));

        assertEquals(HttpStatus.NOT_FOUND.value(), e.getStatusCode().value());
    }

    // CT-20
    @Test
    void dohvati_vlastitaOdbacenaPrijavaIRedarVidiOdbacenu() {
        Prijava anina = prijava(10L, ana, StatusPrijave.ODBACENO, true);
        when(prijavaRepository.findById(10L)).thenReturn(Optional.of(anina));

        PrijavaDto zaPrijavitelja = service.dohvati(10L, "ana@example.com");
        PrijavaDto zaRedara = service.dohvati(10L, "redar@example.com");

        assertEquals(10L, zaPrijavitelja.id());
        assertEquals(10L, zaRedara.id());
    }

    // CT-21
    @Test
    void dohvati_udrugaNeVidiPrijavuKojaNijePoslanaUdrugama() {
        Prijava bezOdluke = prijava(10L, ana, StatusPrijave.PRIJAVLJENO, true);
        when(prijavaRepository.findById(10L)).thenReturn(Optional.of(bezOdluke));

        ResponseStatusException e = greska(() -> service.dohvati(10L, "udruga@example.com"));

        assertEquals(HttpStatus.NOT_FOUND.value(), e.getStatusCode().value());
    }

    // ----------------------------------------------------------- pomocne metode

    private static ResponseStatusException greska(Executable radnja) {
        return assertThrows(ResponseStatusException.class, radnja);
    }

    private static PrijavaIzmjenaDto izmjena(Boolean provjerena, StatusPrijave status,
                                             NacinSanacije nacinSanacije, Long kategorija) {
        return new PrijavaIzmjenaDto(provjerena, status, nacinSanacije, kategorija);
    }

    // id se u entitetima postavlja tek pri spremanju u bazu, pa ga u testu upisujemo refleksijom
    private static Korisnik korisnik(long id, String email, Uloga uloga) {
        Korisnik k = new Korisnik("Korisnik " + id, email, uloga);
        ReflectionTestUtils.setField(k, "id", id);
        return k;
    }

    private static Kategorija kategorija(long id, String naziv) {
        Kategorija k = new Kategorija(naziv);
        ReflectionTestUtils.setField(k, "id", id);
        return k;
    }

    private Prijava prijava(long id, Korisnik prijavitelj, StatusPrijave status, boolean provjerena) {
        Prijava p = new Prijava();
        ReflectionTestUtils.setField(p, "id", id);
        p.setPrijavitelj(prijavitelj);
        p.setKategorija(plastika);
        p.setLat(45.8150);
        p.setLng(15.9819);
        p.setSlikaUrl("http://localhost:8080/uploads/" + id + ".jpg");
        p.setStatus(status);
        p.setProvjerena(provjerena);
        return p;
    }
}
