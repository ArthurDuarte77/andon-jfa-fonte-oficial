import { Operation } from "./operation/operation";

export interface Nodemcu {
    id?: number;
    nameId: Operation; // Nota: Pode ser outra interface que represente o modelo da relação OneToOne
    count: number;
    state: string;
    data?: Date;
    currentTC: number;
    maintenance: number;
    shortestTC: number;
}
