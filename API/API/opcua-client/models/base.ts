import { ClientSession, AttributeIds, DataType } from "node-opcua";

export class BaseModel {
    protected session: ClientSession;
    protected ns: number;
    protected name: string;

    constructor(session: ClientSession, namespaceIndex: number, objectName: string) {
        this.session = session;
        this.ns = namespaceIndex;
        this.name = objectName;
    }

    protected nodeId(variable: string): string {
        return `ns=${this.ns};s=${this.name}.${variable}`;
    }

    protected async read(variable: string): Promise<any> {
        const nodeId = this.nodeId(variable);
        const dataValue = await this.session.read({ nodeId, attributeId: AttributeIds.Value });
        return dataValue.value.value;
    }

    protected async write(variable: string, value: any, dataType: DataType): Promise<void> {
        const nodeId = this.nodeId(variable);
        await this.session.write({
            nodeId,
            attributeId: AttributeIds.Value,
            value: { value: { dataType, value } }
        });
    }

    async isRunning() { return this.read("Running"); }
    async setRunning(value: boolean) { return this.write("Running", value, DataType.Boolean); }

    async start() {
        if (await this.isRunning()) { console.log(`${this.name} is already running.`); return; }
        await this.setRunning(true);
        console.log(`${this.name} started.`);
    }

    async stop() {
        if (!(await this.isRunning())) { console.log(`${this.name} is already stopped.`); return; }
        await this.setRunning(false);
        console.log(`${this.name} stopped.`);
    }

    async waitForFinish() {
        while (await this.isRunning()) {
            await new Promise(res => setTimeout(res, 200));
        }
    }
}
