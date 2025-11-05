import { DataType, ClientSession } from "node-opcua";
import { BaseModel } from "./base";

export class OvenModel extends BaseModel {

    constructor(session: ClientSession, ns: number) {
        super(session, ns, "Oven"); 
    }

    async getStatus() { 
        return this.read("Status"); 
    }
    async setStatus(value: boolean) { 
        return this.write("Status", value, DataType.Boolean);
    }

    async isDoorOpen() { 
        return this.read("Door"); 
    }
    async setDoor(value: boolean) { 
        return this.write("Door", value, DataType.Boolean);
    }

    async isZaagOn() { 
        return this.read("Zaag"); 
    }
    async setZaag(value: boolean) { 
        return this.write("Zaag", value, DataType.Boolean);
    }
    
    async hasItem() { 
        return this.read("HasItem"); 
    }
    async setHasItem(value: boolean) { 
        return this.write("HasItem", value, DataType.Boolean);
    }
    
    async hasDropped() { 
        return this.read("HasDropped"); 
    }
    async setHasDropped(value: boolean) { 
        return this.write("HasDropped", value, DataType.Boolean);
    }

    
    async init() {
        console.log("Oven: Geïnitialiseerd.");
    }

    async startOven() {
        console.log("Oven: Stuur 'status = true' commando.");
        await this.setStatus(true);
    }

    async loadAndProcess() {
        console.log("Oven: Start 'loadAndProcess' cyclus...");
        await this.setDoor(true);
        await this.wait(200);
        await this.setHasItem(true);
        await this.wait(5000);
        await this.setZaag(true);
        await this.wait(5000);
        await this.setZaag(false);
        await this.setHasDropped(true);
        console.log("Oven: 'loadAndProcess' cyclus voltooid.");
    }

    private wait(ms: number): Promise<void> {
        return new Promise(r => setTimeout(r, ms));
    }

    on(signaalNaam: string, luisterFunctie: (...args: any[]) => void) {
        console.warn(`[WAARSCHUWING] Oven kan niet luisteren naar '${signaalNaam}'. 
        De 'base.ts' mist een EventEmitter en 'subscribe' functie.`);
    }
}