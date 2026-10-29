import { useState } from 'react';
import Gradjanin from './pages/Gradjanin.jsx';
import EkoUdruga from './pages/EkoUdruga.jsx';
import KomunalniRedar from './pages/KomunalniRedar.jsx';

export default function App() {
  const [role, setRole] = useState('citizen');

  return (
    <>
      <header className="site-header">
        <div className="header-inner">
          <div className="brand">
            <span className="brand-name">Garbage Collectors</span>
            <span className="brand-description">Prijava i sanacija odlagališta</span>
          </div>
          <nav className="role-nav" aria-label="Tip korisnika">
            <button type="button" aria-pressed={role === 'citizen'} onClick={() => setRole('citizen')}>Građanin</button>
            <button type="button" aria-pressed={role === 'association'} onClick={() => setRole('association')}>Eko-udruga</button>
            <button type="button" aria-pressed={role === 'officer'} onClick={() => setRole('officer')}>Komunalni redar</button>
          </nav>
        </div>
      </header>
      <main>
        {role === 'citizen' && <Gradjanin />}
        {role === 'association' && <EkoUdruga />}
        {role === 'officer' && <KomunalniRedar />}
      </main>
    </>
  );
}
