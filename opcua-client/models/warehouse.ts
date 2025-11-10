import { DataType, ClientSession } from "node-opcua";
import { BaseModel } from "./base";

export class Warehouse extends BaseModel {
    constructor(session: ClientSession, ns: number) {
        super(session, ns, "Warehouse");
    }

    async getLocation() { return [this.read("Location_X"), this.read("Location_Y")]; }
    async setLocation([Loc_X, Loc_Y]: number[]) { return this.write("Location_X", Loc_X, DataType.Int16), this.write("Location_Y", Loc_Y, DataType.Int16); }

    async isRunning() { return this.read("Running"); }
    async setRunning(value: boolean) { return this.write("Running", value, DataType.Boolean); }

    async getBox([Loc_X, Loc_Y]: number[]) {
        if (await this.isRunning()) { console.log("Warehouse is already running."); return; }
        console.log(`Getting box`);
        await this.setLocation([Loc_X, Loc_Y]);
        return this.write("pickup", true, DataType.Boolean);
    }

    async storeBox([Loc_X, Loc_Y]: number[]) {
        if (await this.isRunning()) { console.log("Warehouse is already running."); return; }
        console.log("Storing box");
        await this.setLocation([Loc_X, Loc_Y]);
        return this.write("store", true, DataType.Boolean);
    }

    async stop() {
        if (!(await this.isRunning())) { console.log("Warehouse is already stopped."); return; }
        await this.setRunning(false);
        console.log("Warehouse stopped.");
    }
}
