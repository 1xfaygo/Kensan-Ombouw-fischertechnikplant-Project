import { OPCUAClient, AttributeIds, DataType, WriteValueOptions } from "node-opcua";

const endpointUrl = "opc.tcp://PC:4840/UA/TestServer";

async function testClient() {
  const client = OPCUAClient.create({});
  await client.connect(endpointUrl);
  const session = await client.createSession();

  const nodeId = "ns=1;s=Conveyerbelt.Running";

  // Read current value
  const dataValue = await session.read({ nodeId, attributeId: AttributeIds.Value });
  console.log("Current value:", dataValue.value.value);

  // Toggle the value
  const newValue = !dataValue.value.value;

  const writeValue: WriteValueOptions = {
    nodeId,
    attributeId: AttributeIds.Value,
    value: { value: { dataType: DataType.Boolean, value: newValue } },
  };

  await session.write([writeValue]);
  console.log("Toggled to:", newValue);

  // Confirm change
  const updated = await session.read({ nodeId, attributeId: AttributeIds.Value });
  console.log("Updated value:", updated.value.value);

  await session.close();
  await client.disconnect();
}

testClient().catch(console.error);
