import React, { useState, useEffect } from 'react';

// --- STAP 1: Importeer je SVG's (ANDERE MANIER) ---
// We importeren nu de *locatie* (URL) van de SVG, niet de component zelf.
// Let op: GEEN '?react' erachter!
import fabriekLayoutUrl from '../assets/FabriekAchtergrond.svg';
import blokjeIconUrl from '../assets/blokje.svg';


// ==================================
// HET DATA-CONTRACT (INTERFACES)
// (Dit blijft precies hetzelfde)
// ==================================
interface OvenData {
  status: "IDLE" | "PROCESSING" | "DONE" | "ERROR";
  temperatuur: number;
}
interface KraanData {
  status: "IDLE" | "PICKING" | "MOVING";
  heeftBlokje: boolean;
}
interface FabriekStatus {
  oven: OvenData;
  kraan: KraanData;
}

// ==================================
// NEP-DATA & SIMULATIE
// (Dit blijft ook precies hetzelfde)
// ==================================
const nepData: FabriekStatus = {
  oven: { status: "IDLE", temperatuur: 25 },
  kraan: { status: "IDLE", heeftBlokje: false },
};

// !!! BELANGRIJK: PAS DEZE POSITIES AAN !!!
const blokjePosities: { [key: string]: React.CSSProperties } = {
  magazijn: { top: '150px', left: '100px' },
  kraan_pakt: { top: '150px', left: '350px' },
  bij_oven: { top: '150px', left: '580px' },
};

interface SimulatieStap {
  locatie: string;
  log: string;
  data: FabriekStatus;
}
const simulatieStappen: SimulatieStap[] = [
  { locatie: "magazijn", log: "Proces start: Blokje in magazijn.", data: nepData },
  { locatie: "kraan_pakt", log: "Kraan pakt blokje...", data: { ...nepData, kraan: { status: "PICKING", heeftBlokje: true } } },
  { locatie: "bij_oven", log: "Kraan beweegt naar oven...", data: { ...nepData, kraan: { status: "MOVING", heeftBlokje: true } } },
  { locatie: "bij_oven", log: "Kraan dropt blokje. Oven start.", data: { ...nepData, kraan: { status: "IDLE", heeftBlokje: false }, oven: { status: "PROCESSING", temperatuur: 25 } } },
  { locatie: "bij_oven", log: "Oven warmt op...", data: { ...nepData, oven: { status: "PROCESSING", temperatuur: 150 } } },
  { locatie: "bij_oven", log: "Oven klaar.", data: { ...nepData, oven: { status: "DONE", temperatuur: 80 } } },
];


// ==================================
// DE BOUWBLOKKEN (COMPONENTEN)
// ==================================

// --- AANGEPAST: Het bewegende Blokje Component ---
type BlokjeProps = {
  style: React.CSSProperties;
};
const Blokje = ({ style }: BlokjeProps) => (
  <div 
    className="absolute"
    style={{
      width: '40px', // De grootte van je blokje
      height: '40px', 
      transition: 'all 0.5s ease-in-out', // De animatie!
      zIndex: 10, // Zorgt dat het blokje BOVENOP de SVG ligt
      ...style // Hier komt de positie (top, left)
    }}
  >
    {/* We gebruiken nu een <img> tag met de URL (src) */}
    <img 
      src={blokjeIconUrl} 
      alt="Blokje" 
      style={{ width: '100%', height: '100%' }} 
    />
  </div>
);


// --- AANGEPAST: De Top View Component ---
type FactoryViewProps = {
  blokjePositionStyle: React.CSSProperties;
};
const FactoryView = ({ blokjePositionStyle }: FactoryViewProps) => (
  <div className="card h-[600px] relative p-5"> 
    <h2 className="text-xl font-bold mb-4 text-kensan-white">Top View</h2>
    
    {/* Laag 1: De SVG Achtergrond (als <img> tag) */}
    <div className="absolute top-0 left-0 w-full h-full p-5">
      {/* We gebruiken nu een <img> tag met de URL (src) */}
      <img 
        src={fabriekLayoutUrl} 
        alt="Fabriek Layout" 
        style={{ width: '100%', height: '100%', objectFit: 'contain' }} 
      />
    </div>

    {/* Laag 2: Het Bewegende Blokje (dat eroverheen beweegt) */}
    <Blokje style={blokjePositionStyle} />
  </div>
);


// --- Status Panel Component ---
// (Deze blijft precies hetzelfde als in Stap 1)
type StatusPanelProps = {
  data: FabriekStatus; 
  logs: string[];      
};
const StatusPanel = ({ data, logs }: StatusPanelProps) => (
  <div className="flex flex-col gap-5">
    
    <div className="card p-5">
      <h2 className="text-lg font-bold text-kensan-white mb-2">Oven</h2>
      <div 
        className="text-lg font-bold px-3 py-2 rounded inline-block"
        style={{ backgroundColor: 'var(--divider-color)' }} 
      >
        {data.oven.status}
      </div>
      <div className="text-5xl font-bold text-kensan-light_orange mt-3">
        <span>{data.oven.temperatuur}</span>°C
      </div>
    </div>

    <div className="card p-5">
      <h2 className="text-lg font-bold text-kensan-white mb-2">Kraan</h2>
      <div 
        className="text-lg font-bold px-3 py-2 rounded inline-block"
        style={{ backgroundColor: 'var(--divider-color)' }}
      >
        {data.kraan.status}
      </div>
      <div className="text-lg mt-3 text-kensan-white">
        Heeft blokje: <b>{data.kraan.heeftBlokje ? "Ja" : "Nee"}</b>
      </div>
    </div>

    <div className="card p-5">
      <h2 className="text-lg font-bold text-kensan-white mb-2">Systeem Log</h2>
      <pre 
        className="h-32 overflow-y-scroll p-2 rounded font-mono text-sm"
        style={{ backgroundColor: 'var(--divider-color)', color: 'var(--text-secondary)'}}
      >
        {logs.join('\n')} 
      </pre>
    </div>
  </div>
);


// ==================================
// DE 'DASHBOARD' PAGINA (DE 'DIRIGENT')
// (Deze blijft bijna hetzelfde)
// ==================================
export default function Dashboard() {
  const [huidigeData, setHuidigeData] = useState<FabriekStatus>(nepData);
  const [blokjePositie, setBlokjePositie] = useState<React.CSSProperties>(blokjePosities.magazijn);
  const [logs, setLogs] = useState<string[]>(["Dashboard geladen. Wachten op proces..."]);
  const [huidigeStap, setHuidigeStap] = useState<number>(0);

  // De simulatie-timer (useEffect) blijft PRECIES HETZELFDE
  useEffect(() => {
    const timer = setInterval(() => {
      setHuidigeStap((prevStap) => {
        const volgendeStapIndex = (prevStap + 1) % simulatieStappen.length;
        const stap = simulatieStappen[volgendeStapIndex];

        setHuidigeData(stap.data);
        setBlokjePositie(blokjePosities[stap.locatie]);
        
        setLogs(prevLogs => {
          const nieuweLogs = [...prevLogs, stap.log];
          if (nieuweLogs.length > 10) {
            return nieuweLogs.slice(nieuweLogs.length - 10);
          }
          return nieuweLogs;
        });

        return volgendeStapIndex;
      });
    }, 2000); 

    return () => clearInterval(timer);
  }, []); 

  // De JSX layout blijft ook PRECIES HETZELFDE
  return (
    <div className="p-5 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-5 text-kensan-white">Fabriek Overzicht</h1>
      
      <div className="grid grid-cols-3 gap-5 dashboard-grid">
        
        <div className="col-span-2">
          <FactoryView blokjePositionStyle={blokjePositie} />
        </div>
        
        <div className="col-span-1">
          <StatusPanel data={huidigeData} logs={logs} />
        </div>
        
      </div>
    </div>
  );
}