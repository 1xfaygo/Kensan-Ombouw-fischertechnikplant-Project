import { DataType, ClientSession } from "node-opcua";
import { BaseModel } from "./base";

export class LoopbandModel extends BaseModel {
    constructor(session: ClientSession, ns: number) {
        super(session, ns, "Loopband");
    }

    async isRunning() { return this.read("Running"); }
    async setRunning(value: boolean) { return this.write("Running", value, DataType.Boolean); }

    async start() {
        await this.setRunning(true);
        console.log("Loopband started.");
    }

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

    async stop() {
        await this.setRunning(false);
        console.log("Loopband stopped.");
    }

}
