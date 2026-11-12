import { useState, useEffect } from 'react';
import Gradjanin from './pages/Gradjanin.jsx';
import EkoUdruga from './pages/EkoUdruga.jsx';
import KomunalniRedar from './pages/KomunalniRedar.jsx';

export default function App() {
  const [role, setRole] = useState(null);
  const [prijavljen, setPrijavljen] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch("http://localhost:8080/api/me", {
        credentials: "include"
    })
    .then(response => {
        if (!response.ok) {
            return null;
        }
        return response.json();
    })
    .then(data => {
        if (data) {
            setUser(data);
            setPrijavljen(true);
            setRole(data.uloga);
        }
    })
    .catch(error => console.error(error));
  }, []);

  return (
    <>
      <header className="site-header">
        <div className="header-inner">
          <div className="brand">
            <span className="brand-name">Garbage Collectors</span>
            <span className="brand-description">Prijava i sanacija odlagališta</span>
          </div>
          <nav className="role-nav" aria-label="Tip korisnika">
            <button type="button" aria-pressed={prijavljen} disabled={prijavljen} onClick={() => {
              window.location.href = "http://localhost:8080/api/auth/google";
            }}
            >
              {prijavljen ? `Dobrodošli, ${user.ime}` : 'Prijavi se u sustav'}
            </button>
            <button type="button" aria-pressed={role === 'gradanin'} disabled={role !== 'gradanin'} onClick={() => setRole('gradanin')}>Građanin</button>
            <button type="button" aria-pressed={role === 'udruga'} disabled={role !== 'udruga'} onClick={() => setRole('udruga')}>Eko-udruga</button>
            <button type="button" aria-pressed={role === 'redar'} disabled={role !== 'redar'} onClick={() => setRole('redar')}>Komunalni redar</button>
          </nav>
        </div>
      </header>
      <main>
        {role === 'gradanin' && <Gradjanin />}
        {role === 'udruga' && <EkoUdruga />}
        {role === 'redar' && <KomunalniRedar />}
      </main>
    </>
  );
}
