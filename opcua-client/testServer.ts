import { OPCUAServer, Variant, DataType, StatusCodes } from "node-opcua";

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

    let craneRunning = false;
    let cranePos = 0;

    const warehouse = namespace.addObject({
        browseName: "Warehouse",
        organizedBy: addressSpace.rootFolder.objects
    });

    namespace.addVariable({
        componentOf: warehouse,
        browseName: "Running",
        nodeId: "ns=1;s=Warehouse.Running",
        minimumSamplingInterval: 100,
        dataType: "Boolean",
        value: {
            get: () => new Variant({ dataType: DataType.Boolean, value: false }),
            set: (variant) => {
                console.log(`Warehouse running state set to ${variant.value}`);
                return StatusCodes.Good;
            }
        }
    });

    namespace.addVariable({
        componentOf: warehouse,
        browseName: "Location_X",
        nodeId: "ns=1;s=Warehouse.Location_X",
        minimumSamplingInterval: 100,
        dataType: "Int16",
        value: {
            get: () => new Variant({ dataType: DataType.Int16, value: 1 }),
            set: (variant) => {
                console.log(`Warehouse Location_X set to ${variant.value}`);
                return StatusCodes.Good;
            }
        }
    });

    namespace.addVariable({
        componentOf: warehouse,
        browseName: "Location_Y",
        nodeId: "ns=1;s=Warehouse.Location_Y",
        minimumSamplingInterval: 100,
        dataType: "Int16",
        value: {
            get: () => new Variant({ dataType: DataType.Int16, value: 1 }),
            set: (variant) => {
                console.log(`Warehouse Location_Y set to ${variant.value}`);
                return StatusCodes.Good;
            }
        }
    });

    const crane = namespace.addObject({
        browseName: "Crane",
        organizedBy: addressSpace.rootFolder.objects
    });

    namespace.addVariable({
        componentOf: crane,
        browseName: "Running",
        nodeId: "ns=1;s=Crane.Running",
        minimumSamplingInterval: 100,
        dataType: "Boolean",
        value: {
            get: () => new Variant({ dataType: DataType.Boolean, value: craneRunning }),
            set: (variant) => {
                craneRunning = variant.value;
                console.log(`Crane running state set to ${variant.value}`);

                if (craneRunning) {
                    setTimeout(() => {
                        craneRunning = false;
                        console.log(`Crane finished moving to position ${cranePos}`);
                    }, 2000);
                }
                return StatusCodes.Good;
            }
        }
    });

    namespace.addVariable({
        componentOf: crane,
        browseName: "Location",
        nodeId: "ns=1;s=Crane.Location",
        minimumSamplingInterval: 100,
        dataType: "Int16",
        value: {
            get: () => new Variant({ dataType: DataType.Int16, value: cranePos }),
            set: (variant) => {
                cranePos = variant.value;
                console.log(`Crane position set to ${variant.value}`);
                return StatusCodes.Good;
            }
        }
    });

    namespace.addVariable({
        componentOf: crane,
        browseName: "PickUp",
        nodeId: "ns=1;s=Crane.PickUp",
        minimumSamplingInterval: 100,
        dataType: "Boolean",
        value: {
            get: () => new Variant({ dataType: DataType.Boolean, value: false }),
            set: (variant) => {
                if (variant.value) {
                    console.log(`Crane picking up`);
                }
                return StatusCodes.Good;
            }
        }
    });

    namespace.addVariable({
        componentOf: crane,
        browseName: "Drop",
        nodeId: "ns=1;s=Crane.Drop",
        minimumSamplingInterval: 100,
        dataType: "Boolean",
        value: {
            get: () => new Variant({ dataType: DataType.Boolean, value: false }),
            set: (variant) => {
                if (variant.value) {
                    console.log(`Crane dropping`);
                }
                return StatusCodes.Good;
            }
        }
    });

    const oven = namespace.addObject({
        browseName: "Oven",
        organizedBy: addressSpace.rootFolder.objects
    });

    namespace.addVariable({
        componentOf: oven,
        browseName: "Running",
        nodeId: "ns=1;s=Oven.Running",
        minimumSamplingInterval: 100,
        dataType: "Boolean",
        value: {
            get: () => new Variant({ dataType: DataType.Boolean, value: false }),
            set: (variant) => {
                console.log(`Oven running state set to ${variant.value}`);
                return StatusCodes.Good;
            }
        }
    });

    const conveyerBelt = namespace.addObject({
        browseName: "Conveyerbelt",
        organizedBy: addressSpace.rootFolder.objects
    });

    namespace.addVariable({
        componentOf: conveyerBelt,
        browseName: "Running",
        nodeId: "ns=1;s=Conveyerbelt.Running",
        minimumSamplingInterval: 100,
        dataType: "Boolean",
        value: {
            get: () => new Variant({ dataType: DataType.Boolean, value: false }),
            set: (variant) => {
                console.log(`Conveyerbelt running state set to ${variant.value}`);
                return StatusCodes.Good;
            }
        }
    });

    await server.start();
    console.log("Test OPC UA Server Running");
    console.log("Endpoint:", server.getEndpointUrl());
}

start();