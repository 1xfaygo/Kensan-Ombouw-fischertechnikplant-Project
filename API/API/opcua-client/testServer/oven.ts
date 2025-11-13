import { Namespace, Variant, DataType, StatusCodes } from "node-opcua";

export function createOvenObject(namespace: Namespace) {
    let ovenRunning = false;
    let ovenTemperature = 180;
    let ovenStatus = "Idle";

    const oven = namespace.addObject({
        browseName: "Oven",
        organizedBy: namespace.addressSpace.rootFolder.objects
    });

    namespace.addVariable({
        componentOf: oven,
        browseName: "Running",
        nodeId: "ns=1;s=Oven.Running",
        minimumSamplingInterval: 100,
        dataType: "Boolean",
        value: {
            get: () => new Variant({ dataType: DataType.Boolean, value: ovenRunning }),
            set: (variant) => {
                ovenRunning = variant.value;
                console.log(`Oven running state set to ${variant.value}`);
                return StatusCodes.Good;
            }
        }
    });

    namespace.addVariable({
        componentOf: oven,
        browseName: "Temperature",
        nodeId: "ns=1;s=Oven.Temperature",
        minimumSamplingInterval: 100,
        dataType: "Double",
        value: {
            get: () => new Variant({ dataType: DataType.Double, value: ovenTemperature }),
            set: (variant) => {
                ovenTemperature = variant.value;
                console.log(`Oven temperature set to ${variant.value}`);
                return StatusCodes.Good;
            }
        }
    });

    namespace.addVariable({
        componentOf: oven,
        browseName: "Status",
        nodeId: "ns=1;s=Oven.Status",
        minimumSamplingInterval: 100,
        dataType: "String",
        value: {
            get: () => new Variant({ dataType: DataType.String, value: ovenStatus }),
            set: (variant) => {
                ovenStatus = variant.value;
                console.log(`Oven status set to ${variant.value}`);
                return StatusCodes.Good;
            }
        }
    });

    return oven;
}