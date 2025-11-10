import { DataType, ClientSession } from "node-opcua";
import { BaseModel } from "./base";

export class Conveyerbelt extends BaseModel {
    constructor(session: ClientSession, ns: number) {
        super(session, ns, "Conveyerbelt");
    }

    async isRunning() { return this.read("Running"); }
    async setRunning(value: boolean) { return this.write("Running", value, DataType.Boolean); }

    async checkColor(color: "Red" | "White" | "Blue") {
        return this.read(`Color${color}`);
    }

    async moveToPosition(position: number) {
        await this.write("Position", position, DataType.Int16);
    }

    async pushItem(piston: number) {
        await this.write(`Piston${piston}`, true, DataType.Boolean);
        await this.write(`Piston${piston}`, false, DataType.Boolean);
    }


    async start() {
        if (await this.isRunning()) { console.log("Conveyerbelt is already running."); return; }
        await this.setRunning(true);
        console.log("Conveyerbelt started.");
    }

    async stop() {
        if (!(await this.isRunning())) { console.log("Conveyerbelt is already stopped."); return; }
        await this.setRunning(false);
        console.log("Conveyerbelt stopped.");
    }

}
