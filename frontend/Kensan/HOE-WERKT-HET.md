# 🎨 KENSAN DASHBOARD - HOE WERKT HET?

## ✅ WAT HEB IK GEMAAKT?

Ik heb een **compleet dashboard** gemaakt volgens jouw design met:

### 📁 Bestanden die ik heb gemaakt/aangepast:

1. **`src/components/Sidebar.tsx`** - De linker sidebar met menu
2. **`src/components/Header.tsx`** - De bovenbalk met "Hallo username"
3. **`src/pages/dashboard.tsx`** - De hoofdpagina die alles combineert
4. **`src/App.css`** - De kleuren en styles volgens jouw design
5. **`index.html`** - Google Icons toegevoegd

---

## 🎨 KLEUREN DIE IK HEB GEBRUIKT (EXACT VOLGENS JOUW LIJST)

```css
Donker grijs (achtergrond):  #171717
Secondary (sidebar delen):   #1E1E1E
Witte tekst:                 #FFFFFF
Light gray tekst:            #525252
Light mode knop:             #FFFFD0
Zon icon:                    #FFD325
Dropshadow: rgba(0, 0, 0, 0.25) met blur 4px en offset 0px 4px
```

---

## 🚀 HOE START JE DE APP?

Open een terminal in VS Code en typ:

```powershell
npm run dev
```

Dan gaat de app draaien op `http://localhost:5173` (of een andere poort)

---

## 📱 WAT ZIT ER IN DE SIDEBAR?

### Bovenaan:
- ✅ Kensan logo (gebruikt `/logo.png` uit je public folder)

### Menu items:
- ✅ **Dashboard** (actief - met witte balk rechts, rounded 5px)
- ✅ **Warehouse** (disabled/grijs)
- ✅ Horizontale lijn (kleur #1E1E1E)
- ✅ **Coming soon!** (2x, disabled)
- ✅ Horizontale lijn (kleur #1E1E1E)
- ✅ **Documentatie**

### Onderaan:
- ✅ Light mode toggle knop (gele achtergrond #FFFFD0, zon icon #FFD325)
- ✅ User icon in cirkel (achtergrond #1E1E1E)
- ✅ "not logged in" tekst (kleur #525252)
- ✅ Settings icon

**Alles heeft dropshadow!** ✅

---

## 📋 WAT ZIT ER IN DE HEADER?

- ✅ "Hallo, {username}" - grote witte tekst met dropshadow
- ✅ "» {maand} {dag}" - grijze datum tekst met dropshadow
- ✅ Uitlog knop rechts met power icon en gekleurde border (groen/blauw/rood)

---

## 🎯 HOE VOEG JE CONTENT TOE AAN HET DASHBOARD?

Open **`src/pages/dashboard.tsx`** en zoek naar dit stuk:

```tsx
<main className="flex-1 px-12 py-8" style={{ backgroundColor: '#171717' }}>
  {/* HIER KOMT JE DASHBOARD CONTENT */}
</main>
```

**Hier kun je toevoegen:**
- Kaartjes met statistieken
- Grafieken
- Tabellen
- Wat je maar wilt!

### Voorbeeld: Een kaartje toevoegen

```tsx
<div 
  className="p-6 rounded-lg"
  style={{ 
    backgroundColor: '#1E1E1E',
    filter: 'drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25))'
  }}
>
  <h3 
    className="text-xl font-semibold mb-2"
    style={{ 
      color: '#FFFFFF',
      filter: 'drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25))'
    }}
  >
    Mijn Kaartje
  </h3>
  <p style={{ color: '#525252' }}>
    Hier komt tekst
  </p>
</div>
```

---

## 🎨 HOE GEBRUIK JE DE KLEUREN?

### Voor achtergronden:
```tsx
style={{ backgroundColor: '#171717' }}  // Donker grijs
style={{ backgroundColor: '#1E1E1E' }}  // Secondary
```

### Voor tekst:
```tsx
style={{ color: '#FFFFFF' }}  // Wit
style={{ color: '#525252' }}  // Light gray
```

### Voor dropshadow (OP ALLE TEKST!):
```tsx
style={{ filter: 'drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25))' }}
```

---

## 🎯 HOE VERANDER JE WELK MENU ITEM ACTIEF IS?

Open **`src/pages/dashboard.tsx`** en verander deze regel:

```tsx
<Sidebar activeItem="dashboard" />
```

Mogelijke waarden:
- `"dashboard"` - Dashboard is actief (witte balk)
- `"warehouse"` - Warehouse is actief
- `"documentatie"` - Documentatie is actief

---

## 🔧 HOE VERANDER JE DE UITLOG KNOP KLEUR?

Open **`src/pages/dashboard.tsx`** en verander deze regel:

```tsx
<Header username="username" buttonColor="green" />
```

Mogelijke kleuren:
- `"green"` - Groene border ✅ (standaard)
- `"blue"` - Blauwe border
- `"red"` - Rode border

---

## 📦 GOOGLE ICONS GEBRUIKEN

Alle icons komen van Google Material Symbols. Zo gebruik je ze:

```tsx
<span className="material-symbols-outlined">
  dashboard
</span>
```

**Beschikbare icons in jouw project:**
- `dashboard` - Dashboard icon
- `shelves` - Warehouse icon
- `file_save` - Documentatie icon
- `person` - User icon
- `settings` - Settings icon
- `sunny` - Zon icon
- `power_settings_new` - Power/uitlog icon

Meer icons? Kijk op: https://fonts.google.com/icons

---

## 🎨 BELANGRIJKE STYLING REGELS

### 1. ALLE TEKST HEEFT DROPSHADOW
```tsx
style={{ filter: 'drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25))' }}
```

### 2. Actief menu item krijgt witte balk rechts (rounded 5px)
Dit gebeurt automatisch als je `activeItem` instelt!

### 3. Alles is groot en duidelijk (niet klein)
- Tekst: `text-xl`, `text-2xl`, `text-4xl`
- Padding: `px-12 py-8`
- Icons: `fontSize: '24px'` of `fontSize: '28px'`

---

## 🚨 VEELVOORKOMENDE VRAGEN

### Q: Waar is mijn HTML?
**A:** In React schrijf je HTML BINNEN je `.tsx` bestanden! Geen aparte HTML files.

### Q: Waar is mijn CSS?
**A:** De kleuren staan in `App.css` en je gebruikt `style={{ }}` in je componenten.

### Q: Hoe verander ik de username?
**A:** Open `src/pages/dashboard.tsx` en verander:
```tsx
<Header username="JouwNaam" buttonColor="green" />
```

### Q: Hoe maak ik een nieuwe pagina?
**A:** Maak een nieuw bestand in `src/pages/` (bijv. `warehouse.tsx`) en kopieer de structuur van `dashboard.tsx`.

### Q: Waarom zie ik niks?
**A:** Zorg dat je `npm run dev` hebt gedraaid in de terminal!

---

## ✅ CHECKLIST - IS ALLES COMPLEET?

- ✅ Sidebar met logo
- ✅ Menu items (Dashboard, Warehouse, etc.)
- ✅ Horizontale lijnen in sidebar (kleur #1E1E1E)
- ✅ Witte balk rechts bij actief menu item (rounded 5px)
- ✅ Light mode toggle knop (gele achtergrond + zon icon)
- ✅ User status onderaan ("not logged in")
- ✅ Header met "Hallo {username}" en datum
- ✅ Uitlog knop met gekleurde border
- ✅ Alle tekst heeft dropshadow
- ✅ Logo heeft dropshadow
- ✅ Juiste kleuren gebruikt (#171717, #1E1E1E, etc.)
- ✅ Google Icons werkend
- ✅ Alles groot en duidelijk (niet klein)

---

## 🎯 VOLGENDE STAPPEN

1. **Start de app:** `npm run dev`
2. **Bekijk het resultaat** in je browser
3. **Voeg content toe** in `src/pages/dashboard.tsx`
4. **Maak nieuwe componenten** in `src/components/` als je ze nodig hebt

Veel succes! 🚀
