import { Namespace, Variant, DataType, StatusCodes } from "node-opcua";

export function createCraneObject(namespace: Namespace) {
    let craneRunning = false;
    let cranePos = 0;

    const crane = namespace.addObject({
        browseName: "Crane",
        organizedBy: namespace.addressSpace.rootFolder.objects
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
        browseName: "Position",
        nodeId: "ns=1;s=Crane.Position",
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

    let craneLoad = 0;
    namespace.addVariable({
        componentOf: crane,
        browseName: "Load",
        nodeId: "ns=1;s=Crane.Load",
        minimumSamplingInterval: 100,
        dataType: "Int16",
        value: {
            get: () => new Variant({ dataType: DataType.Int16, value: craneLoad }),
            set: (variant) => {
                craneLoad = variant.value;
                console.log(`Crane load set to ${variant.value}`);
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

    return crane;
}