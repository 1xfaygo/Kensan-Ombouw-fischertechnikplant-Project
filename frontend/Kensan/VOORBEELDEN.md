# 🎨 Kensan Dashboard - Voorbeelden & Cheatsheet

## 📝 Hoe Voeg Je Nieuwe Pagina's Toe?

### Stap 1: Maak een nieuw bestand in `src/pages/`
```tsx
// src/pages/producten.tsx
import React from 'react';

function Producten() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Producten</h1>
      <p>Hier komen je producten</p>
    </div>
  );
}

export default Producten;
```

### Stap 2: Voeg de route toe in `App.tsx`
```tsx
// Bovenaan importeren:
import Producten from "./pages/producten";

// In de <Routes> sectie toevoegen:
<Route path="/producten" element={<Producten />} />
```

## 🎨 Tailwind CSS Cheatsheet

### Kleuren
```tsx
// Achtergrond
className="bg-blue-500"     // Blauwe achtergrond
className="bg-red-500"      // Rode achtergrond
className="bg-gray-100"     // Licht grijs

// Tekst kleur
className="text-white"      // Witte tekst
className="text-gray-800"   // Donker grijze tekst
className="text-blue-600"   // Blauwe tekst
```

### Spacing (ruimte)
```tsx
// Padding (binnen ruimte)
className="p-4"             // Padding alle kanten (16px)
className="px-4 py-2"       // Horizontaal 16px, Verticaal 8px
className="pt-8"            // Padding top 32px

// Margin (buiten ruimte)
className="m-4"             // Margin alle kanten
className="mb-6"            // Margin bottom
className="mx-auto"         // Horizontaal centreren
```

### Layout
```tsx
// Flexbox
className="flex"                    // Maak flex container
className="flex items-center"       // Center verticaal
className="flex justify-between"    // Ruimte tussen items
className="flex-col"                // Verticale richting

// Grid
className="grid grid-cols-3"        // 3 kolommen
className="grid grid-cols-2 gap-4"  // 2 kolommen met ruimte
className="grid-cols-1 md:grid-cols-2 lg:grid-cols-4"  // Responsive!
```

### Borders & Shadows
```tsx
className="border border-gray-300"  // Border
className="rounded-lg"              // Afgeronde hoeken
className="shadow"                  // Schaduw
className="shadow-lg"               // Grote schaduw
```

### Typography
```tsx
className="text-sm"         // Klein (14px)
className="text-base"       // Normaal (16px)
className="text-xl"         // Groot (20px)
className="text-3xl"        // Heel groot (30px)
className="font-bold"       // Vet
className="font-medium"     // Medium gewicht
```

### Responsive Design
```tsx
// Werkt op alle schermen
className="p-4"

// Alleen op medium screens en groter (tablets+)
className="md:p-8"

// Alleen op large screens (desktop)
className="lg:grid-cols-4"

// Combineren!
className="p-4 md:p-8 lg:p-12"
```

## 🔨 Herbruikbare Component Maken

### Voorbeeld: Button Component
```tsx
// src/components/Button.tsx
import React from 'react';

interface ButtonProps {
  text: string;
  onClick?: () => void;
  color?: 'blue' | 'green' | 'red';
}

function Button({ text, onClick, color = 'blue' }: ButtonProps) {
  const colors = {
    blue: 'bg-blue-500 hover:bg-blue-600',
    green: 'bg-green-500 hover:bg-green-600',
    red: 'bg-red-500 hover:bg-red-600',
  };

  return (
    <button 
      onClick={onClick}
      className={`${colors[color]} text-white px-4 py-2 rounded-lg transition`}
    >
      {text}
    </button>
  );
}

export default Button;
```

### Gebruik:
```tsx
import Button from '../components/Button';

<Button text="Klik mij!" color="blue" onClick={() => alert('Geklikt!')} />
```

## 📊 Data Tonen (Arrays)

### Lijst met producten weergeven:
```tsx
function ProductenLijst() {
  const producten = [
    { id: 1, naam: 'Product A', prijs: 10 },
    { id: 2, naam: 'Product B', prijs: 20 },
    { id: 3, naam: 'Product C', prijs: 30 },
  ];

  return (
    <div>
      {producten.map((product) => (
        <div key={product.id} className="p-4 bg-white rounded-lg shadow mb-2">
          <h3 className="font-bold">{product.naam}</h3>
          <p>€{product.prijs}</p>
        </div>
      ))}
    </div>
  );
}
```

## 🎯 State Gebruiken (Data die verandert)

### Voorbeeld: Counter
```tsx
import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>Teller: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        Plus
      </button>
    </div>
  );
}
```

### Voorbeeld: Input veld
```tsx
import { useState } from 'react';

function NaamForm() {
  const [naam, setNaam] = useState('');

  return (
    <div>
      <input 
        type="text"
        value={naam}
        onChange={(e) => setNaam(e.target.value)}
        className="border p-2 rounded"
        placeholder="Typ je naam"
      />
      <p>Hallo {naam}!</p>
    </div>
  );
}
```

## 🎨 Je Eigen Kleuren Toevoegen

### In `src/App.css`:
```css
@layer base {
  :root {
    --kensan-blue: #1E40AF;
    --kensan-orange: #FF6B00;
    --kensan-dark: #1F2937;
  }
}
```

### Gebruik in Tailwind:
```css
.kensan-button {
  @apply bg-[#FF6B00] text-white px-6 py-3 rounded-lg hover:bg-[#E56100];
}
```

## 🚀 Handige Tips

1. **Alt + Shift + F** = Code automatisch netjes maken (formatting)
2. **Ctrl + Space** = Autocomplete suggesties
3. **Ctrl + Click** op een component = Ga naar definitie
4. Gebruik **Comments** om je code uit te leggen:
   ```tsx
   {/* Dit is een comment in JSX */}
   // Dit is een comment in TypeScript
   ```

## 📦 Project Structuur (Aanbevolen)

```
src/
  ├── components/      → Herbruikbare stukjes (Button, Card, etc.)
  ├── pages/          → Volledige pagina's (Dashboard, Products, etc.)
  ├── config/         → Configuratie (kleuren, constanten)
  ├── utils/          → Hulp functies
  ├── interfaces/     → TypeScript types
  ├── App.tsx         → Hoofd component
  ├── App.css         → Globale styles
  └── index.tsx       → Entry point
```

## 🎯 Volgende Stappen

1. ✅ Pas de kleuren aan in `src/config/colors.ts`
2. ✅ Pas `src/pages/dashboard.tsx` aan naar jouw design
3. ✅ Maak nieuwe componenten in `src/components/`
4. ✅ Voeg nieuwe pagina's toe in `src/pages/`
5. ✅ Test je app met `npm run dev`

Veel succes! 🚀
