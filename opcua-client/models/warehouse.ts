import { DataType, ClientSession } from "node-opcua";
import { BaseModel } from "./base";

export class Warehouse extends BaseModel {
    constructor(session: ClientSession, ns: number) {
        super(session, ns, "Warehouse");
    }

    async getLocation() { return [this.read("Location_X"), this.read("Location_Y")]; }
    async setLocation(value: Array<number>) { return this.write("Location_X", value[0], DataType.Int16), this.write("Location_Y", value[1], DataType.Int16); }

    async isRunning() { return this.read("Running"); }
    async setRunning(value: boolean) { return this.write("Running", value, DataType.Boolean); }

    async getBox() {
        if (await this.isRunning()) {
            console.log("Warehouse is already running.");
            return;
        }
        console.log(`Getting box`);
        return this.write("pickup", true, DataType.Boolean);
    }

    async storeBox() {
        if (await this.isRunning()) {
            console.log("Warehouse is already running.");
            return;
        }
        console.log("Storing box");
        return this.write("store", true, DataType.Boolean);
    }

    async stop() {
        if (!(await this.isRunning())) {
            console.log("Warehouse is already stopped.");
            return;
        }
        await this.setRunning(false);
        console.log("Warehouse stopped.");
    }
}
