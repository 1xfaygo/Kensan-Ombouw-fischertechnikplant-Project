import { DataType, ClientSession } from "node-opcua";
import { BaseModel } from "./base";

export class CraneModel extends BaseModel {
    constructor(session: ClientSession, ns: number) {
        super(session, ns, "Crane");
    }

    async getCoords() { return this.read("Coords"); }
    async setCoords(value: number) { return this.write("Coords", value, DataType.Int16); }

    async isRunning() { return this.read("Running"); }
    async setRunning(value: boolean) { return this.write("Running", value, DataType.Boolean); }


    async stop() {
        await this.setRunning(false);
        console.log("Crane stopped.");
    }
}
