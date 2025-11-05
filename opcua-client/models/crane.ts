import { DataType, ClientSession } from "node-opcua";
import { BaseModel } from "./base";

export class Crane extends BaseModel {
    constructor(session: ClientSession, ns: number) {
        super(session, ns, "Crane");
    }

    async getLocation() { return this.read("Location"); }
    async setLocation(value: number) { return this.write("Location", value, DataType.Int16); }

    async isRunning() { return this.read("Running"); }
    async setRunning(value: boolean) { return this.write("Running", value, DataType.Boolean); }


    async stop() {
        await this.setRunning(false);
        console.log("Crane stopped.");
    }

    async start() {
        await this.setRunning(true);
        console.log("Crane started")
    }
}
