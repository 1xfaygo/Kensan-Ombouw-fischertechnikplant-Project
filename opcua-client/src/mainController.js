// hoofdcontroller - start alles en orkestreert modules
const OpcuaClient = require("./opcuaClient");
const config = require("./config");

// modules
const createMagazijn = require("./modules/magazijn");
const createKraan = require("./modules/kraan");
const createOven = require("./modules/oven");
const createLoopband = require("./modules/loopband");

async function main() {
  const opcua = new OpcuaClient(config.opcua.endpoint);
  try {
    console.log("Connecting to OPC UA...");
    await opcua.connect();
    console.log("Connected.");

    // init modules
    const magazijn = createMagazijn(opcua);
    const kraan = createKraan(opcua);
    const oven = createOven(opcua);
    const loopband = createLoopband(opcua);

    await Promise.all([magazijn.init(), kraan.init(), oven.init(), loopband.init()]);

    // Example orchestration: wanneer magazijn meldt dat item op band is -> kraan pakt en brengt naar oven
    magazijn.on("sentToBand", async () => {
      console.log("Magazijn sent to band -> Kraan start picking");
      await kraan.moveToMagazijnAndPick();
      console.log("Kraan picked, drop to oven");
      await kraan.dropTo("oven");
      // trigger oven process
      await oven.startOven();
      await oven.loadAndProcess();
      console.log("Oven processed item.");
      // push to loopband
      await loopband.pushToNext();
    });

    // Also react to IR sensors: if IR sees item, call magazijn.pickAndSendToBand
    magazijn.on("ir1", async (val) => {
      if (val) {
        console.log("IR1 detected item -> magazijn.pickAndSendToBand");
        await magazijn.pickAndSendToBand();
      }
    });

    // keep running
    process.on("SIGINT", async () => {
      console.log("Shutting down...");
      await opcua.disconnect();
      process.exit(0);
    });

  } catch (err) {
    console.error("Error in main:", err);
    try { await opcua.disconnect(); } catch(e){}
    process.exit(1);
  }
}

main();
