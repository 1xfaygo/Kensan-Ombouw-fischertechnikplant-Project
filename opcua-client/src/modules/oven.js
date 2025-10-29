function createOven(opcua) {
  const vars = {
    status: "V_Oven_Status",
    door: "V_O_Door_Status",
    hasItem: "V_O_HasItem_Status",
    piston: "V_O_Piston_Status",
    zaag: "V_O_Zaag_Status",
    hasPicked: "V_O_HasPicked_Status",
    hasDropped: "V_O_HasDropped_Status"
  };

  async function init() {
    // subscribe if needed
    // example: opcua.subscribeBoolean(vars.hasItem, v=> console.log("oven has item", v));
  }

  async function startOven() {
    await opcua.writeVariable(vars.status, true);
  }

  async function loadAndProcess() {
    await opcua.writeVariable(vars.door, true); // open
    await wait(200);
    await opcua.writeVariable(vars.hasItem, true); // item inside
    await wait(5000); // hold for processing (as example)
    // simulate processing steps: piston push, zaag etc.
    await opcua.writeVariable(vars.zaag, true);
    await wait(5000);
    await opcua.writeVariable(vars.zaag, false);
    await opcua.writeVariable(vars.hasDropped, true);
  }

  function wait(ms){return new Promise(r=>setTimeout(r,ms));}

  return { init, startOven, loadAndProcess };
}

module.exports = createOven;
