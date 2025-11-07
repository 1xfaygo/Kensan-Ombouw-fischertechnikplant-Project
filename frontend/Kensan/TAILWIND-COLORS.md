# 🎨 Kensan Tailwind Kleuren

Alle Kensan kleuren zijn nu beschikbaar als Tailwind CSS classes!

## 📋 Beschikbare Kleuren

### Primary Colors
```tsx
bg-kensan-light_blue    // #29AAE2 - Licht blauw
bg-kensan-dark_blue     // #096891 - Donker blauw
bg-kensan-cyan          // #031F2B - Cyaan
bg-kensan-light_green   // #1BB14B - Licht groen
bg-kensan-dark_green    // #076926 - Donker groen
bg-kensan-light_orange  // #F89820 - Licht oranje
bg-kensan-dark_orange   // #F2811D - Donker oranje
```

### Base Colors
```tsx
bg-kensan-white         // #EEEEEE - Wit
bg-kensan-black         // #171717 - Zwart (sidebar, cards)
bg-kensan-gray          // #1E1E1E - Grijs (main background)
bg-kensan-light_gray    // #525252 - Licht grijs (text)
bg-kensan-yellow        // #FFD325 - Geel (sun icon)
bg-kensan-light_yellow  // #FFFFD0 - Licht geel (toggle bg)
```

### Status Colors
```tsx
bg-kensan-critical      // #FF3838 - Kritiek (rood)
bg-kensan-serious       // #FFB302 - Ernstig (oranje)
bg-kensan-caution       // #FCE83A - Voorzichtig (geel)
bg-kensan-normal        // #56F000 - Normaal (groen)
bg-kensan-standby       // #2DCCFF - Standby (blauw)
bg-kensan-off           // #A4ABB6 - Uit (grijs)
```

### Extra Colors
```tsx
bg-kensan-green         // #32F21D - Groen accent (power button)
bg-kensan-divider       // #2A2A2A - Divider lijnen
```

## 💡 Gebruik Voorbeelden

### Background Colors
```tsx
<div className="bg-kensan-black">Sidebar</div>
<div className="bg-kensan-gray">Main Content</div>
<div className="bg-kensan-critical">Error Message</div>
```

### Text Colors
```tsx
<h1 className="text-kensan-white">Titel</h1>
<p className="text-kensan-light_gray">Subtekst</p>
<span className="text-kensan-critical">Foutmelding</span>
```

### Border Colors
```tsx
<button className="border-2 border-kensan-green">Power Button</button>
<div className="border border-kensan-light_blue">Card met border</div>
```

### Hover States
```tsx
<button className="bg-kensan-black hover:bg-kensan-gray">
  Hover Effect
</button>
```

### Transparantie
```tsx
<div className="bg-kensan-white/50">50% transparant wit</div>
<div className="bg-kensan-black/10">10% transparant zwart</div>
```

## 🎯 Complete Class Lijst

### Background
- `bg-kensan-{color}`

### Text
- `text-kensan-{color}`

### Border
- `border-kensan-{color}`

### Ring (Focus states)
- `ring-kensan-{color}`

### Fill (SVG)
- `fill-kensan-{color}`

### Stroke (SVG)
- `stroke-kensan-{color}`

## 📝 Waar vervang je hex codes?

**Oud (inline styles):**
```tsx
<div style={{ backgroundColor: '#171717', color: '#EEEEEE' }}>
  Content
</div>
```

**Nieuw (Tailwind classes):**
```tsx
<div className="bg-kensan-black text-kensan-white">
  Content
</div>
```

## 🚀 Status Indicatoren Voorbeeld

```tsx
// Dashboard status cards
<div className="bg-kensan-normal p-4 rounded-lg">
  ✅ Systeem Operationeel
</div>

<div className="bg-kensan-caution p-4 rounded-lg">
  ⚠️ Waarschuwing
</div>

<div className="bg-kensan-critical p-4 rounded-lg">
  🚨 Kritieke Fout
</div>

<div className="bg-kensan-standby p-4 rounded-lg">
  ⏸️ Standby Modus
</div>
```

## 🎨 Gradient Voorbeelden

```tsx
// Van blauw naar groen
<div className="bg-gradient-to-r from-kensan-light_blue to-kensan-light_green">
  Gradient Background
</div>

// Van oranje naar rood
<div className="bg-gradient-to-br from-kensan-light_orange to-kensan-critical">
  Warning Gradient
</div>
```

## 💾 VSCode Autocomplete

Als je `className="bg-kensan-` typt, zou je automatisch alle beschikbare kleuren moeten zien in de autocomplete!

