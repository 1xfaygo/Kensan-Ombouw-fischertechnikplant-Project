import { Namespace, Variant, DataType, StatusCodes } from "node-opcua";

export function createConveyerbeltObject(namespace: Namespace) {
    let conveyerRunning = false;

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
                console.log(`Conveyerbelt started`);

                if (conveyerRunning) {
                    setTimeout(() => {
                        conveyerRunning = false;
                        console.log(`Conveyerbelt finished`);
                    }, 5000);
                }
                return StatusCodes.Good;
            }
        }
    });

    return conveyerbelt;
}