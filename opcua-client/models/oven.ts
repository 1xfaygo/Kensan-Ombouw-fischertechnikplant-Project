import { DataType, ClientSession } from "node-opcua";
import { BaseModel } from "./base";

export class Oven extends BaseModel {
    constructor(session: ClientSession, ns: number) {
        super(session, ns, "Oven");
    }

    async isRunning() { return this.read("Running"); }
    async setRunning(value: boolean) { return this.write("Running", value, DataType.Boolean); }


    async stop() {
        if (!(await this.isRunning())) {
            console.log("Oven is already stopped.");
            return;
        }
        await this.setRunning(false);
        console.log("Oven stopped.");
    }

    async start() {
        if (await this.isRunning()) {
            console.log("Oven is already running.");
            return;
        }
        await this.setRunning(true);
        console.log("Oven started")
    }
}
