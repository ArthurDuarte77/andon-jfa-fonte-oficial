export interface Reproducao {
    id:     number;
    nameId: NameID;
    codigo: string;
}

export interface NameID {
    id:      number;
    name:    string;
    ocupado: boolean;
    pausa:   boolean;
    analise: boolean;
}
