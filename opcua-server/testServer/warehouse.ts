import { Namespace, Variant, DataType, StatusCodes } from "node-opcua";

export function createWarehouseObject(namespace: Namespace) {
    const warehouse = namespace.addObject({
        browseName: "Warehouse",
        organizedBy: namespace.addressSpace.rootFolder.objects
    });

    // status variables

    let ready = true;
    let error = 0;
    let errorStr = "No Error";
    let warehouseState = 0;
    let destinationRow = 1;
    let destinationCol = 1;
    let action = 0;
    let assignmentDestinationRow = 1;
    let assignmentDestinationCol = 1;
    let assignmentAction = 0;
    let assignmentInQueue = false;

    const warehouseStatus = namespace.addObject({
        browseName: "Status",
        componentOf: warehouse
    });

    namespace.addVariable({
        componentOf: warehouseStatus,
        browseName: "Ready",
        nodeId: "ns=1;s=Warehouse.Status.Ready",
        dataType: "Boolean",
        value: {
            get: () => new Variant({ dataType: DataType.Boolean, value: ready })
        }
    });

    namespace.addVariable({
        componentOf: warehouseStatus,
        browseName: "Error",
        nodeId: "ns=1;s=Warehouse.Status.Error",
        dataType: "UInt16",
        value: {
            get: () => new Variant({ dataType: DataType.UInt16, value: error })
        }
    });

    namespace.addVariable({
        componentOf: warehouseStatus,
        browseName: "ErrorString",
        nodeId: "ns=1;s=Warehouse.Status.ErrorString",
        dataType: "String",
        value: {
            get: () => new Variant({ dataType: DataType.String, value: errorStr })
        }
    });

    // Status.State
    namespace.addVariable({
        componentOf: warehouseStatus,
        browseName: "State",
        nodeId: "ns=1;s=Warehouse.Status.State",
        dataType: "Int16",
        value: {
            get: () => new Variant({ dataType: DataType.Int16, value: warehouseState })
        }
    });


    const statusDestination = namespace.addObject({
        browseName: "Destination",
        componentOf: warehouseStatus
    });

    namespace.addVariable({
        componentOf: statusDestination,
        browseName: "row",
        nodeId: "ns=1;s=Warehouse.Status.Destination.row",
        dataType: "Int16",
        value: {
            get: () => new Variant({ dataType: DataType.Int16, value: destinationRow })
        }
    });

    namespace.addVariable({
        componentOf: statusDestination,
        browseName: "col",
        nodeId: "ns=1;s=Warehouse.Status.Destination.col",
        dataType: "Int16",
        value: {
            get: () => new Variant({ dataType: DataType.Int16, value: destinationCol })
        }
    });

    namespace.addVariable({
        componentOf: warehouseStatus,
        browseName: "Action",
        nodeId: "ns=1;s=Warehouse.Status.Action",
        dataType: "Int16",
        value: {
            get: () => new Variant({ dataType: DataType.Int16, value: action })
        }
    });


    const statusAssignmentDestination = namespace.addObject({
        browseName: "Assignment_destination",
        componentOf: warehouseStatus
    });

    namespace.addVariable({
        componentOf: statusAssignmentDestination,
        browseName: "row",
        nodeId: "ns=1;s=Warehouse.Status.Assignment_destination.row",
        dataType: "Int16",
        value: {
            get: () => new Variant({ dataType: DataType.Int16, value: assignmentDestinationRow })
        }
    });

    namespace.addVariable({
        componentOf: statusAssignmentDestination,
        browseName: "col",
        nodeId: "ns=1;s=Warehouse.Status.Assignment_destination.col",
        dataType: "Int16",
        value: {
            get: () => new Variant({ dataType: DataType.Int16, value: assignmentDestinationCol })
        }
    });

    namespace.addVariable({
        componentOf: warehouseStatus,
        browseName: "Assignment_action",
        nodeId: "ns=1;s=Warehouse.Status.Assignment_action",
        dataType: "Int16",
        value: {
            get: () => new Variant({ dataType: DataType.Int16, value: assignmentAction })
        }
    });

    namespace.addVariable({
        componentOf: warehouseStatus,
        browseName: "Assignment_in_queue",
        nodeId: "ns=1;s=Warehouse.Status.Assignment_in_queue",
        dataType: "Boolean",
        value: {
            get: () => new Variant({ dataType: DataType.Boolean, value: assignmentInQueue })
        }
    });

    return warehouse;
}