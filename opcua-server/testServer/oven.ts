import { Namespace, Variant, DataType, StatusCodes } from "node-opcua";

export function createOvenObject(namespace: Namespace) {
    const oven = namespace.addObject({
        browseName: "Oven",
        organizedBy: namespace.addressSpace.rootFolder.objects
    });

    // status variables

    let ready = true;
    let error = 0;
    let errorStr = "No Error";
    let ovenState = 0;
    let queueLength = 0;
    let assignmentInQueue = 0;

    const ovenStatus = namespace.addObject({
        browseName: "Status",
        componentOf: oven
    });

    namespace.addVariable({
        componentOf: ovenStatus,
        browseName: "Ready",
        nodeId: "ns=1;s=Oven.Status.Ready",
        dataType: "Boolean",
        value: {
            get: () => new Variant({ dataType: DataType.Boolean, value: ready })
        }
    });

    namespace.addVariable({
        componentOf: ovenStatus,
        browseName: "Error",
        nodeId: "ns=1;s=Oven.Status.Error",
        dataType: "Int16",
        value: {
            get: () => new Variant({ dataType: DataType.Int16, value: error })
        }
    });

    namespace.addVariable({
        componentOf: ovenStatus,
        browseName: "Error_str",
        nodeId: "ns=1;s=Oven.Status.Error_str",
        dataType: "String",
        value: {
            get: () => new Variant({ dataType: DataType.String, value: errorStr })
        }
    });

    namespace.addVariable({
        componentOf: ovenStatus,
        browseName: "State",
        nodeId: "ns=1;s=Oven.Status.State",
        dataType: "Int16",
        value: {
            get: () => new Variant({ dataType: DataType.Int16, value: ovenState })
        }
    });

    namespace.addVariable({
        componentOf: ovenStatus,
        browseName: "Queue_length",
        nodeId: "ns=1;s=Oven.Status.Queue_length",
        dataType: "Int16",
        value: {
            get: () => new Variant({ dataType: DataType.Int16, value: queueLength })
        }
    });

    namespace.addVariable({
        componentOf: ovenStatus,
        browseName: "assignment_in_queue",
        nodeId: "ns=1;s=Oven.Status.Assignment_in_queue",
        dataType: "Int16",
        value: {
            get: () => new Variant({ dataType: DataType.Int16, value: assignmentInQueue })
        }
    });

    return oven;
}