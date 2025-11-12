import { DataType, ClientSession } from "node-opcua";
import { BaseModel } from "./base";

export class Warehouse extends BaseModel {
    constructor(session: ClientSession, ns: number) {
        super(session, ns, "Warehouse");
    }

    async getLocation() { return [this.read("Location_X"), this.read("Location_Y")]; }
    async setLocation([Loc_X, Loc_Y]: number[]) {
        if (Loc_X < 1 || Loc_X > 3) {
            return `Location_X must be between 1 and ${3}, got ${Loc_X}`;
        }
        if (Loc_Y < 1 || Loc_Y > 3) {
            return `Location_Y must be between 1 and ${3}, got ${Loc_Y}`;
        }
        await this.write("Location_X", Loc_X, DataType.Int16);
        await this.write("Location_Y", Loc_Y, DataType.Int16);
        return `Moved to location (${Loc_X}, ${Loc_Y})`;
    }

    async getBox([Loc_X, Loc_Y]: number[]) {
        if (await this.isRunning()) { console.log(`${this.name} is already running.`); return; }
        console.log("Getting box");
        await this.setLocation([Loc_X, Loc_Y]);
        return this.write("Pickup", true, DataType.Boolean);
    }

    async storeBox([Loc_X, Loc_Y]: number[]) {
        if (await this.isRunning()) { console.log(`${this.name} is already running.`); return; }
        console.log("Storing box");
        await this.setLocation([Loc_X, Loc_Y]);
        return this.write("Store", true, DataType.Boolean);
    }
}
