import { OPCUAServer } from "node-opcua";
import { createCraneObject } from "./testServer/crane";
import { createWarehouseObject } from "./testServer/warehouse";
import { createOvenObject } from "./testServer/oven";
import { createConveyerbeltObject } from "./testServer/conveyerbelt";

async function start() {
    const server = new OPCUAServer({
        port: 4840,
        resourcePath: "/UA/TestServer",
        buildInfo: {
            productName: "TestServer"
        }
    });

    await server.initialize();
    const addressSpace = server.engine.addressSpace!;
    const namespace = addressSpace.getOwnNamespace();

    // Create all objects
    createCraneObject(namespace);
    createWarehouseObject(namespace);
    createOvenObject(namespace);
    createConveyerbeltObject(namespace);

    await server.start();
    console.log("Test OPC UA Server Running");
    console.log("Endpoint:", server.getEndpointUrl());
}

start();