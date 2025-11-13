import { Namespace, Variant, DataType, StatusCodes } from "node-opcua";

export function createWarehouseObject(namespace: Namespace) {
    let warehouseX = 1;
    let warehouseY = 1;
    let warehouseRunning = false;
    let warehouseStock = 25;

    const warehouse = namespace.addObject({
        browseName: "Warehouse",
        organizedBy: namespace.addressSpace.rootFolder.objects
    });

    namespace.addVariable({
        componentOf: warehouse,
        browseName: "Running",
        nodeId: "ns=1;s=Warehouse.Running",
        minimumSamplingInterval: 100,
        dataType: "Boolean",
        value: {
            get: () => new Variant({ dataType: DataType.Boolean, value: warehouseRunning }),
            set: (variant) => {
                warehouseRunning = variant.value;
                console.log(`Warehouse running state set to ${variant.value}`);

                if (warehouseRunning) {
                    setTimeout(() => {
                        warehouseRunning = false;
                        console.log(`Warehouse operation complete`);
                    }, 1500);
                }
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
            get: () => new Variant({ dataType: DataType.Int16, value: warehouseX }),
            set: (variant) => {
                warehouseX = variant.value;
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
            get: () => new Variant({ dataType: DataType.Int16, value: warehouseY }),
            set: (variant) => {
                warehouseY = variant.value;
                console.log(`Warehouse Location_Y set to ${variant.value}`);
                return StatusCodes.Good;
            }
        }
    });

    namespace.addVariable({
        componentOf: warehouse,
        browseName: "Pickup",
        nodeId: "ns=1;s=Warehouse.Pickup",
        minimumSamplingInterval: 100,
        dataType: "Boolean",
        value: {
            get: () => new Variant({ dataType: DataType.Boolean, value: false }),
            set: (variant) => {
                if (variant.value) {
                    console.log(`Warehouse picking up at (${warehouseX}, ${warehouseY})`);
                }
                return StatusCodes.Good;
            }
        }
    });

    namespace.addVariable({
        componentOf: warehouse,
        browseName: "Store",
        nodeId: "ns=1;s=Warehouse.Store",
        minimumSamplingInterval: 100,
        dataType: "Boolean",
        value: {
            get: () => new Variant({ dataType: DataType.Boolean, value: false }),
            set: (variant) => {
                if (variant.value) {
                    console.log(`Warehouse storing at (${warehouseX}, ${warehouseY})`);
                }
                return StatusCodes.Good;
            }
        }
    });

    namespace.addVariable({
        componentOf: warehouse,
        browseName: "Stock",
        nodeId: "ns=1;s=Warehouse.Stock",
        minimumSamplingInterval: 100,
        dataType: "Int16",
        value: {
            get: () => new Variant({ dataType: DataType.Int16, value: warehouseStock }),
            set: (variant) => {
                warehouseStock = variant.value;
                console.log(`Warehouse stock set to ${variant.value}`);
                return StatusCodes.Good;
            }
        }
    });

    return warehouse;
}