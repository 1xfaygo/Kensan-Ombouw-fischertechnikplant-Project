import React, { useState, useEffect } from 'react';

// ==============================================================================
// 1. DATA CONTRACT (INTERFACES)
// ==============================================================================
interface MagazijnData {
  status: "IDLE" | "BEZIG" | "FOUT";
  trailSensor: boolean; 
  motorConveyor: "STIL" | "VOORUIT" | "ACHTERUIT";
  motorHorizontal: "STIL" | "NAAR_STELLING" | "NAAR_BAND"; 
  motorVertical: "STIL" | "OMHOOG" | "OMLAAG";
  motorCantilever: "STIL" | "IN" | "UIT";
}

interface KraanData {
  status: "IDLE" | "BEZIG" | "FOUT";
  posX: number;
  posY: number;
  motorVertical: "STIL" | "OMHOOG" | "OMLAAG";
  motorHorizontal: "STIL" | "VOORUIT" | "ACHTERUIT";
  motorRotate: "STIL" | "LINKS" | "RECHTS";
  compressor: boolean;
  vacuumValve: boolean;
}

interface OvenData {
  status: "IDLE" | "VERWARMEN" | "ZAGEN" | "TRANSPORTEREN" | "FOUT";
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
  status: "IDLE" | "DRAAIT" | "SORTEREN";
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
  magazijn: { top: '350px', left: '50px', width: '200px', height: '220px', label: "MAGAZIJN" },
  kraan:    { top: '450px', left: '300px', width: '150px', height: '150px', label: "KRAAN" }, 
  oven:     { top: '150px', left: '280px', width: '300px', height: '200px', label: "OVEN" },
  loopband: { top: '100px', right: '50px', width: '140px', height: '480px', label: "LOOPBAND" } 
};

// PIJLEN
const pijlen = [
  <line key="p1" x1="250" y1="500" x2="300" y2="500" stroke="#666" strokeWidth="2" markerEnd="url(#arrowhead)" />,
  <line key="p2" x1="420" y1="450" x2="420" y2="350" stroke="#666" strokeWidth="2" markerEnd="url(#arrowhead)" />,
  <line key="p3" x1="580" y1="250" x2="650" y2="250" stroke="#666" strokeWidth="2" markerEnd="url(#arrowhead)" />,
  <line key="p4" x1="650" y1="520" x2="450" y2="520" stroke="#666" strokeWidth="2" markerEnd="url(#arrowhead)" />
];

// POSITIES VOOR HET BLOKJE
const blokjePosities: { [key: string]: React.CSSProperties } = {
  magazijn_stelling: { top: '370px', left: '175px' },   
  magazijn_gepakt:   { top: '370px', left: '130px' },  
  magazijn_op_band:  { top: '480px', left: '130px' },  
  magazijn_uitgifte: { top: '480px', left: '200px' },  
  
  kraan_haalt_op: { top: '480px', left: '350px' }, 
  kraan_pakt: { top: '480px', left: '350px' },
  kraan_draait_met_blokje: { top: '350px', left: '350px' }, 
  kraan_zet_het_blokeje: {top: '250px', left: '325px'},
  
  bij_oven:   { top: '250px', left: '350px' },
  in_oven:    { top: '250px', left: '400px' },
  einde_oven: { top: '250px', left: '450px' },
  begin_zaag: { top: '250px', left: '500px' },
  einde_zaag: { top: '250px', left: '550px' },
  schuift_naar_band: {top: '250px', left: '600px'},

  op_band:    { top: '250px', left: '700px' },
  lopend_band: { top: '300px', left: '700px'},
  check_band: { top: '400px', left: '700px'},
  eind_band:  { top: '500px', left: '700px' }
};

// POSITIES VOOR DE MAGAZIJN KRAAN
const magazijnKraanPosities: { [key: string]: React.CSSProperties } = {
  thuis:        { top: '500px', left: '120px' },  
  bij_stelling: { top: '365px', left: '120px' },  
  uitgeschoven: { top: '365px', left: '125px' }, 
  bij_band:     { top: '475px', left: '125px' }, 
};

// ==============================================================================
// 3. SIMULATIE SCRIPT
// ==============================================================================
interface SimulatieStap {
  blokjeLocatie: string;
  magazijnKraanLocatie: string;
  groteKraanRotatie: "LINKS" | "RECHTS" | "STIL"; 
  blokjeKleur?: string; 
  log: string;
  data: FabriekStatus;
  duur?: number; 
}

const simulatieStappen: SimulatieStap[] = [
  { 
    blokjeLocatie: "magazijn_stelling",
    magazijnKraanLocatie: "thuis",
    groteKraanRotatie: "STIL",
    log: "Magazijn: Start. Wachten op order.", 
    data: nepData,
    duur: 2000
  },
  { 
    blokjeLocatie: "magazijn_stelling",
    magazijnKraanLocatie: "bij_stelling",
    groteKraanRotatie: "STIL",
    log: "Magazijn: Lift beweegt naar stelling...", 
    data: { ...nepData, magazijn: { ...nepData.magazijn, status: "BEZIG", motorVertical: "OMHOOG" } } 
  },
  { 
    blokjeLocatie: "magazijn_gepakt", 
    magazijnKraanLocatie: "uitgeschoven",
    groteKraanRotatie: "STIL",
    log: "Magazijn: Arm haalt blokje op.", 
    data: { ...nepData, magazijn: { ...nepData.magazijn, status: "BEZIG", motorHorizontal: "NAAR_STELLING", motorCantilever: "UIT" } } ,
    duur: 2000
  },
  { 
    blokjeLocatie: "magazijn_op_band", 
    magazijnKraanLocatie: "bij_band",
    groteKraanRotatie: "STIL",
    log: "Magazijn: Brengt blokje naar uitvoerband.", 
    data: { ...nepData, magazijn: { ...nepData.magazijn, status: "BEZIG", motorVertical: "OMLAAG" } } 
  },
  { 
    blokjeLocatie: "magazijn_uitgifte", 
    magazijnKraanLocatie: "thuis",
    groteKraanRotatie: "LINKS", 
    log: "Magazijn: Band voert blokje uit. Kraan draait...", 
    data: { ...nepData, magazijn: { ...nepData.magazijn, status: "BEZIG", motorConveyor: "VOORUIT", trailSensor: true }, kraan: { ...nepData.kraan, status: "BEZIG", motorRotate: "LINKS" } } 
  },

  { 
    blokjeLocatie: "kraan_haalt_op", 
    magazijnKraanLocatie: "thuis",
    groteKraanRotatie: "LINKS", 
    log: "Kraan: Vacuüm aan, pakt product.", 
    data: { ...nepData, magazijn: { ...nepData.magazijn, status: "IDLE" }, kraan: { ...nepData.kraan, status: "BEZIG", vacuumValve: true, compressor: true } },
    duur: 3000
  },
  { 
    blokjeLocatie: "kraan_draait_met_blokje",
    magazijnKraanLocatie: "thuis",
    groteKraanRotatie: "STIL",
    log: "Kraan: Draait met blokje...", 
    data: { ...nepData, kraan: { ...nepData.kraan, status: "BEZIG", vacuumValve: true, motorRotate: "RECHTS" } } 
  },
  { 
    blokjeLocatie: "bij_oven", 
    magazijnKraanLocatie: "thuis",
    groteKraanRotatie: "STIL", 
    log: "Kraan: Legt blokje bij oven neer.", 
    data: { ...nepData, kraan: { ...nepData.kraan, status: "BEZIG", vacuumValve: true, motorRotate: "RECHTS" } } 
  },
  { 
    blokjeLocatie: "bij_oven", 
    magazijnKraanLocatie: "thuis",
    groteKraanRotatie: "STIL", 
    log: "OVEN: blokje is nu bij de oven staat klaar om in de oven te gaan ", 
    data: { ...nepData, kraan: { ...nepData.kraan, status: "BEZIG", vacuumValve: true, motorRotate: "RECHTS" } }  
  },
  {
    blokjeLocatie: "in_oven",
    magazijnKraanLocatie: "thuis",
    groteKraanRotatie: "STIL",
    log: "OVEN: blokje gaat nu de oven in",
    data: { ...nepData, kraan: { ...nepData.kraan, status: "IDLE", vacuumValve: false }, oven: { ...nepData.oven, status: "VERWARMEN", motorFeeder: "IN", temperatuur: 50, lichtOven: true } } 
  },
  {
    blokjeLocatie: "in_oven",
    blokjeKleur: "#red",
    magazijnKraanLocatie: "thuis",
    groteKraanRotatie: "STIL",
    log: "OVEN: blokje is nu aan het verwarmen",
    data: {...nepData,oven: {...nepData.oven, status: "VERWARMEN", motorFeeder: "IN", temperatuur: 300, lichtOven: true}},
    duur: 5000
  },
  {
    blokjeLocatie: "einde_oven",
    magazijnKraanLocatie: "thuis",
    groteKraanRotatie: "STIL",
    log: "OVEN: blokje is klaar met verwarmen",
    data: {...nepData,oven: {...nepData.oven, status: "VERWARMEN", motorFeeder: "IN", temperatuur: 50, lichtOven: true}},
  },
  {
    blokjeLocatie: "begin_zaag",
    magazijnKraanLocatie: "thuis",
    groteKraanRotatie: "STIL",
    log:"OVEN: blokje wordt nu gezaagd en wordt afgekoeld",
    data: { ...nepData, oven: { ...nepData.oven, status: "TRANSPORTEREN", temperatuur: 150, motorDraaitafel: "DRAAIT" } },
    duur: 5000
  },
  {
    blokjeLocatie: "einde_zaag",
    magazijnKraanLocatie: "thuis",
    groteKraanRotatie: "STIL",
    log:"OVEN: blokje is gezaagd",
    data: { ...nepData, oven: { ...nepData.oven, status: "ZAGEN", temperatuur: 0, motorDraaitafel: "DRAAIT" } }
  },
  {
    blokjeLocatie: "schuift_naar_band",
    magazijnKraanLocatie: "thuis",
    groteKraanRotatie: "STIL",
    log:"LOOPBAND: blokje is op de loopband gezet",
    data: { ...nepData, oven: { ...nepData.oven, status: "TRANSPORTEREN", temperatuur: 0, motorDraaitafel: "DRAAIT" } }
  },
  {
    blokjeLocatie: "op_band",
    magazijnKraanLocatie: "thuis",
    groteKraanRotatie: "STIL",
    log:"LOOPBAND: blokje is op de loopband gezet",
    data: { ...nepData, loopband: { ...nepData.loopband, status: "DRAAIT", motorBand: true, pulseCounter: 50 } } 
  },
  {
    blokjeLocatie: "loop_band",
    magazijnKraanLocatie: "thuis",
    groteKraanRotatie: "STIL",
    log:"LOOPBAND: blokje gaat rolt voor de scanner",
    data: { ...nepData, loopband: { ...nepData.loopband, status: "DRAAIT", motorBand: true, pulseCounter: 50 } } 
  },
  {
    blokjeLocatie: "check_band",
    magazijnKraanLocatie: "thuis",
    groteKraanRotatie: "STIL",
    log:"LOOPBAND: blokje is langs de scanner en gaat door naar de soorteerplek",
    data: { ...nepData, loopband: { ...nepData.loopband, status: "DRAAIT", motorBand: true, pulseCounter: 50 } } 
  },



];

// ==============================================================================
// 4. COMPONENTEN (PUUR CSS, GEEN AFBEELDINGEN)
// ==============================================================================

const isMachineActief = (status: string) => {
  const actieveStatussen = ["BEZIG", "VERWARMEN", "ZAGEN", "TRANSPORTEREN", "DRAAIT", "SORTEREN"];
  return actieveStatussen.includes(status);
};

const MachineBlock = ({ zone, status }: { zone: any, status: string }) => {
  const actief = isMachineActief(status);
  const bgKleur = actief ? 'rgba(86, 240, 0, 0.2)' : 'rgba(255, 255, 255, 0.05)'; 
  const randKleur = actief ? '#56F000' : '#666'; 
  const tekstKleur = actief ? '#56F000' : '#aaa';

  return (
    <div className="absolute flex items-center justify-center font-bold text-xl transition-colors duration-500"
      style={{ top: zone.top, left: zone.left, right: zone.right, width: zone.width, height: zone.height, border: `2px dashed ${randKleur}`, backgroundColor: bgKleur, color: tekstKleur, borderRadius: '8px', zIndex: 2 }}>
      {zone.label}
    </div>
  );
};

const Blokje = ({ style, kleur = "#29AAE2" }: { style: React.CSSProperties, kleur?: string }) => (
  <div className="absolute shadow-lg flex items-center justify-center"
    style={{ width: '40px', height: '40px', transition: 'all 1s ease-in-out, background-color 0.5s', zIndex: 20, backgroundColor: kleur, border: '2px solid #fff', borderRadius: '4px', ...style }}>
    <div style={{ width: '20px', height: '20px', border: '1px solid rgba(255,255,255,0.5)', borderRadius: '2px' }}></div>
  </div>
);

const MagazijnKraan = ({ style }: { style: React.CSSProperties }) => (
  <div className="absolute flex items-center justify-center transition-all duration-1000 ease-in-out"
    style={{ ...style, width: '50px', height: '50px', zIndex: 15 }}>
    <svg viewBox="0 0 100 100" width="100%" height="100%" fill="none" stroke="#FFD325" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
      <rect x="20" y="10" width="60" height="80" rx="5" />
      <line x1="20" y1="10" x2="80" y2="90" opacity="0.5" strokeWidth="2" />
      <line x1="80" y1="10" x2="20" y2="90" opacity="0.5" strokeWidth="2" />
      <path d="M 10 30 H 20" /> <path d="M 80 30 H 90" />
      <path d="M 10 70 H 20" /> <path d="M 80 70 H 90" />
      <path d="M 35 90 V 95 H 65 V 90" fill="none" />
    </svg>
  </div>
);

// [AANGEPAST] DE GROTE DRAAIENDE TORENKRAAN
const GroteKraan = ({ style, rotatie }: { style: React.CSSProperties, rotatie: "LINKS" | "RECHTS" | "STIL" }) => {
  let draaiHoek = 0;
  if (rotatie === "LINKS") draaiHoek = -45;
  if (rotatie === "RECHTS") draaiHoek = 45;

  return (
    <div className="absolute flex items-center justify-center transition-transform duration-1000 ease-in-out"
      style={{ ...style, width: '250px', height: '250px', zIndex: 10, transform: `rotate(${draaiHoek}deg)`, transformOrigin: 'bottom center' }}>
      <svg viewBox="0 0 300 300" width="100%" height="100%" fill="none">
        <rect x="130" y="130" width="40" height="40" fill="#555" stroke="#333" strokeWidth="2" />
        <circle cx="150" cy="150" r="12" fill="#333" />
        <rect x="140" y="10" width="20" height="260" fill="#FFD325" stroke="#333" strokeWidth="2" rx="2" />
        <line x1="140" y1="50" x2="160" y2="50" stroke="#333" strokeWidth="1" opacity="0.5" />
        <line x1="140" y1="100" x2="160" y2="100" stroke="#333" strokeWidth="1" opacity="0.5" />
        <line x1="140" y1="150" x2="160" y2="150" stroke="#333" strokeWidth="1" opacity="0.5" />
        <line x1="140" y1="200" x2="160" y2="200" stroke="#333" strokeWidth="1" opacity="0.5" />
        <rect x="140" y="270" width="20" height="20" fill="#888" stroke="#333" strokeWidth="2" />
        <g style={{ transform: 'translateY(40px)' }}> 
            <rect x="125" y="30" width="50" height="30" fill="#29AAE2" stroke="#fff" strokeWidth="2" rx="4" />
            <circle cx="150" cy="45" r="6" fill="#fff" />
            <line x1="150" y1="45" x2="150" y2="45" stroke="#fff" strokeWidth="2" strokeDasharray="2 2" />
        </g>
      </svg>
    </div>
  );
};

const FactoryView = ({ blokjePositionStyle, blokjeKleur, magazijnKraanStyle, groteKraanRotatie, data }: { blokjePositionStyle: React.CSSProperties, blokjeKleur: string, magazijnKraanStyle: React.CSSProperties, groteKraanRotatie: "LINKS"|"RECHTS"|"STIL", data: FabriekStatus }) => (
  <div className="card h-[600px] relative p-5 bg-neutral-900 overflow-hidden border border-gray-700"> 
    <h2 className="text-xl font-bold mb-4 text-kensan-white z-20 relative">Top View</h2>
    
    <svg className="absolute top-0 left-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
        <defs>
            <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="0" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="#666" />
            </marker>
        </defs>
        {pijlen.map((pijl, i) => <g key={i}>{pijl}</g>)}
    </svg>

    <MachineBlock zone={machineZones.magazijn} status={data.magazijn.status} />
    <GroteKraan style={machineZones.kraan} rotatie={groteKraanRotatie} />
    <MachineBlock zone={machineZones.oven} status={data.oven.status} />
    <MachineBlock zone={machineZones.loopband} status={data.loopband.status} />

    <MagazijnKraan style={magazijnKraanStyle} />
    <Blokje style={blokjePositionStyle} kleur={blokjeKleur} />
  </div>
);

const StatusPanel = ({ data, logs }: { data: FabriekStatus, logs: string[] }) => (
  <div className="flex flex-col gap-5">
    <div className="card p-5 border border-gray-700"><h2 className="text-lg font-bold text-kensan-white mb-2">Oven</h2><div className="text-gray-300">Temp: <span className={data.oven.temperatuur > 100 ? "text-red-500 font-bold" : "text-kensan-light_orange"}>{data.oven.temperatuur}°C</span> | Status: {data.oven.status}</div></div>
    <div className="card p-5 border border-gray-700"><h2 className="text-lg font-bold text-kensan-white mb-2">Kraan</h2><div className="text-gray-300">Rotatie: {data.kraan.motorRotate} | Vacuüm: {data.kraan.vacuumValve ? "AAN" : "UIT"}</div></div>
    <div className="card p-5 border border-gray-700"><h2 className="text-lg font-bold text-kensan-white mb-2">Magazijn</h2><div className="text-gray-300">Status: {data.magazijn.status}</div></div>
    <div className="card p-5 border border-gray-700"><h2 className="text-lg font-bold text-kensan-white mb-2">Sorteerlijn</h2><div className="text-gray-300">Status: {data.loopband.status}</div></div>
    <div className="card p-5 border border-gray-700">
      <h2 className="text-lg font-bold text-kensan-white mb-2">Systeem Log</h2>
      <pre className="h-32 overflow-y-scroll p-2 rounded font-mono text-sm" style={{ backgroundColor: 'var(--divider-color)', color: 'var(--text-secondary)'}}>{logs.join('\n')}</pre>
    </div>
  </div>
);

// ==============================================================================
// 4. HOOFD COMPONENT
// ==============================================================================
export default function Dashboard() {
  const [huidigeData, setHuidigeData] = useState<FabriekStatus>(nepData);
  const [blokjePositie, setBlokjePositie] = useState<React.CSSProperties>(blokjePosities.magazijn_stelling);
  const [magazijnKraanPositie, setMagazijnKraanPositie] = useState<React.CSSProperties>(magazijnKraanPosities.thuis);
  const [groteKraanRotatie, setGroteKraanRotatie] = useState<"LINKS"|"RECHTS"|"STIL">("STIL");
  const [blokjeKleur, setBlokjeKleur] = useState<string>("#29AAE2");

  const [logs, setLogs] = useState<string[]>(["Dashboard geladen..."]);
  
  useEffect(() => {
    let stapIndex = 0;
    
    const voerStapUit = () => {
        const stap = simulatieStappen[stapIndex];

        setHuidigeData(stap.data);
        setBlokjePositie(blokjePosities[stap.blokjeLocatie]);
        setMagazijnKraanPositie(magazijnKraanPosities[stap.magazijnKraanLocatie]);
        setGroteKraanRotatie(stap.groteKraanRotatie || "STIL");
        setBlokjeKleur(stap.blokjeKleur || "#29AAE2");
        
        setLogs(prev => [stap.log, ...prev].slice(0, 10));

        const wachttijd = stap.duur || 2000;
        stapIndex = (stapIndex + 1) % simulatieStappen.length;
        
        setTimeout(voerStapUit, wachttijd);
    };

    setTimeout(voerStapUit, 1000);
  }, []); 

  return (
    <div className="p-5 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-5 text-kensan-white">Fabriek Overzicht</h1>
      <div className="grid grid-cols-3 gap-5 dashboard-grid">
        <div className="col-span-2">
          <FactoryView 
            blokjePositionStyle={blokjePositie} 
            blokjeKleur={blokjeKleur}
            magazijnKraanStyle={magazijnKraanPositie} 
            groteKraanRotatie={groteKraanRotatie}
            data={huidigeData} 
          />
        </div>
        <div className="col-span-1">
          <StatusPanel data={huidigeData} logs={logs} />
        </div>
      </div>
    </div>
  );
}