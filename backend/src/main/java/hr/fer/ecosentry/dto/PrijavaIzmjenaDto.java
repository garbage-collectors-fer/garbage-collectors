package hr.fer.ecosentry.dto;

import hr.fer.ecosentry.model.NacinSanacije;
import hr.fer.ecosentry.model.StatusPrijave;

public record PrijavaIzmjenaDto(Boolean provjerena,
                                StatusPrijave status,
                                NacinSanacije nacinSanacije,
                                Long kategorija) {     //ID kategorije iz tablice kategorija

}