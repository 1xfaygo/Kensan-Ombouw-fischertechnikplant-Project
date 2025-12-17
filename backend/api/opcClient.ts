// src/backend/opcClient.ts
import { OPCUAClient, AttributeIds, DataType, ClientSession } from "node-opcua";
import { nodeMap } from "./nodeMap";
export { nodeMap };

const endpointUrl = "opc.tcp://localhost:4840/UA/TestServer";
let client: OPCUAClient;
let session: ClientSession;

export async function connectToOpcServer() {
  client = OPCUAClient.create({ endpointMustExist: false });
  await client.connect(endpointUrl);
  session = await client.createSession();
  console.log("✅ Verbonden met OPC UA-server:", endpointUrl);
}

export async function readNodeValue(nodeId: string) {
  if (!session) throw new Error("Session not initialized");
  const dataValue = await session.read({ nodeId, attributeId: AttributeIds.Value });
  return dataValue.value.value;
}

export async function writeNodeValue(nodeId: string, value: any) {
  if (!session) throw new Error("Session not initialized");

  const dataType =
    typeof value === "boolean"
      ? DataType.Boolean
      : typeof value === "string"
      ? DataType.String
      : DataType.Double;

  await session.write({
    nodeId,
    attributeId: AttributeIds.Value,
    value: { value: { dataType, value } },
  });
  return true;
}

export async function readAllNodes() {
  const result: Record<string, any> = {};
  for (const name in nodeMap) {
    try {
      const value = await readNodeValue(nodeMap[name]);
      result[name] = value;
    } catch (err) {
      result[name] = null;
    }
  }
  return result;
}
