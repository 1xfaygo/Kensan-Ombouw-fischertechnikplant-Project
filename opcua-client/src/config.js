module.exports = {
  opcua: {
    endpoint: "opc.tcp://127.0.0.1:4840", // pas aan naar PLC endpoint
    namespaceIndex: 1,
    nodePrefix: "ns=1;s=PLC.", // je kunt hier 'PLC.' of andere prefix instellen
    reconnectInterval: 5000
  },
  timeouts: {
    commandAck: 5000,
    defaultDelay: 1000
  }
};
