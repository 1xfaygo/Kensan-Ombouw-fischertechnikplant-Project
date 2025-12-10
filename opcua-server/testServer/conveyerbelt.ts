import { Namespace, Variant, DataType, StatusCodes } from "node-opcua";

export function createConveyerbeltObject(namespace: Namespace) {
    const conveyerbelt = namespace.addObject({
        browseName: "Conveyerbelt",
        organizedBy: namespace.addressSpace.rootFolder.objects
    });

    // status variables

    let ready = true;
    let error = 0;
    let errorStr = "No Error";
    let conveyerState = 0;
    let color = 0;
    let queueLength = 0;
    let assignmentInQueue = 0;

    const conveyerbeltStatus = namespace.addObject({
        browseName: "Status",
        componentOf: conveyerbelt
    });

    namespace.addVariable({
        componentOf: conveyerbeltStatus,
        browseName: "Ready",
        nodeId: "ns=1;s=Conveyerbelt.Status.Ready",
        dataType: "Boolean",
        minimumSamplingInterval: 5000,
        value: {
            get: () => new Variant({ dataType: DataType.Boolean, value: ready })
        }
    });

    namespace.addVariable({
        componentOf: conveyerbeltStatus,
        browseName: "Error",
        nodeId: "ns=1;s=Conveyerbelt.Status.Error",
        dataType: "Int16",
        minimumSamplingInterval: 5000,
        value: {
            get: () => new Variant({ dataType: DataType.Int16, value: error })
        }
    });

    namespace.addVariable({
        componentOf: conveyerbeltStatus,
        browseName: "Error_str",
        nodeId: "ns=1;s=Conveyerbelt.Status.Error_str",
        dataType: "String",
        minimumSamplingInterval: 5000,
        value: {
            get: () => new Variant({ dataType: DataType.String, value: errorStr })
        }
    });

    namespace.addVariable({
        componentOf: conveyerbeltStatus,
        browseName: "State",
        nodeId: "ns=1;s=Conveyerbelt.Status.State",
        dataType: "Int16",
        minimumSamplingInterval: 5000,
        value: {
            get: () => new Variant({ dataType: DataType.Int16, value: conveyerState })
        }
    });

    namespace.addVariable({
        componentOf: conveyerbeltStatus,
        browseName: "Color",
        nodeId: "ns=1;s=Conveyerbelt.Status.Color",
        dataType: "Int16",
        minimumSamplingInterval: 5000,
        value: {
            get: () => new Variant({ dataType: DataType.Int16, value: color })
        }
    });

    namespace.addVariable({
        componentOf: conveyerbeltStatus,
        browseName: "Queue_length",
        nodeId: "ns=1;s=Conveyerbelt.Status.Queue_length",
        dataType: "Int16",
        minimumSamplingInterval: 5000,
        value: {
            get: () => new Variant({ dataType: DataType.Int16, value: queueLength })
        }
    });

    namespace.addVariable({
        componentOf: conveyerbeltStatus,
        browseName: "assignment_in_queue",
        nodeId: "ns=1;s=Conveyerbelt.Status.Assignment_in_queue",
        dataType: "Int16",
        minimumSamplingInterval: 5000,
        value: {
            get: () => new Variant({ dataType: DataType.Int16, value: assignmentInQueue })
        }
    });

    return conveyerbelt;
}