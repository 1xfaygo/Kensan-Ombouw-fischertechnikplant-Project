import { OPCUAClient } from "node-opcua";
import { Crane } from "./models/crane";
import { Conveyerbelt } from "./models/conveyerbelt";
import { Oven } from "./models/oven";
import { Warehouse } from "./models/warehouse";

async function main() {
    const endpoint = "opc.tcp://localhost:4840/UA/TestServer/GVL/Interface";
    const client = OPCUAClient.create({ endpointMustExist: false });

    try {
        await client.connect(endpoint);
        console.log("Connected to OPC UA server");

        const session = await client.createSession();
        const ns = 1;

        const crane = new Crane(session, ns)
        const conveyerBelt = new Conveyerbelt(session, ns);
        const oven = new Oven(session, ns);
        const warehouse = new Warehouse(session, ns);

        warehouse.calibrate();
        crane.calibrate();
        oven.calibrate();
        conveyerBelt.calibrate();

        warehouse.start();
        crane.start();
        oven.start();
        conveyerBelt.start();

        warehouse.writeAssignment([1, 1], 0);
        crane.writeAssignment(3, 2);
        oven.addQueue();
        conveyerBelt.addQueue();
        crane.writeAssignment(4, 3);
        warehouse.writeAssignment([1, 1], 1);

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
