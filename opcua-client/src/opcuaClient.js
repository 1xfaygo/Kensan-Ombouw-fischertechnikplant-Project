const { OPCUAClient, AttributeIds, TimestampsToReturn, DataType, ClientSubscription, ClientMonitoredItem } = require("node-opcua");
const EventEmitter = require("eventemitter3");
const config = require("./config");

class OpcuaClient extends EventEmitter {
  constructor(endpoint) {
    super();
    this.endpoint = endpoint || config.opcua.endpoint;
    this.client = OPCUAClient.create({ endpointMustExist: false });
    this.session = null;
    this.subscription = null;
  }

  async connect() {
    await this.client.connect(this.endpoint);
    this.session = await this.client.createSession();
    // Create a subscription for monitored items if needed
    this.subscription = ClientSubscription.create(this.session, {
      requestedPublishingInterval: 1000,
      requestedLifetimeCount: 100,
      requestedMaxKeepAliveCount: 10,
      maxNotificationsPerPublish: 100,
      publishingEnabled: true,
      priority: 10
    });
    this.subscription.on("keepalive", () => this.emit("keepalive"));
    this.subscription.on("terminated", () => this.emit("terminated"));
    return this;
  }

  async disconnect() {
    if (this.subscription) {
      await this.subscription.terminate();
      this.subscription = null;
    }
    if (this.session) {
      await this.session.close();
      this.session = null;
    }
    await this.client.disconnect();
  }

  // Helper to build nodeId from your prefix + variable name
  nodeId(name) {
    return `${config.opcua.nodePrefix}${name}`;
  }

  async readVariable(varName) {
    const nodeToRead = { nodeId: this.nodeId(varName), attributeId: AttributeIds.Value };
    const dataValue = await this.session.read(nodeToRead);
    return dataValue.value ? dataValue.value.value : null;
  }

  async writeVariable(varName, value, dataType = DataType.Boolean) {
    const nodeId = this.nodeId(varName);
    const writeResult = await this.session.write({
      nodeId,
      attributeId: AttributeIds.Value,
      value: { value: { dataType, value } }
    });
    return writeResult;
  }

  // subscribe to a boolean node, call callback on changes
  async subscribeBoolean(varName, callback) {
    if (!this.subscription) {
      throw new Error("Subscription not created");
    }
    const item = ClientMonitoredItem.create(
      this.subscription,
      { nodeId: this.nodeId(varName), attributeId: AttributeIds.Value },
      { samplingInterval: 250, discardOldest: true, queueSize: 10 },
      TimestampsToReturn.Both
    );
    item.on("changed", (dataValue) => {
      const v = dataValue.value ? dataValue.value.value : null;
      callback(v);
    });
    return item;
  }
}

module.exports = OpcuaClient;
