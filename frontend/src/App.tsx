import React, { useState, useMemo } from 'react';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';

const COLORS = ['#6366f1','#8b5cf6','#ec4899','#f59e0b','#10b981','#3b82f6','#ef4444'];

export default function App() {
  const [userId, setUserId] = useState<string | null>(null);
  const [userName, setUserName] = useState('');
  const [userRole, setUserRole] = useState('');
  const [isNewUser, setIsNewUser] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const [confettiKey, setConfettiKey] = useState(0);

  const confettiPieces = useMemo(() => Array.from({ length: 80 }).map((_, i) => ({
    left: Math.random() * 100,
    width: 6 + Math.random() * 8,
    height: 6 + Math.random() * 8,
    circle: Math.random() > 0.5,
    color: COLORS[i % COLORS.length],
    duration: 2.5 + Math.random() * 2,
    delay: Math.random() * 1.8,
    rotate: Math.random() * 360,
  })), [confettiKey]);

  const handleLoginSuccess = (id: string, name: string, isNew: boolean, role: string) => {
    setUserId(id);
    setUserName(name);
    setUserRole(role);
    setIsNewUser(isNew);
    setShowWelcome(true);
    setConfettiKey(k => k + 1);
    setTimeout(() => setShowWelcome(false), 5000);
  };

  const handleLogout = () => {
    setUserId(null);
    setUserName('');
    setUserRole('');
    setShowWelcome(false);
  };

  if (!userId) return <Register onRegisterSuccess={handleLoginSuccess} />;

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>

      {showWelcome && (
        <>
          <div style={{
            position: 'fixed', top: 24, left: '50%', transform: 'translateX(-50%)',
            background: isNewUser
              ? 'linear-gradient(135deg, #10b981, #059669)'
              : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            color: '#fff', padding: '14px 36px', borderRadius: 50,
            boxShadow: '0 8px 32px rgba(0,0,0,0.18)', zIndex: 9999,
            fontSize: 18, fontWeight: 700, whiteSpace: 'nowrap',
            animation: 'slideDown 0.4s ease', direction: 'rtl'
          }}>
            {isNewUser ? `🎉 ברוך הבא, ${userName}! שמחים שהצטרפת!` : `👋 ברוך הבא בחזרה, ${userName}!`}
          </div>

          <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 9998, overflow: 'hidden' }}>
            {confettiPieces.map((p, i) => (
              <div key={i} style={{
                position: 'absolute', top: -12, left: `${p.left}%`,
                width: p.width, height: p.height,
                borderRadius: p.circle ? '50%' : '2px',
                background: p.color,
                animation: `confettiFall ${p.duration}s linear ${p.delay}s both`,
                transform: `rotate(${p.rotate}deg)`
              }} />
            ))}
          </div>

          <style>{`
            @keyframes confettiFall {
              0%   { transform: translateY(0) rotate(0deg); opacity: 1; }
              100% { transform: translateY(105vh) rotate(720deg); opacity: 0; }
            }
            @keyframes slideDown {
              from { transform: translateX(-50%) translateY(-20px); opacity: 0; }
              to   { transform: translateX(-50%) translateY(0);     opacity: 1; }
            }
          `}</style>
        </>
      )}

      <Dashboard userId={userId} userRole={userRole} onLogout={handleLogout} />
    </div>
  );
}
