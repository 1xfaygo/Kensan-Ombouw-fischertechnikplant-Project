import { OPCUAClient } from "node-opcua";
import { Crane } from "./models/crane";
import { Conveyerbelt } from "./models/conveyerbelt";
import { Oven } from "./models/oven";
import { Warehouse } from "./models/warehouse";

async function main() {
    const endpoint = "opc.tcp://localhost:4840/UA/TestServer";
    const client = OPCUAClient.create({ endpointMustExist: false });

    try {
        await client.connect(endpoint);
        console.log("Connected to OPC UA server");

        const session = await client.createSession();
        const ns = 2;

        const crane = new Crane(session, ns)
        const conveyerBelt = new Conveyerbelt(session, ns);
        const oven = new Oven(session, ns);
        const warehouse = new Warehouse(session, ns);

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
