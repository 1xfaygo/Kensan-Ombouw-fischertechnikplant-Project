import { DataType, ClientSession } from "node-opcua";
import { BaseModel } from "./base";
import { CraneDestinations, CraneStatus } from "../enums/crane";

export class Crane extends BaseModel {
    constructor(session: ClientSession, ns: number) {
        super(session, ns, "Crane");
    }

    public async readState(): Promise<CraneStatus> {
        return this.read("Status.State");
    }

    public async getSource(): Promise<CraneDestinations> {
        return this.read("Status.source");
    }

    public async getDestination(): Promise<CraneDestinations> {
        return this.read("Status.destination");
    }

    public async getAssignmentSource(): Promise<CraneDestinations> {
        return this.read("Status.Assignment_source");
    }

    public async getAssignmentDestination(): Promise<CraneDestinations> {
        return this.read("Status.Assignment_destination");
    }

    public async writeAssignment(source: CraneDestinations, destination: CraneDestinations) {
        await this.write("Assignments.source", source, DataType.Int16);
        await this.write("Assignments.destination", destination, DataType.Int16);
    }
}
