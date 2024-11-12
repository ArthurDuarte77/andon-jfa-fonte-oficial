export interface Video {
    id:      number;
    nameId:  NameID;
    data:    number;
    horario: number[];
}

export interface VideoShort {
    name:    string;
    data:    number;
    horario: number[];
}

export interface NameID {
    id:      number;
    name:    string;
    ocupado: boolean;
    pausa:   boolean;
    analise: boolean;
}
