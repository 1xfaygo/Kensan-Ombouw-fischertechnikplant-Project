// module: kraan
const EventEmitter = require("eventemitter3");

function createKraan(opcua) {
  const ev = new EventEmitter();
  const vars = {
    status: "V_Kraan_Status",
    armX: "V_K_Arm_X_as_Status",
    armY: "V_K_Arm_Y_as_Status",
    zuignap: "V_K_Zuignap_Status",
    hasPicked: "V_K_HasPicked_Status",
    hasDropped: "V_K_HasDropped_Status"
  };

  async function init() {
    // subscribe statuses so main controller can react
    await opcua.subscribeBoolean(vars.hasPicked, (v) => ev.emit("picked", v));
    await opcua.subscribeBoolean(vars.hasDropped, (v) => ev.emit("dropped", v));
  }

  async function moveToMagazijnAndPick() {
    await opcua.writeVariable(vars.armX, true);
    await opcua.writeVariable(vars.armY, true);
    await wait(400);
    await opcua.writeVariable(vars.zuignap, true);
    await opcua.writeVariable(vars.hasPicked, true);
    ev.emit("picked");
  }

  async function dropTo(target) {
    // target could be "oven" or "band" etc.
    await opcua.writeVariable(vars.armX, false);
    await opcua.writeVariable(vars.armY, false);
    await wait(300);
    await opcua.writeVariable(vars.zuignap, false);
    await opcua.writeVariable(vars.hasDropped, true);
    ev.emit("dropped", target);
  }

  function wait(ms){return new Promise(r=>setTimeout(r,ms));}

  return { init, moveToMagazijnAndPick, dropTo, on: ev.on.bind(ev) };
}

module.exports = createKraan;
