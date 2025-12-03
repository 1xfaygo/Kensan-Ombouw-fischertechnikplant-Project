import { DataType, ClientSession } from "node-opcua";
import { BaseModel } from "./base";
import { OvenStatus } from "../enums/oven";

export class Oven extends BaseModel {
    constructor(session: ClientSession, ns: number) {
        super(session, ns, "Oven");
    }

    public async readState(): Promise<OvenStatus> {
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
