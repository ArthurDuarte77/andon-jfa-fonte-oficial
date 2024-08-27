export interface Nodemcu {
    id?:             number;
    nameId:         NameID;
    contador:       Contador;
    count:          number;
    firtlastTC:     number;
    state:          string;
    currentTC:      number;
    analise:        number;
    time_excess:    number;
    maintenance:    number;
    secondtlastTC:  number;
    ajuda:          number;
    thirdlastTC:    number;
    shortestTC:     number;
    qtdeTCexcedido: number;
    tcmedio:        number;
}

export interface Contador {
    id:            number;
    contadorAtual: number;
    _couting:      boolean;
}

export interface NameID {
    id:      number;
    name:    string;
    ocupado: boolean;
    pausa:   boolean;
    analise: boolean;
}
