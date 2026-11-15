package hr.fer.ecosentry.controller;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
import org.springframework.web.multipart.MaxUploadSizeExceededException;
import org.springframework.web.multipart.support.MissingServletRequestPartException;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.converter.HttpMessageNotReadableException;


@RestControllerAdvice
public class GreskeHandler {

    // greške koje sami bacamo, npr. new ResponseStatusException(BAD_REQUEST, "Slika je obavezna")
    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<Map<String, String>> statusGreska(ResponseStatusException e) {
        String poruka = e.getReason() != null ? e.getReason() : "Došlo je do greške";
        return odgovor(HttpStatus.valueOf(e.getStatusCode().value()), poruka);
    }

    // nedostaje polje
    @ExceptionHandler(MissingServletRequestParameterException.class)
    public ResponseEntity<Map<String, String>> nedostajeParametar(MissingServletRequestParameterException e) {
        return odgovor(HttpStatus.BAD_REQUEST, "Nedostaje polje: " + e.getParameterName());
    }

    // nema slike
    @ExceptionHandler(MissingServletRequestPartException.class)
    public ResponseEntity<Map<String, String>> nedostajeDatoteka(MissingServletRequestPartException e) {
        return odgovor(HttpStatus.BAD_REQUEST, "Nedostaje polje: " + e.getRequestPartName());
    }

    // kriva vrijednost, npr. kategorija=SMECE ili lat=abc
    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    public ResponseEntity<Map<String, String>> krivaVrijednost(MethodArgumentTypeMismatchException e) {
        return odgovor(HttpStatus.BAD_REQUEST, "Neispravna vrijednost polja: " + e.getName());
    }

    // slika veća od 10 MB
    @ExceptionHandler(MaxUploadSizeExceededException.class)
    public ResponseEntity<Map<String, String>> prevelikaSlika(MaxUploadSizeExceededException e) {
        return odgovor(HttpStatus.BAD_REQUEST, "Slika je prevelika (najviše 10 MB)");
    }

    private static ResponseEntity<Map<String, String>> odgovor(HttpStatus status, String poruka) {
        return ResponseEntity.status(status).body(Map.of("poruka", poruka));
    }

    // neispravan JSON ili nepostojeća vrijednost, npr. "status": "NESTO"
    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<Map<String, String>> neispravanJson(HttpMessageNotReadableException e) {
        return odgovor(HttpStatus.BAD_REQUEST, "Neispravni podaci");
    }
}