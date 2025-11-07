# 🏭 Kensan Dashboard - Hoe te Beginnen

## 📁 Hoe React Werkt (Simpel!)

### De Flow:
```
index.html (basis HTML)
    ↓
src/index.tsx (laadt React)
    ↓
src/App.tsx (jouw hoofdpagina)
    ↓
src/pages/* (verschillende pagina's zoals Dashboard, Producten, etc.)
    ↓
src/components/* (herbruikbare stukjes zoals knoppen, kaarten, etc.)
```

## 🎨 Waar je HTML/CSS schrijft:

### HTML (eigenlijk JSX):
Je schrijft het BINNEN je `.tsx` bestanden zo:
```tsx
function Dashboard() {
  return (
    <div className="p-4 bg-gray-100">
      <h1 className="text-2xl font-bold">Mijn Dashboard</h1>
      <p>Dit is gewoon HTML in React!</p>
    </div>
  );
}
```

### CSS - Je hebt 2 opties:

#### Optie 1: Tailwind Classes (AANBEVOLEN)
```tsx
<div className="bg-blue-500 text-white p-4 rounded-lg shadow-md">
  Content hier
</div>
```

#### Optie 2: Custom CSS in App.css
```css
.mijn-speciale-box {
  background-color: #FF6B00;
  padding: 20px;
}
```

## 🏗️ Stappenplan voor jouw Dashboard:

### Stap 1: Kleuren Pallet instellen (in App.css)
Voeg je Kensan kleuren toe aan je CSS variabelen

### Stap 2: Maak je Dashboard Layout
Maak een basis layout in `src/pages/dashboard.tsx`

### Stap 3: Maak herbruikbare Components
Bijvoorbeeld:
- `src/components/Card.tsx` - Voor data kaartjes
- `src/components/Sidebar.tsx` - Voor zijmenu
- `src/components/Header.tsx` - Voor bovenbalk

### Stap 4: Voeg data toe
Later kun je data van een API ophalen

## 🎯 Waar BEGIN je?

1. **EERST**: Voeg je kleurenpalet toe aan App.css
2. **DAN**: Maak een simpele Dashboard pagina
3. **DAARNA**: Breek het op in kleine components

## 🔥 Belangrijke Regels:

- ✅ HTML schrijf je IN je .tsx bestanden (niet apart)
- ✅ CSS schrijf je in App.css OF gebruik Tailwind classes
- ✅ Elke pagina is een React component (functie die HTML returned)
- ✅ Components zijn herbruikbare stukjes code

## 📝 Voorbeelden:

### Component maken:
```tsx
function MijnComponent() {
  return <div>Hallo wereld!</div>;
}
```

### Component gebruiken:
```tsx
function App() {
  return (
    <div>
      <MijnComponent />
    </div>
  );
}
```
