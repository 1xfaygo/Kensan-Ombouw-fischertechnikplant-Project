import { OPCUAServer, Variant, DataType } from "node-opcua";

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

    await server.start();
    console.log("Simple OPC UA Server Running");
    console.log("Endpoint:", server.getEndpointUrl());
    console.log("NodeId to test: ns=1;s=MyNumber");
}

start();
