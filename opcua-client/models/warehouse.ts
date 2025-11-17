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
        console.log(`Moved to location : X: ${Loc_X}, Y: ${Loc_Y}.`)
        return [this.write("Location_X", Loc_X, DataType.Int16), this.write("Location_Y", Loc_Y, DataType.Int16)];
    }

    async getBox([Loc_X, Loc_Y]: number[]) {
        if (await this.isRunning()) { console.log(`${this.name} is already running.`); return; }
        console.log(`Getting box at location: X: ${Loc_X}, Y: ${Loc_Y}.`);
        await this.setLocation([Loc_X, Loc_Y]);
        this.write("Pickup", true, DataType.Boolean);
        await this.start();
    }

    async storeBox([Loc_X, Loc_Y]: number[]) {
        if (await this.isRunning()) { console.log(`${this.name} is already running.`); return; }
        console.log(`Storing box at location: X: ${Loc_X}, Y: ${Loc_Y}.`);
        await this.setLocation([Loc_X, Loc_Y]);
        this.write("Store", true, DataType.Boolean);
        await this.start();
    }
}
