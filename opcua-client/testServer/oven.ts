import { Namespace, Variant, DataType, StatusCodes } from "node-opcua";

export function createOvenObject(namespace: Namespace) {
    let ovenRunning = false;

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
                console.log(`Oven running`);

                if (ovenRunning) {
                    setTimeout(() => {
                        ovenRunning = false;
                        console.log(`Oven finished`);
                    }, 5000);
                }
                return StatusCodes.Good;
            }
        }
    });

    return oven;
}