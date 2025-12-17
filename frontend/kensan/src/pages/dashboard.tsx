import React, { useState, useEffect } from 'react';

// ==============================================================================
// 1. DATA CONTRACT (INTERFACES)
// ==============================================================================
type MachineStatus = "IDLE" | "BEZIG" | "FOUT" | "VERWARMEN" | "ZAGEN" | "TRANSPORTEREN" | "DRAAIT" | "SORTEREN";

// Interfaces from user's input (complexere fabriek)
interface MagazijnData {
  status: MachineStatus;
  trailSensor: boolean; 
  motorConveyor: "STIL" | "VOORUIT" | "ACHTERUIT";
  motorHorizontal: "STIL" | "NAAR_STELLING" | "NAAR_BAND"; 
  motorVertical: "STIL" | "OMHOOG" | "OMLAAG";
  motorCantilever: "STIL" | "IN" | "UIT"; // Cruciaal voor pickup/release logica
}

interface KraanData {
  status: MachineStatus;
  posX: number;
  posY: number;
  motorVertical: "STIL" | "OMHOOG" | "OMLAAG";
  motorHorizontal: "STIL" | "VOORUIT" | "ACHTERUIT";
  motorRotate: "STIL" | "LINKS" | "RECHTS";
  compressor: boolean;
  vacuumValve: boolean; // Cruciaal voor 'draagt blokje'
}

interface OvenData {
  status: MachineStatus;
  temperatuur: number; 
  lichtSluis: boolean;
  motorBand: boolean;
  motorDraaitafel: "STIL" | "DRAAIT";
  motorZaag: boolean;
  motorFeeder: "STIL" | "IN" | "UIT";
  ovenDeur: "OPEN" | "DICHT";
  lichtOven: boolean;
  motorVacuumTransport: "STIL" | "NAAR_OVEN" | "NAAR_TAFEL";
  vacuumValve: boolean;
}

interface LoopbandData {
  status: MachineStatus;
  kleurSensor: "GEEN" | "WIT" | "ROOD" | "BLAUW"; 
  lichtSluisInlet: boolean;
  pulseCounter: number;
  motorBand: boolean;
  compressor: boolean;
  ejectorWit: boolean;
  ejectorRood: boolean;
  ejectorBlauw: boolean;
}

interface FabriekStatus {
  magazijn: MagazijnData;
  kraan: KraanData;
  oven: OvenData;
  loopband: LoopbandData;
}

// Kleurdefinities voor blokjes
const KLEUREN = { WIT: '#F0F0F0', ROOD: '#FF3838', BLAUW: '#29AAE2', GEEN: '#444' };
const KLEUR_NAMEN = ["WIT", "ROOD", "BLAUW"];
const getRandomStartColor = () => KLEUREN[KLEUR_NAMEN[Math.floor(Math.random() * KLEUR_NAMEN.length)] as keyof typeof KLEUREN] || KLEUREN.BLAUW;


// ==============================================================================
// 2. CONFIGURATIE & LOCATIES
// ==============================================================================

const nepData: FabriekStatus = {
  magazijn: { status: "IDLE", trailSensor: false, motorConveyor: "STIL", motorHorizontal: "STIL", motorVertical: "STIL", motorCantilever: "STIL" },
  kraan: { status: "IDLE", posX: 0, posY: 0, motorVertical: "STIL", motorHorizontal: "STIL", motorRotate: "STIL", compressor: false, vacuumValve: false },
  oven: { status: "IDLE", temperatuur: 20, lichtSluis: false, motorBand: false, motorDraaitafel: "STIL", motorZaag: false, motorFeeder: "STIL", ovenDeur: "DICHT", lichtOven: false, motorVacuumTransport: "STIL", vacuumValve: false },
  loopband: { status: "IDLE", kleurSensor: "GEEN", lichtSluisInlet: false, pulseCounter: 0, motorBand: false, compressor: false, ejectorWit: false, ejectorRood: false, ejectorBlauw: false }
};

// CSS-DEFINITIES VOOR DE VASTE MACHINE-BLOKKEN
const machineZones = {
  magazijn: { top: '350px', left: '50px', width: '200px', height: '220px', label: "MAGAZIJN & UITGIFT" },
  kraan:    { top: '400px', left: '415px', width: '150px', height: '150px', label: "KRAAN ZONE" }, 
  oven:     { top: '150px', left: '280px', width: '300px', height: '200px', label: "OVEN & ZAAG" },
  loopband: { top: '100px', right: '50px', width: '140px', height: '480px', label: "SORTEERLIJN" } 
};

// PIJLEN (AANGEPAST)
const ACTIVE_COLOR = '#00FF00';
const pijlen = [
  <line key="p1" x1="250" y1="500" x2="380" y2="500" stroke={ACTIVE_COLOR} strokeWidth="3" markerEnd="url(#arrowhead)" opacity="0.6" />, 
  <line key="p2" x1="450" y1="400" x2="450" y2="350" stroke={ACTIVE_COLOR} strokeWidth="3" markerEnd="url(#arrowhead)" opacity="0.6" />, 
  <line key="p3" x1="580" y1="250" x2="700" y2="250" stroke={ACTIVE_COLOR} strokeWidth="3" markerEnd="url(#arrowhead)" opacity="0.6" />, 
  <line key="p4" x1="720" y1="250" x2="720" y2="500" stroke={ACTIVE_COLOR} strokeWidth="3" markerEnd="url(#arrowhead)" opacity="0.6" />, 
  <line key="p5" x1="720" y1="500" x2="530" y2="500" stroke={ACTIVE_COLOR} strokeWidth="3" markerEnd="url(#arrowhead)" opacity="0.6" /> 
];

// POSITIES VOOR HET BLOKJE
const blokjePosities: { [key: string]: React.CSSProperties } = {
  // Magazijn (vaste locaties - gebruikt wanneer de kraan het niet vasthoudt)
  magazijn_stelling: { top: '390px', left: '170px' },   
  magazijn_gepakt:   { top: '390px', left: '110px' },  
  magazijn_op_band:  { top: '500px', left: '110px' },  
  magazijn_uitgifte: { top: '500px', left: '220px' },  
  
  // Kraan Pick-up & Draai
  kraan_haalt_op: 	  { top: '475px', left: '410px' }, 
  kraan_draait_met_blokje: { top: '450px', left: '450px' }, 
  
  // Oven Invoer & Proces
  bij_oven_invoer: 	  { top: '220px', left: '330px' },
  in_oven: 	          { top: '220px', left: '400px' },
  na_oven_zaag: 	  { top: '220px', left: '520px' },
  
  // Naar Loopband
  schuift_naar_band: { top: '240px', left: '600px'}, 

  // Loopband
  op_band: 	  { top: '240px', left: '720px' }, 
  loop_band: 	  { top: '350px', left: '720px' }, 
  check_band: 	  { top: '450px', left: '720px' }, 
  eind_band_sorteer: { top: '520px', left: '720px' },
  
  // Sorteer Uitvoer & Retour
  retour_kraan:     { top: '520px', left: '530px' },
};

// POSITIES VOOR DE MAGAZIJN KRAAN
const magazijnKraanPosities: { [key: string]: React.CSSProperties } = {
  thuis:        { top: '500px', left: '120px' },  
  bij_stelling: { top: '375px', left: '120px' },  
  uitgeschoven: { top: '375px', left: '170px' }, 
  bij_band:     { top: '490px', left: '170px' }, 
};

// ==============================================================================
// 3. SIMULATIE SCRIPT (CRUCIALE WIJZIGINGEN VOOR MAGAZIJNKRAAN PICKUP)
// ==============================================================================
interface SimulatieStap {
  blokjeLocatie: string;
  magazijnKraanLocatie: string;
  groteKraanRotatie: KraanData['motorRotate']; 
  blokjeKleur?: string; 
  log: string;
  data: FabriekStatus;
  duur?: number; 
}

const startKleur = getRandomStartColor();
const finalKleur = KLEUREN.ROOD; 

const simulatieStappen: SimulatieStap[] = [
  // 0. START
  { blokjeLocatie: "magazijn_stelling", magazijnKraanLocatie: "thuis", groteKraanRotatie: "STIL", log: `Cyclus gestart. Startkleur: ${Object.keys(KLEUREN).find(k => KLEUREN[k as keyof typeof KLEUREN] === startKleur)}`, data: nepData, duur: 2000 },
  
  // --- FASE 1: MAGAZIJN OPHALEN ---
  { blokjeLocatie: "magazijn_stelling", magazijnKraanLocatie: "bij_stelling", groteKraanRotatie: "STIL", log: "Magazijn: Lift beweegt naar stelling...", 
    data: { ...nepData, magazijn: { ...nepData.magazijn, status: "BEZIG", motorVertical: "OMHOOG" } } },
  
  // Arm haalt op (Cantilever UIT, holding block)
  { blokjeLocatie: "magazijn_gepakt", magazijnKraanLocatie: "uitgeschoven", groteKraanRotatie: "STIL", log: "Magazijn: Arm haalt blokje op. (Cantilever UIT)", 
    data: { ...nepData, magazijn: { ...nepData.magazijn, status: "BEZIG", motorHorizontal: "NAAR_STELLING", motorCantilever: "UIT", motorVertical: "OMHOOG" } }, duur: 1000 },
  
  // Brengt blokje naar uitvoerband (Cantilever IN, holding block, moving down)
  { blokjeLocatie: "magazijn_op_band", magazijnKraanLocatie: "bij_band", groteKraanRotatie: "STIL", log: "Magazijn: Brengt blokje naar uitvoerband. (Lift OMLAAG, Cantilever IN)", 
    data: { ...nepData, magazijn: { ...nepData.magazijn, status: "BEZIG", motorVertical: "OMLAAG", motorCantilever: "IN" } } },
  
  // VRIJGEVEN BLOKJE & Terug naar thuispositie (Cantilever STIL)
  { blokjeLocatie: "magazijn_uitgifte", magazijnKraanLocatie: "thuis", groteKraanRotatie: "LINKS", log: "Magazijn: Band voert blokje uit. Kraan draait.", 
    data: { ...nepData, magazijn: { ...nepData.magazijn, status: "IDLE", motorConveyor: "VOORUIT", trailSensor: true, motorCantilever: "STIL" }, kraan: { ...nepData.kraan, status: "BEZIG", motorRotate: "LINKS" } }, duur: 2000 },

  // --- FASE 2: KRAAN CYCLUS 1 (Magazijn -> Oven) ---
  { blokjeLocatie: "kraan_haalt_op", magazijnKraanLocatie: "thuis", groteKraanRotatie: "LINKS", log: "Kraan: Vacuüm AAN, pakt product.", data: { ...nepData, kraan: { ...nepData.kraan, status: "BEZIG", vacuumValve: true, compressor: true, motorRotate: "LINKS" }, magazijn: { ...nepData.magazijn, motorConveyor: "STIL" } }, duur: 1000 },
  { blokjeLocatie: "kraan_draait_met_blokje", magazijnKraanLocatie: "thuis", groteKraanRotatie: "RECHTS", log: "Kraan: Draait met blokje naar oven.", data: { ...nepData, kraan: { ...nepData.kraan, status: "BEZIG", vacuumValve: true, motorRotate: "RECHTS" } }, duur: 2000 },
  { blokjeLocatie: "bij_oven_invoer", magazijnKraanLocatie: "thuis", groteKraanRotatie: "RECHTS", log: "Kraan: Laat blokje los bij oven-invoer.", data: { ...nepData, kraan: { ...nepData.kraan, status: "IDLE", vacuumValve: false, compressor: false, motorRotate: "RECHTS" } }, duur: 1000 },

  // --- FASE 3: OVEN PROCES (Verwarmen & Zagen) ---
  { blokjeLocatie: "in_oven", magazijnKraanLocatie: "thuis", groteKraanRotatie: "STIL", log: "Oven: Blokje gaat oven in. Verwarmen start.", data: { ...nepData, oven: { ...nepData.oven, status: "VERWARMEN", temperatuur: 50, motorFeeder: "IN", ovenDeur: "DICHT", lichtOven: true } } },
  { blokjeLocatie: "in_oven", blokjeKleur: finalKleur, magazijnKraanLocatie: "thuis", groteKraanRotatie: "STIL", log: "Oven: TEMPERATUUR HOOG. Kleur verandert.", data: { ...nepData, oven: { ...nepData.oven, status: "VERWARMEN", temperatuur: 300, ovenDeur: "DICHT", lichtOven: true } }, duur: 4000 },
  { blokjeLocatie: "na_oven_zaag", magazijnKraanLocatie: "thuis", groteKraanRotatie: "STIL", log: "Oven: Product verplaatst naar zaag/afkoelen.", data: { ...nepData, oven: { ...nepData.oven, status: "ZAGEN", temperatuur: 100, motorFeeder: "UIT", motorZaag: true } }, duur: 3000 },
  
  // --- FASE 4: NAAR LOOPBAND ---
  { blokjeLocatie: "schuift_naar_band", magazijnKraanLocatie: "thuis", groteKraanRotatie: "STIL", log: "Oven: Klaar. Schuift naar band.", data: { ...nepData, oven: { ...nepData.oven, status: "TRANSPORTEREN", temperatuur: 40, motorZaag: false } } },
  { blokjeLocatie: "op_band", magazijnKraanLocatie: "thuis", groteKraanRotatie: "STIL", log: "Loopband: Transport start. Band AAN.", data: { ...nepData, loopband: { ...nepData.loopband, status: "DRAAIT", motorBand: true } }, duur: 1000 },
  { blokjeLocatie: "loop_band", magazijnKraanLocatie: "thuis", groteKraanRotatie: "STIL", log: "Loopband: Blokje passeert de lichtsluis.", data: { ...nepData, loopband: { ...nepData.loopband, status: "DRAAIT", motorBand: true, lichtSluisInlet: true, pulseCounter: 1 } }, duur: 1500 },
  { blokjeLocatie: "check_band", magazijnKraanLocatie: "thuis", groteKraanRotatie: "STIL", log: "Loopband: Kleur gescand (ROOD).", data: { ...nepData, loopband: { ...nepData.loopband, status: "SORTEREN", motorBand: true, kleurSensor: "ROOD" } }, duur: 1500 },
  
  // --- FASE 5: SORTEREN & KRAAN CYCLUS 2 (TERUGBRENGEN) ---
  { blokjeLocatie: "eind_band_sorteer", magazijnKraanLocatie: "thuis", groteKraanRotatie: "STIL", log: "Loopband: Sorteren. Ejector Rood AAN (simulatie).", data: { ...nepData, loopband: { ...nepData.loopband, status: "SORTEREN", motorBand: false, ejectorRood: true } }, duur: 1000 },
  { blokjeLocatie: "retour_kraan", magazijnKraanLocatie: "thuis", groteKraanRotatie: "LINKS", log: "Kraan: Draait en pakt gesorteerd product.", data: { ...nepData, kraan: { ...nepData.kraan, status: "BEZIG", motorRotate: "LINKS", vacuumValve: true, compressor: true } }, duur: 1000 },
  { blokjeLocatie: "kraan_draait_met_blokje", magazijnKraanLocatie: "thuis", groteKraanRotatie: "RECHTS", log: "Kraan: Draait terug naar magazijn.", data: { ...nepData, kraan: { ...nepData.kraan, status: "BEZIG", vacuumValve: true, motorRotate: "RECHTS" } }, duur: 2000 },
  { blokjeLocatie: "magazijn_uitgifte", magazijnKraanLocatie: "thuis", groteKraanRotatie: "RECHTS", log: "Kraan: Laat los op magazijn band.", data: { ...nepData, kraan: { ...nepData.kraan, status: "IDLE", motorRotate: "RECHTS", vacuumValve: false, compressor: false } }, duur: 1000 },

  // --- FASE 6: MAGAZIJN TERUGPLAATSEN (Smooth Return) ---
  // Kraan gaat naar bij_band positie, pakt het blokje (Cantilever IN)
  { blokjeLocatie: "magazijn_op_band", magazijnKraanLocatie: "bij_band", groteKraanRotatie: "STIL", log: "Magazijn: Neemt blokje aan. (Cantilever IN)", 
    data: { ...nepData, magazijn: { ...nepData.magazijn, status: "BEZIG", motorConveyor: "ACHTERUIT", motorCantilever: "IN" } } },
  // Kraan gaat naar bij_stelling positie (Cantilever IN, holding block)
  { blokjeLocatie: "magazijn_stelling", magazijnKraanLocatie: "bij_stelling", groteKraanRotatie: "STIL", log: "Magazijn: Brengt terug naar stelling.", 
    data: { ...nepData, magazijn: { ...nepData.magazijn, status: "BEZIG", motorVertical: "OMHOOG", motorCantilever: "IN" } }, duur: 1000 },
  // Magazijn Teruggeplaatst (Cantilever STIL om los te laten)
  { blokjeLocatie: "magazijn_stelling", magazijnKraanLocatie: "thuis", groteKraanRotatie: "STIL", log: "Magazijn: Teruggeplaatst. Cyclus voltooid.", 
    data: { ...nepData, magazijn: { ...nepData.magazijn, status: "IDLE", motorConveyor: "STIL", motorCantilever: "STIL" } }, duur: 3000 },
];


// ==============================================================================
// 4. COMPONENTEN (STIJL EN SYNCHRONISATIE)
// ==============================================================================

const isMachineActief = (status: MachineStatus) => ["BEZIG", "VERWARMEN", "ZAGEN", "TRANSPORTEREN", "DRAAIT", "SORTEREN"].includes(status);

const MachineBlock = ({ zone, status }: { zone: any, status: MachineStatus }) => {
  const actief = isMachineActief(status);
  const randKleur = actief ? '#56F000' : '#666'; 
  const tekstKleur = actief ? '#56F000' : '#aaa';

  return (
    <div className="absolute flex flex-col items-center justify-center font-bold text-xl transition-colors duration-500 rounded-xl shadow-2xl"
      style={{ 
        top: zone.top, 
        left: zone.left, 
        right: zone.right, 
        width: zone.width, 
        height: zone.height, 
        border: `3px solid ${randKleur}`, 
        backgroundColor: 'rgba(25, 25, 35, 0.9)', 
        color: tekstKleur, 
        zIndex: 2, 
        boxShadow: `0 0 15px ${actief ? 'rgba(86, 240, 0, 0.5)' : 'rgba(0, 0, 0, 0.5)'}` 
      }}>
      {zone.label}
      <div className="text-sm font-light mt-1 text-gray-400">{status}</div>
    </div>
  );
};

const Blokje = ({ style, kleur = KLEUREN.BLAUW }: { style: React.CSSProperties, kleur?: string }) => (
  <div className="absolute shadow-xl flex items-center justify-center"
    style={{ 
      width: '40px', 
      height: '40px', 
      transition: 'all 1s ease-in-out, background-color 0.5s', 
      zIndex: 20, 
      backgroundColor: kleur, 
      borderRadius: '6px', 
      border: '3px solid #fff', 
      boxShadow: `0 0 12px ${kleur}` , 
      transform: 'translate(-50%, -50%)',
      ...style 
    }}>
      <div className="text-xs font-semibold text-gray-900 leading-none">P</div>
  </div>
);

const MagazijnKraan = ({ style, cantileverStatus }: { style: React.CSSProperties, cantileverStatus: MagazijnData['motorCantilever'] }) => {
    // Offset om de arm te simuleren
    // We gebruiken 'IN' als de grijpstand (ingetrokken met blokje) en 'UIT' als de arm is uitgeschoven
    const armOffset = cantileverStatus === 'UIT' ? '40px' : '0px'; 
    const isCarrying = cantileverStatus !== 'STIL';

    return (
        <div className="absolute flex items-center justify-center transition-all duration-1000 ease-in-out"
            style={{ ...style, width: '60px', height: '60px', zIndex: 15, transform: 'translate(-50%, -50%)' }}>
            <svg viewBox="0 0 100 100" width="100%" height="100%" fill="none" stroke="#FFD325" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
              {/* Kraan Behuizing */}
              <rect x="20" y="10" width="60" height="80" rx="8" fill="rgba(50, 50, 50, 0.9)" strokeWidth="3" />
              {/* Lift rails */}
              <line x1="25" y1="15" x2="25" y2="85" stroke="#aaa" strokeWidth="1" />
              <line x1="75" y1="15" x2="75" y2="85" stroke="#aaa" strokeWidth="1" />
              
              {/* Cantilever Arm met animatie */}
              <g style={{ transform: `translateX(${armOffset})`, transition: 'transform 1s ease-in-out' }}>
                  <rect x="35" y="70" width="30" height="10" fill={isCarrying ? '#56F000' : '#444'} stroke="#FFD325" strokeWidth="2" />
                  {/* Visuele Grijppunt indicator */}
                  {isCarrying && <circle cx="50" cy="75" r="3" fill="#FFF" />} 
              </g>
              
            </svg>
        </div>
    );
};

// --- GROTE KRAAN MET INGEBOUWDE BLOKJE-LOGICA ---
const GroteKraan = ({ style, rotatie, isCarrying, blokjeKleur }: { style: React.CSSProperties, rotatie: KraanData['motorRotate'], isCarrying: boolean, blokjeKleur: string }) => {
  let draaiHoek = 0;
  if (rotatie === "LINKS") draaiHoek = -60;
  if (rotatie === "RECHTS") draaiHoek = 60;

  return (
    <div className="absolute flex items-center justify-center transition-transform duration-1000 ease-in-out"
      style={{ 
        ...style, 
        width: '300px', 
        height: '300px', 
        zIndex: 10, 
        transform: `translate(-50%, 0%) rotate(${draaiHoek}deg)`, 
        transformOrigin: '50% 100%' 
      }}>
      <svg viewBox="0 0 400 400" width="100%" height="100%" fill="none">
        
        {/* Voet en Mast */}
        <rect x="180" y="320" width="40" height="40" fill="#444" stroke="#666" strokeWidth="3" />
        <circle cx="200" cy="340" r="15" fill="#333" />
        
        {/* De Arm (Giek) - Geel */}
        <rect x="190" y="0" width="20" height="340" fill="#FFD325" stroke="#333" strokeWidth="2" rx="5" />
        
        {/* Loopkat / Grijper (Vaste positie op de arm) */}
        <g style={{ transform: 'translateY(40px)' }}> 
            {/* Loopkat zelf (Blauw blok) */}
            <rect x="165" y="50" width="70" height="30" fill="#29AAE2" stroke="#fff" strokeWidth="3" rx="4" />
            
            {/* HET BLOKJE DAT MEEGAAT MET DE KRAAN (CRUCIAAL) */}
            {isCarrying && (
                <Blokje 
                    style={{ 
                      top: '110px', 
                      left: '200px',
                      // Reset vertaling die Blokje al heeft en positioneer op de arm
                      transform: 'translate(-50%, -50%)', 
                      position: 'absolute' 
                    }} 
                    kleur={blokjeKleur} 
                />
            )}
        </g>
      </svg>
    </div>
  );
};

const FactoryView = ({ blokjePositionStyle, blokjeKleur, magazijnKraanStyle, groteKraanRotatie, data }: { blokjePositionStyle: React.CSSProperties, blokjeKleur: string, magazijnKraanStyle: React.CSSProperties, groteKraanRotatie: KraanData['motorRotate'], data: FabriekStatus }) => {
  
  const isGroteKraanCarrying = data.kraan.vacuumValve;
  // Bepaal of de MagazijnKraan het blokje vasthoudt (Cantilever niet STIL)
  const isMagazijnCarrying = data.magazijn.motorCantilever !== 'STIL';

  let blockToRender = null;

  if (isGroteKraanCarrying) {
      // Blokje zit in de Grote Kraan (reeds geïmplementeerd)
      blockToRender = null; 
  } else if (isMagazijnCarrying) {
      // Blokje volgt de MagazijnKraan (nieuwe logica)
      // We gebruiken de MagazijnKraan's positie als basis en voegen een kleine visuele offset toe
      const blockFollowsMagazijnKraanStyle: React.CSSProperties = {
          // De positie van de kraan + offset
          top: `calc(${magazijnKraanStyle.top} - 10px)`, 
          left: `calc(${magazijnKraanStyle.left} + 15px)`, 
          zIndex: 25 
      };
      blockToRender = <Blokje style={blockFollowsMagazijnKraanStyle} kleur={blokjeKleur} />;
  } else {
      // Standaard weergave op de band, stelling, oven, etc.
      blockToRender = <Blokje style={blokjePositionStyle} kleur={blokjeKleur} />;
  }


  return (
    <div className="card h-[600px] relative p-5 bg-gray-800 overflow-hidden border border-gray-700 shadow-2xl"> 
      <h2 className="text-2xl font-extrabold mb-4 text-white z-20 relative">Fabriek Overzicht (Top View)</h2>
      
      <svg className="absolute top-0 left-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
          <defs>
              <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="0" refY="3.5" orient="auto">
              <polygon points="0 0, 10 3.5, 0 7" fill={ACTIVE_COLOR} />
              </marker>
          </defs>
          {pijlen.map((pijl, i) => <g key={i}>{pijl}</g>)}
      </svg>

      <MachineBlock zone={machineZones.magazijn} status={data.magazijn.status} />
      <GroteKraan 
          style={{ top: machineZones.kraan.top, left: machineZones.kraan.left, width: '250px', height: '250px' }} 
          rotatie={groteKraanRotatie} 
          isCarrying={isGroteKraanCarrying} 
          blokjeKleur={blokjeKleur} 
      />
      <MachineBlock zone={machineZones.oven} status={data.oven.status} />
      <MachineBlock zone={machineZones.loopband} status={data.loopband.status} />

      <MagazijnKraan style={magazijnKraanStyle} cantileverStatus={data.magazijn.motorCantilever} />
      
      {/* Conditonele weergave van het blokje */}
      {blockToRender}

    </div>
  );
};

const StatusPanel = ({ data, logs }: { data: FabriekStatus, logs: string[] }) => (
  <div className="flex flex-col gap-3">
    <h2 className="text-xl font-bold text-white mb-2">Status Paneel</h2>
    
    {/* Dynamisch status kaartje component */}
    {Object.entries({
      Oven: data.oven, 
      Kraan: data.kraan, 
      Magazijn: data.magazijn, 
      Sorteerlijn: data.loopband 
    }).map(([title, item]) => {
      let details;
      let statusColor = isMachineActief(item.status as MachineStatus) ? "text-yellow-400" : "text-green-400";
      
      switch(title) {
        case 'Oven':
          details = (
            <div className="text-sm">
              Temp: <span className={item.temperatuur > 200 ? "text-red-400 font-bold" : "text-green-400"}>{item.temperatuur}°C</span> | 
              Zaag: {item.motorZaag ? 'AAN' : 'UIT'} | 
              Deur: {item.ovenDeur}
            </div>
          );
          if (item.status === 'FOUT') statusColor = 'text-red-500';
          break;
        case 'Kraan':
          details = (
            <div className="text-sm">
              Rotatie: {item.motorRotate} | 
              Vacuüm: {item.vacuumValve ? "AAN" : "UIT"}
            </div>
          );
          break;
        case 'Magazijn':
          details = (
            <div className="text-sm">
              Lift: {item.motorVertical} | 
              Arm: {item.motorCantilever}
            </div>
          );
          break;
        case 'Sorteerlijn':
          details = (
            <div className="text-sm">
              Kleur: <span style={{ color: KLEUREN[item.kleurSensor as keyof typeof KLEUREN] }}>{item.kleurSensor}</span> | 
              Band: {item.motorBand ? 'AAN' : 'UIT'}
            </div>
          );
          break;
        default:
          details = <div className="text-sm">Status: {item.status}</div>;
      }

      return (
        <div key={title} className="p-4 rounded-lg bg-gray-900 border border-gray-700 shadow-md">
          <h3 className="font-semibold text-white mb-1">{title}</h3>
          <div className={`text-xs font-mono mb-1 ${statusColor}`}>{item.status}</div>
          {details}
        </div>
      );
    })}

    <div className="p-4 rounded-lg bg-gray-900 border border-gray-700 mt-2 shadow-md">
      <h3 className="font-semibold text-white mb-2">Systeem Log</h3>
      <pre className="h-36 overflow-y-scroll p-2 rounded font-mono text-xs bg-gray-700 text-green-300 border border-gray-600">
        {logs.join('\n')}
      </pre>
    </div>
  </div>
);

// ==============================================================================
// 5. HOOFD COMPONENT
// ==============================================================================
export default function Dashboard() {
  const [huidigeData, setHuidigeData] = useState<FabriekStatus>(nepData);
  const [blokjePositie, setBlokjePositie] = useState<React.CSSProperties>(blokjePosities.magazijn_stelling);
  const [magazijnKraanPositie, setMagazijnKraanPositie] = useState<React.CSSProperties>(magazijnKraanPosities.thuis);
  const [groteKraanRotatie, setGroteKraanRotatie] = useState<KraanData['motorRotate']>("STIL");
  const [blokjeKleur, setBlokjeKleur] = useState<string>(startKleur); 

  const [logs, setLogs] = useState<string[]>(["Dashboard geladen..."]);
  
  useEffect(() => {
    let stapIndex = 0;
    
    const voerStapUit = () => {
        if (stapIndex >= simulatieStappen.length) {
            stapIndex = 0; 
        }
        
        const stap = simulatieStappen[stapIndex];

        setHuidigeData(stap.data);
        
        // Update BLOKJE POSITIE: alleen als GEEN van de kranen het draagt (d.w.z. Cantilever STIL EN geen VacuumValve)
        const isCarriedByMagazijn = stap.data.magazijn.motorCantilever !== 'STIL';
        const isCarriedByGroteKraan = stap.data.kraan.vacuumValve;
        
        if (!isCarriedByMagazijn && !isCarriedByGroteKraan) {
            setBlokjePositie(blokjePosities[stap.blokjeLocatie]);
        }
        
        setMagazijnKraanPositie(magazijnKraanPosities[stap.magazijnKraanLocatie] || magazijnKraanPosities.thuis);
        setGroteKraanRotatie(stap.groteKraanRotatie || "STIL");
        
        setBlokjeKleur(stap.blokjeKleur || blokjeKleur);
        
        setLogs(prev => [stap.log, ...prev].slice(0, 15)); 

        const wachttijd = stap.duur || 1500; 
        stapIndex = (stapIndex + 1);
        
        setTimeout(voerStapUit, wachttijd);
    };

    setTimeout(voerStapUit, 1000);
  }, []); 

  return (
    <div className="p-5 max-w-7xl mx-auto min-h-screen bg-gray-900 font-sans">
      <h1 className="text-4xl font-extrabold mb-8 text-white border-b border-gray-700 pb-3">Professionele Fabriekssimulatie</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Kolom 1: De Fabriek View */}
        <div className="lg:col-span-2">
          <FactoryView 
            blokjePositionStyle={blokjePositie} 
            blokjeKleur={blokjeKleur}
            magazijnKraanStyle={magazijnKraanPositie} 
            groteKraanRotatie={groteKraanRotatie}
            data={huidigeData} 
          />
        </div>
        {/* Kolom 2: Status en Log */}
        <div className="lg:col-span-1">
          <StatusPanel data={huidigeData} logs={logs} />
        </div>
      </div>
    </div>
  );
}