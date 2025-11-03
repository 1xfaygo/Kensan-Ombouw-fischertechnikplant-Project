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
}
