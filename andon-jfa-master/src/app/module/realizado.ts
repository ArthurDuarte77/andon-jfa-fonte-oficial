export interface Realizado {
  id: number;
  nameId: NameID;
  horas7: number;
  horas8: number;
  horas9: number;
  horas10: number;
  horas11: number;
  horas12: number;
  horas13: number;
  horas14: number;
  horas15: number;
  horas16: number;
  horas17: number;
}

export interface NameID {
  id:      number;
  name:    string;
  ocupado: boolean;
  pausa:   boolean;
  analise: boolean;
}


export interface Minutos{
  minutos7: boolean;
  minutos8: boolean;
  minutos9: boolean;
  minutos10: boolean;
  minutos11: boolean;
  minutos12: boolean;
  minutos13: boolean;
  minutos14: boolean;
  minutos15: boolean;
  minutos16: boolean;
  minutos17: boolean;
}