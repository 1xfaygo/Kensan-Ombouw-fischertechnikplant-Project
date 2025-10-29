function createLoopband(opcua) {
  const vars = {
    piston1: "V_LB_Piston1_Status",
    piston2: "V_LB_Piston2_Status",
    piston3: "V_LB_Piston3_Status",
    loopSensor: "V_O_LoopBandSensor_Status"
  };

  async function init() {
    // subscribe to loop sensor to detect arrival
    // await opcua.subscribeBoolean(vars.loopSensor, v => console.log("loop sensor", v));
  }

  async function pushToNext() {
    await opcua.writeVariable(vars.piston1, true);
    await wait(300);
    await opcua.writeVariable(vars.piston1, false);
  }

  function wait(ms){return new Promise(r=>setTimeout(r,ms));}

  return { init, pushToNext };
}

module.exports = createLoopband;
