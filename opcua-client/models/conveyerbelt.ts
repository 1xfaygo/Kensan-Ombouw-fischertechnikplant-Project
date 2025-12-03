import { DataType, ClientSession } from "node-opcua";
import { BaseModel } from "./base";
import { Colors, ConveyerStatus } from "../enums/conveyerbelt";

export class Conveyerbelt extends BaseModel {
    constructor(session: ClientSession, ns: number) {
        super(session, ns, "Conveyerbelt");
    }

    public async readColor(): Promise<Colors> {
        return this.read("Status.Color");
    }

    public async readState(): Promise<ConveyerStatus> {
        return this.read("Status.State");
    }

    public async getAssignmentInQueue(): Promise<boolean> {
        return this.read("Status.Assignment_in_queue");
    }

    public async getQueueLength(): Promise<number> {
        return this.read("Status.Queue_length");
    }

    public async addQueue() {
        await this.write("Assignments.Add_Queue", true, DataType.Boolean);
    }
}
