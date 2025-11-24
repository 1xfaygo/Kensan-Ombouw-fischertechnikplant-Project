import { DataType, ClientSession } from "node-opcua";
import { BaseModel } from "./base";

export class Crane extends BaseModel {
    constructor(session: ClientSession, ns: number) {
        super(session, ns, "Crane");
    }

    async getLocation() { return this.read("Location"); }
    async setLocation(value: number) { return this.write("Location", value, DataType.Int16); }

    async pickUp() {
        await this.write("PickUp", true, DataType.Boolean);
        await this.start();
    }

    async drop() {
        await this.write("Drop", true, DataType.Boolean);
        await this.start();
    }

    async moveTo(position: number) {
        await this.setLocation(position);
        console.log(`Crane moving to position ${position}.`);
        await this.start();
    }

    async moveAndPickUp([pickPos, dropPos]: number[]) {
        await this.moveTo(pickPos);
        console.log(`Crane picking up item at position ${pickPos}.`);
        await this.pickUp();
        await this.moveTo(dropPos);
        console.log(`Crane dropping item at position ${dropPos}.`);
        await this.drop();
    }
}
