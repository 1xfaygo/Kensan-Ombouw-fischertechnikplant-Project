const EventEmitter = require("eventemitter3");

function createOven(opcua) {
  // Maak een nieuw seinhuis aan voor deze oven
  const eventEmitter = new EventEmitter();

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
    // We gaan luisteren naar 'hasDropped' als signaal dat het proces klaar is.
    await opcua.subscribeBoolean(vars.hasDropped, (isDropped) => {
      if (isDropped) {
        // Stuur een signaal naar de controller dat we klaar zijn
        eventEmitter.emit("processCompleted");
      }
    });
  }

  async function startOven() {
    await opcua.writeVariable(vars.status, true);
    eventEmitter.emit("ovenStarted"); // Stuur een signaal dat de oven 'aan' is
  }

  async function loadAndProcess() {
    // Deze functie regelt nu nog zelf de timing
    await opcua.writeVariable(vars.door, true); // open
    await wait(200);
    await opcua.writeVariable(vars.hasItem, true); // item inside
    await wait(5000); // hold for processing (as example)
    // simulate processing steps: piston push, zaag etc.
    await opcua.writeVariable(vars.zaag, true);
    await wait(5000);
    await opcua.writeVariable(vars.zaag, false);
    await opcua.writeVariable(vars.hasDropped, true);
    // De 'init' functie zal het 'processCompleted' signaal sturen
  }

  function wait(ms){return new Promise(r=>setTimeout(r,ms));}

  // Geef de controller de functies die het mag gebruiken
  return { 
    init, 
    startOven, 
    loadAndProcess,
    on: eventEmitter.on.bind(eventEmitter) // BELANGRIJK: Hiermee kan de controller luisteren
  };
}

module.exports = createOven;
