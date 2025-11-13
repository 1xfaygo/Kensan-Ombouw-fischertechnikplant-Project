import { Namespace, Variant, DataType, StatusCodes } from "node-opcua";

export function createConveyerbeltObject(namespace: Namespace) {
    let conveyerRunning = false;
    let conveyerSpeed = 1.0;

    const conveyerbelt = namespace.addObject({
        browseName: "Conveyerbelt",
        organizedBy: namespace.addressSpace.rootFolder.objects
    });

    namespace.addVariable({
        componentOf: conveyerbelt,
        browseName: "Running",
        nodeId: "ns=1;s=Conveyerbelt.Running",
        minimumSamplingInterval: 100,
        dataType: "Boolean",
        value: {
            get: () => new Variant({ dataType: DataType.Boolean, value: conveyerRunning }),
            set: (variant) => {
                conveyerRunning = variant.value;
                console.log(`Conveyerbelt running state set to ${variant.value}`);
                return StatusCodes.Good;
            }
        }
    });

    namespace.addVariable({
        componentOf: conveyerbelt,
        browseName: "Speed",
        nodeId: "ns=1;s=ConveyerBelt.Speed",
        minimumSamplingInterval: 100,
        dataType: "Double",
        value: {
            get: () => new Variant({ dataType: DataType.Double, value: conveyerSpeed }),
            set: (variant) => {
                conveyerSpeed = variant.value;
                console.log(`Conveyerbelt speed set to ${variant.value}`);
                return StatusCodes.Good;
            }
        }
    });

    return conveyerbelt;
}