const OpcuaClient = require("./opcuaClient");
const config = require("./config");

// --- modules ---
const createOven = require("./modules/oven");


async function main() {
  const opcua = new OpcuaClient(config.opcua.endpoint);
  try {
    console.log("Connecting to OPC UA...");
    await opcua.connect();
    console.log("Connected.");

    // --- init modules ---
    // We maken alleen de oven aan
    const oven = createOven(opcua);

    // We initialiseren alleen de oven
    await oven.init();
    console.log("Oven geïnitialiseerd en luistert.");


    // --- Oven Logica ---
    // Alle logica voor magazijn en kraan is verwijderd.
    // We voegen een simpele test toe om de oven na 5 seconden te starten.
    
    console.log("Start het ovenproces over 5 seconden...");
    setTimeout(async () => {
      try {
        // Dit is de logica die voorheen door de kraan werd aangeroepen
        console.log("Commando: oven.startOven()");
        await oven.startOven(); // Zet de oven 'aan'
        
        // Wacht even (simulatie van wachttijd)
        await new Promise(r => setTimeout(r, 1000)); 

        console.log("Commando: oven.loadAndProcess()");
        await oven.loadAndProcess(); // Start de daadwerkelijke oven cyclus
        
        console.log("Oven cyclus is gestart.");

      } catch (e) {
        console.error("Fout tijdens het aansturen van de oven:", e);
      }
    }, 5000); // Wacht 5 seconden na het opstarten


    // --- Keep running ---
    console.log("Controller is nu 'live' en luistert alleen naar de oven.");
    console.log("Druk op Ctrl+C om te stoppen.");
    
    process.on("SIGINT", async () => {
      console.log("Shutting down...");
      await opcua.disconnect();
      process.exit(0);
    });

  } catch (err) {
    console.error("Error in main:", err);
    try { await opcua.disconnect(); } catch(e){} // Probeer altijd te disconnecten
    process.exit(1);
  }
}

main();
