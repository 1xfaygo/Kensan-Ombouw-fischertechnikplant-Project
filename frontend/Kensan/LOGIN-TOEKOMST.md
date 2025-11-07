# 🔐 Email Login Systeem - Toekomstige Implementatie

## Huidige Status
Het login systeem is **tijdelijk uitgeschakeld**. De applicatie gaat direct naar het dashboard zonder authenticatie.

## Toekomstig Plan: Email-gebaseerd Login
**GEEN Google/GitHub OAuth** - alleen email/password login.

### Wat je nodig hebt:

#### 1. Backend API
- **Node.js + Express** server
- **PostgreSQL** of **MongoDB** database voor gebruikers
- Endpoints:
  - `POST /api/auth/register` - Nieuwe gebruiker registreren
  - `POST /api/auth/login` - Inloggen met email/password
  - `POST /api/auth/logout` - Uitloggen
  - `GET /api/auth/me` - Huidige gebruiker ophalen

#### 2. Beveiliging
- **bcrypt** voor password hashing
- **JWT tokens** voor authenticatie
- **HTTP-only cookies** voor token opslag
- **Rate limiting** tegen brute force aanvallen

#### 3. Frontend Aanpassingen

**Login Component maken:**
```typescript
// src/pages/login.tsx
interface LoginForm {
  email: string;
  password: string;
}

function Login() {
  const [form, setForm] = useState<LoginForm>({
    email: '',
    password: ''
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
      credentials: 'include' // Voor cookies
    });

    if (response.ok) {
      // Redirect naar dashboard
      window.location.href = '/dashboard';
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleLogin}>
        <input 
          type="email" 
          value={form.email}
          onChange={(e) => setForm({...form, email: e.target.value})}
          placeholder="Email"
        />
        <input 
          type="password"
          value={form.password}
          onChange={(e) => setForm({...form, password: e.target.value})}
          placeholder="Wachtwoord"
        />
        <button type="submit">Inloggen</button>
      </form>
    </div>
  );
}
```

**App.tsx aanpassen met routing:**
```typescript
import { useState, useEffect } from 'react';
import Login from './pages/login';
import Dashboard from './pages/dashboard';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check of gebruiker is ingelogd
    fetch('/api/auth/me', { credentials: 'include' })
      .then(res => res.ok ? setIsLoggedIn(true) : setIsLoggedIn(false))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading...</div>;

  return isLoggedIn ? <Dashboard /> : <Login />;
}
```

#### 4. Uitlog Functionaliteit
De groene power button in de header moet uitlog functionaliteit krijgen:

```typescript
const handleLogout = async () => {
  await fetch('/api/auth/logout', {
    method: 'POST',
    credentials: 'include'
  });
  window.location.href = '/login';
};
```

### Aanbevolen Packages
```bash
# Backend
npm install express bcrypt jsonwebtoken cookie-parser express-rate-limit

# Als je TypeScript gebruikt
npm install -D @types/express @types/bcrypt @types/jsonwebtoken @types/cookie-parser

# Database (kies één)
npm install pg          # Voor PostgreSQL
npm install mongoose    # Voor MongoDB
```

### Beveiliging Checklist
- ✅ Wachtwoorden hashen met bcrypt (min. 10 rounds)
- ✅ JWT tokens met korte expiry tijd (15-30 min)
- ✅ Refresh tokens voor langere sessies
- ✅ HTTPS in productie (geen HTTP)
- ✅ CORS configuratie
- ✅ Rate limiting op login endpoint
- ✅ Email verificatie bij registratie
- ✅ "Wachtwoord vergeten" functionaliteit

### Database Schema Voorbeeld
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  username VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  email_verified BOOLEAN DEFAULT FALSE
);
```

### Environment Variables
```env
# .env bestand
DATABASE_URL=postgresql://user:password@localhost:5432/kensan
JWT_SECRET=jouw-geheime-sleutel-hier-minimaal-32-karakters
JWT_EXPIRES_IN=30m
REFRESH_TOKEN_EXPIRES_IN=7d
NODE_ENV=development
PORT=3001
```

## Stappenplan Implementatie
1. ✅ **Stap 1**: Backend API opzetten met Express
2. ✅ **Stap 2**: Database connectie en User model
3. ✅ **Stap 3**: Auth endpoints implementeren (register, login, logout)
4. ✅ **Stap 4**: JWT middleware voor beschermde routes
5. ✅ **Stap 5**: Login component in React maken
6. ✅ **Stap 6**: Auth state management toevoegen
7. ✅ **Stap 7**: Power button koppelen aan logout
8. ✅ **Stap 8**: Testen en beveiliging checken

## Huidige Bestand Structuur
```
Kensan/
├── src/
│   ├── pages/
│   │   ├── dashboard.tsx   ← Werkt nu zonder login
│   │   └── login.tsx       ← TODO: Email login form
│   └── App.tsx             ← TODO: Add routing & auth check
```

## Vragen?
Als je hulp nodig hebt met de implementatie, vraag dan om:
- Backend setup met Express
- Database schema & queries
- JWT authenticatie flow
- Frontend form validation
- Error handling
