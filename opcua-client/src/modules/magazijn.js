// module: magazijn
// verantwoordelijk voor detectie / pack / verplaatsing naar band
const EventEmitter = require("eventemitter3");

function createMagazijn(opcua) {
  const ev = new EventEmitter();
  const vars = {
    status: "V_Magazijn_Status",
    grijpArm: "V_MZ_GrijpArm_Status",
    inventory: "V_MZ_Inventory_Status",
    ir1: "V_MZ_IRCensor_1_Status",
    ir2: "V_MZ_IRCensor_2_Status",
    hasPicked: "V_MZ_HasPicked_Status",
    hasDropped: "V_MZ_HasDropped_Status"
  };

  async function init() {
    // subscribe IR sensors to detect blokje
    await opcua.subscribeBoolean(vars.ir1, (val) => {
      ev.emit("ir1", val);
    });
    await opcua.subscribeBoolean(vars.ir2, (val) => {
      ev.emit("ir2", val);
    });
  }

  async function pickAndSendToBand() {
    // command sequence - zetten writes als booleans (voorbeeld)
    await opcua.writeVariable(vars.grijpArm, true);
    // wacht ack / status of polling
    await wait(500);
    await opcua.writeVariable(vars.hasPicked, true);
    // verplaats naar band - voorbeeld; in echte PLC gebruik specifieke actuators
    await wait(300);
    await opcua.writeVariable(vars.hasDropped, true);
    ev.emit("sentToBand");
  }

  function wait(ms) { return new Promise(r => setTimeout(r, ms)); }

  return { init, pickAndSendToBand, on: ev.on.bind(ev) };
}

module.exports = createMagazijn;
