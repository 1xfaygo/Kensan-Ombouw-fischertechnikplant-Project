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

    async pickUp() { return this.write("PickUp", true, DataType.Boolean); }
    async drop() { return this.write("Drop", true, DataType.Boolean); }


    async stop() {
        if (!(await this.isRunning())) { console.log("Crane is already stopped."); return; }
        await this.setRunning(false);
        console.log("Crane stopped.");
    }

    async start() {
        if (await this.isRunning()) { console.log("Crane is already running."); return; }
        await this.setRunning(true);
        console.log("Crane started.");
    }

    async waitForFinish() {
        while (await this.isRunning()) {
            await new Promise(res => setTimeout(res, 200));
        }
    }

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
