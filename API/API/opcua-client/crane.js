import { OPCUAServer } from "node-opcua";
import { createConveyerbeltObject } from "./crane.js";

const server = new OPCUAServer({
  port: 4840,
  resourcePath: "/UA/ConveyerDemo",
  buildInfo: {
    productName: "ConveyerbeltTestServer",
    buildNumber: "1",
    buildDate: new Date(),
  },
});

async function startServer() {
  await server.initialize();
  const addressSpace = server.engine.addressSpace;
  const namespace = addressSpace.getOwnNamespace();

  // Add your custom object
  createConveyerbeltObject(namespace);

  await server.start();
  console.log("✅ OPC UA Server running at:", server.getEndpointUrl());
}

startServer().catch(console.error);
