import { DataType, ClientSession } from "node-opcua";
import { BaseModel } from "./base";

export class Conveyerbelt extends BaseModel {
    constructor(session: ClientSession, ns: number) {
        super(session, ns, "Conveyerbelt");
    }

    async checkColor() {
        return this.read(`Color`);
    }

    async moveToPosition(position: number) {
        await this.write("Position", position, DataType.Int16);
    }

    async pushItem(piston: number) {
        await this.write(`Piston${piston}`, true, DataType.Boolean);
        await this.write(`Piston${piston}`, false, DataType.Boolean);
    }
}
