import { DataType, ClientSession } from "node-opcua";
import { BaseModel } from "./base";

export class Crane extends BaseModel {
    constructor(session: ClientSession, ns: number) {
        super(session, ns, "Crane");
    }

    async getLocation() { return this.read("Location"); }
    async setLocation(value: number) { return this.write("Location", value, DataType.Int16); }

    async pickUp() { return this.write("PickUp", true, DataType.Boolean); }
    async drop() { return this.write("Drop", true, DataType.Boolean); }

    async moveTo(position: number) {
        await this.setLocation(position);
        await this.start();
        await this.waitForFinish();
        console.log(`Crane moving to position ${position}`);
    }

    async moveAndPickUp([pickPos, dropPos]: number[]) {
        await this.moveTo(pickPos);
        await this.pickUp();
        await this.waitForFinish();
        await this.moveTo(dropPos);
        await this.drop();
        await this.waitForFinish();
        console.log(`Crane picked up item at position ${pickPos} and dropped it at position ${dropPos}`);
    }
}
