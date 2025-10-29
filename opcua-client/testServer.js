// ============================================================================
// Simulated OPC UA PLC Server for Testing (no real PLC required)
// ============================================================================
// Dit script bootst een PLC na, zodat je jouw Node.js OPC UA client kunt testen
// zonder dat er een echte PLC verbonden is.
//
// Gebruik:
// 1️⃣ Start deze server in één terminal met:   node testServer.js
// 2️⃣ Start daarna je client (npm start) in een tweede terminal.
// ----------------------------------------------------------------------------

const {
  OPCUAServer,
  Variant,
  DataType,
  StatusCodes
} = require("node-opcua");

async function startServer() {
  console.log("🚀 Starting simulated OPC UA server...");

  // 1. Maak de server aan
  const server = new OPCUAServer({
    port: 4840,
    resourcePath: "/UA/PlantSim",
    buildInfo: {
      productName: "SimulatedPLC",
      buildNumber: "1",
      buildDate: new Date()
    }
  });

  // 2. Initialiseert de server (maakt addressSpace aan)
  await server.initialize();

  // 3. Namespace en root object
  const ns = server.engine.addressSpace.getOwnNamespace();
  const device = ns.addObject({
    organizedBy: server.engine.addressSpace.rootFolder.objects,
    browseName: "PLC"
  });

  // 4. Simuleer PLC-variabelen (uit jouw flowchart)
  const vars = [
    "V_Magazijn_Status",
    "V_MZ_IRCensor_1_Status",
    "V_MZ_IRCensor_2_Status",
    "V_MZ_HasPicked_Status",
    "V_MZ_HasDropped_Status",
    "V_Kraan_Status",
    "V_K_HasPicked_Status",
    "V_K_HasDropped_Status",
    "V_Oven_Status",
    "V_O_HasDropped_Status",
    "V_O_Zaag_Status",
    "V_LB_Piston1_Status",
    "V_LB_Piston2_Status",
    "V_LB_Piston3_Status",
    "V_O_LoopBandSensor_Status"
  ];

  // 5. Voeg nodes toe met lokale waardeopslag
  const map = {};

  for (const name of vars) {
    let currentValue = false;

    const variable = ns.addVariable({
      componentOf: device,
      browseName: name,
      nodeId: `ns=1;s=PLC.${name}`,
      dataType: "Boolean",
      minimumSamplingInterval: 100, // voorkomt warnings
      value: {
        get: () => new Variant({ dataType: DataType.Boolean, value: currentValue }),
        set: (variant) => {
          currentValue = variant.value;
          console.log(`[SERVER] ${name} =>`, variant.value);
          return StatusCodes.Good;
        }
      }
    });

    map[name] = variable;
  }

  // 6. Start de server
  await server.start();
  const endpointUrl = server.endpoints[0].endpointDescriptions()[0].endpointUrl;
  console.log(`✅ Simulated PLC running at: ${endpointUrl}`);
  console.log("Press CTRL+C to stop.\n");

  // 7. Graceful shutdown
  process.on("SIGINT", async () => {
    console.log("\n🛑 Shutting down simulated PLC...");
    await server.shutdown(1000);
    console.log("✅ Server stopped.");
    process.exit(0);
  });
}

// Start de server
startServer().catch((err) => {
  console.error("❌ Server startup error:", err);
});
