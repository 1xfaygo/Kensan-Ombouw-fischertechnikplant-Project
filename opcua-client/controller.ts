import { OPCUAClient } from "node-opcua-client";

async function main() {
    const endpoint = "opc.tcp://localhost:4840/???/???/";
    const client = OPCUAClient.create({ endpointMustExist: false });

    try {
        console.log("Connecting to", endpoint);
        await client.connect(endpoint);
        console.log("Connected to OPC UA server");

        const session = await client.createSession();
        console.log("Session created");

        const ns = 2;

        await session.close();
        console.log("Session closed");

    } catch (err) {
        console.error("OPC UA Error:", err);
    } finally {
        await client.disconnect();
        console.log("Disconnected from OPC UA server");
    }
}

main();
