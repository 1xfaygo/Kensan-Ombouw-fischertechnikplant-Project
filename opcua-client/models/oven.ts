import { DataType, ClientSession } from "node-opcua";
import { BaseModel } from "./base";

export class Oven extends BaseModel {
    constructor(session: ClientSession, ns: number) {
        super(session, ns, "Oven");
    }
}
