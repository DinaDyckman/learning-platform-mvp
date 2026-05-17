import React, { useState } from 'react';
import { registerUser, loginUser } from '../services/api';

interface RegisterProps {
  onRegisterSuccess: (userId: string, userName: string, isNew: boolean, role: string) => void;
}

export default function Register({ onRegisterSuccess }: RegisterProps) {
  const [isLoginMode, setIsLoginMode] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isLoginMode) {
        const res = await loginUser({ email, phone, password });
        if (res.success && res.data) onRegisterSuccess(res.data._id, res.data.name, false, res.data.role ?? 'student');
        else setError('פרטי התחברות שגויים');
      } else {
        const res = await registerUser({ name, email, phone, password });
        if (res.success && res.data) onRegisterSuccess(res.data._id, res.data.name, true, res.data.role ?? 'student');
        else setError('הרשמה נכשלה. ודאי שכל השדות תקינים');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'שגיאה בתקשורת עם השרת');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      display: 'flex', minHeight: '100vh', fontFamily: "'Inter', sans-serif"
    }}>
      {/* Left panel */}
      <div style={{
        flex: 1, background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
        display: 'flex', flexDirection: 'column', justifyContent: 'center',
        alignItems: 'center', padding: '3rem', color: '#fff'
      }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>🎓</div>
        <h1 style={{ fontSize: 32, fontWeight: 700, marginBottom: 12, textAlign: 'center' }}>
          AI Learning Platform
        </h1>
        <p style={{ fontSize: 16, opacity: 0.85, textAlign: 'center', maxWidth: 280, lineHeight: 1.6 }}>
          למד, התפתח וצמח עם עזרת בינה מלאכותית מתקדמת
        </p>
        <div style={{ marginTop: 48, display: 'flex', flexDirection: 'column', gap: 16 }}>
          {['✨ שאלות חכמות ותשובות מיידיות', '📚 קטגוריות לימוד מגוונות', '📊 מעקב היסטוריית למידה'].map(f => (
            <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, opacity: 0.9 }}>
              {f}
            </div>
          ))}
        </div>
      </div>

      {/* Right panel */}
      <div style={{
        flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center',
        padding: '3rem', background: '#f8fafc', direction: 'rtl'
      }}>
        <div style={{
          background: '#fff', borderRadius: 16, padding: '2.5rem',
          width: '100%', maxWidth: 420,
          boxShadow: '0 4px 24px rgba(0,0,0,0.08)'
        }}>
          <h2 style={{ fontSize: 24, fontWeight: 700, color: '#0f172a', marginBottom: 6 }}>
            {isLoginMode ? 'ברוך הבא בחזרה 👋' : 'צור חשבון חדש 🚀'}
          </h2>
          <p style={{ fontSize: 14, color: '#94a3b8', marginBottom: 28 }}>
            {isLoginMode ? 'הכנס את פרטיך להתחברות' : 'הצטרף לפלטפורמה בחינם'}
          </p>

          {error && (
            <div style={{
              background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626',
              padding: '10px 14px', borderRadius: 8, marginBottom: 20, fontSize: 13, fontWeight: 500
            }}>{error}</div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {!isLoginMode && (
              <Field label="שם מלא" type="text" value={name} onChange={setName} placeholder="ישראל ישראלי" />
            )}
            <Field label="אימייל" type="email" value={email} onChange={setEmail} placeholder="you@example.com" />
            <Field label="טלפון" type="text" value={phone} onChange={setPhone} placeholder="050-0000000" />
            <Field label="סיסמה" type="password" value={password} onChange={setPassword} placeholder="לפחות 6 תווים" />

            <button type="submit" disabled={loading} style={{
              marginTop: 4, padding: '12px', borderRadius: 10, border: 'none',
              background: loading ? '#a5b4fc' : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              color: '#fff', fontSize: 15, fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'opacity 0.2s'
            }}>
              {loading ? '...' : isLoginMode ? 'התחבר' : 'הרשמה וכניסה'}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: 20 }}>
            <button onClick={() => { setIsLoginMode(!isLoginMode); setError(''); }} style={{
              background: 'none', border: 'none', color: '#6366f1', cursor: 'pointer',
              fontSize: 13, fontWeight: 500, textDecoration: 'underline'
            }}>
              {isLoginMode ? 'אין לך חשבון? הרשם כאן' : 'כבר יש לך חשבון? התחבר'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, type, value, onChange, placeholder }: {
  label: string; type: string; value: string;
  onChange: (v: string) => void; placeholder: string;
}) {
  return (
    <div>
      <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>
        {label}
      </label>
      <input
        type={type} value={value} placeholder={placeholder} required
        onChange={e => onChange(e.target.value)}
        style={{
          width: '100%', padding: '10px 14px', borderRadius: 8,
          border: '1.5px solid #e2e8f0', fontSize: 14, color: '#0f172a',
          outline: 'none', transition: 'border-color 0.2s',
          background: '#f8fafc'
        }}
        onFocus={e => e.target.style.borderColor = '#6366f1'}
        onBlur={e => e.target.style.borderColor = '#e2e8f0'}
      />
    </div>
  );
}
