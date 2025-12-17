// src/backend/nodeMap.ts
export const nodeMap: Record<string, string> = {
  ovenRunning: "ns=1;s=Oven.Running",
  ovenStatus: "ns=1;s=Oven.Status",
  craneRunning: "ns=1;s=Crane.Running",
  cranePosition: "ns=1;s=Crane.Position",
  craneMove: "ns=1;s=Crane.Move",
  warehouseRunning: "ns=1;s=Warehouse.Running",
  warehouseLocationX: "ns=1;s=Warehouse.Location_X",
  warehouseLocationY: "ns=1;s=Warehouse.Location_Y",
  warehousePickup: "ns=1;s=Warehouse.Pickup",
  warehouseStore: "ns=1;s=Warehouse.Store",
  warehouseStock: "ns=1;s=Warehouse.Stock",
  conveyerRunning: "ns=1;s=Conveyerbelt.Running",
};