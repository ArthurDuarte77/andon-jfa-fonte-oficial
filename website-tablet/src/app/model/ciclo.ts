export interface Ciclo {
  id: number;
  nameId: NameID;
  count: number;
  time: number;
  data: number;
}

export interface NameID {
  id: number;
  name: string;
  ocupado: boolean;
  pausa: boolean;
  analise: boolean;
}
