import { useState, useEffect } from 'react';
import axios from 'axios';
import { sendPrompt } from '../services/api';
import Admin from './Admin';
import History from './History';

interface Category { _id: string; name: string; description?: string; icon?: string; }
interface SubCategory { _id: string; name: string; }

export default function Dashboard({ userId, userRole, onLogout }: { userId: string; userRole: string; onLogout: () => void }) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [selectedCat, setSelectedCat] = useState('');
  const [selectedSub, setSelectedSub] = useState('');
  const [prompt, setPrompt] = useState('');
  const [messages, setMessages] = useState<{role: 'user'|'ai', text: string}[]>([]);
  const [loading, setLoading] = useState(false);
  const [sendError, setSendError] = useState('');
  const [catError, setCatError] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  const loadCategories = () => {
    axios.get('http://localhost:5000/api/categories')
      .then(r => setCategories(r.data))
      .catch(() => setCatError(true));
  };

  useEffect(() => { loadCategories(); }, []);

  const selectCategory = async (id: string) => {
    setSelectedCat(id);
    setSelectedSub('');
    setMessages([]);
    if (!id) return setSubCategories([]);
    try {
      const r = await axios.get(`http://localhost:5000/api/categories/sub/${id}`);
      setSubCategories(r.data);
    } catch {
      setSubCategories([]);
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCat || !selectedSub) return;
    setLoading(true);
    setSendError('');
    const userPrompt = prompt;
    setMessages(m => [...m, { role: 'user', text: userPrompt }]);
    setPrompt('');
    try {
      const data = await sendPrompt({ user_id: userId, category_id: selectedCat, sub_category_id: selectedSub, prompt });
      console.log('API response:', data);
      const text = data?.data?.response ?? data?.response ?? data?.data?.prompt ?? null;
      if (text) { setMessages(m => [...m, { role: 'ai', text }]); }
      else setSendError('התקבלה תשובה לא צפויה: ' + JSON.stringify(data));
    } catch (err: any) {
      setSendError(err?.response?.data?.message ?? err?.message ?? 'שגיאה בשליחה');
    } finally {
      setLoading(false);
    }
  };

  if (showAdmin) return <Admin onBackToChat={() => { setShowAdmin(false); loadCategories(); }} />;
  if (showHistory) return <History userId={userId} onBack={() => setShowHistory(false)} />;

  const navItems = [
    { icon: '🏠', label: 'Dashboard' },
    { icon: '📊', label: 'History' },
    { icon: '⚙️', label: 'Settings' },
    ...(userRole === 'admin' ? [{ icon: '🛠️', label: 'Admin' }] : []),
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: "'Inter', sans-serif" }}>

      {/* Sidebar */}
      <aside style={{
        width: 240, background: '#1e1b4b', color: '#c7d2fe',
        display: 'flex', flexDirection: 'column', padding: '24px 0', flexShrink: 0
      }}>
        <div style={{ padding: '0 20px 24px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ fontSize: 22, fontWeight: 700, color: '#fff' }}>🎓 LearnAI</div>
        </div>
        <nav style={{ padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: 4, flex: 1 }}>
          {navItems.map(item => (
            <div key={item.label}
              onClick={() => { if (item.label === 'Admin') setShowAdmin(true); if (item.label === 'History') setShowHistory(true); }}
              style={{
                display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px',
                borderRadius: 8, cursor: 'pointer', fontSize: 14, fontWeight: 500,
                background: item.label === 'Dashboard' ? 'rgba(99,102,241,0.3)' : 'transparent',
                color: item.label === 'Admin' ? '#fbbf24' : item.label === 'Dashboard' ? '#fff' : '#a5b4fc',
              }}
              onMouseEnter={e => { if (item.label !== 'Dashboard') (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,0.06)'; }}
              onMouseLeave={e => { if (item.label !== 'Dashboard') (e.currentTarget as HTMLDivElement).style.background = 'transparent'; }}
            >
              <span>{item.icon}</span>{item.label}
            </div>
          ))}
        </nav>
        <div style={{ padding: '16px 12px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <button onClick={onLogout} style={{
            width: '100%', display: 'flex', alignItems: 'center', gap: 10,
            padding: '10px 12px', borderRadius: 8, border: 'none',
            background: 'transparent', color: '#f87171', fontSize: 14,
            fontWeight: 500, cursor: 'pointer'
          }}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(248,113,113,0.1)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
          >
            <span>🚪</span> התנתק
          </button>
        </div>
      </aside>

      {/* Main */}
      <main style={{ flex: 1, padding: '32px', overflowY: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ width: '100%', maxWidth: 720 }}>
          <div style={{ marginBottom: 24 }}>
            <h1 style={{ fontSize: 26, fontWeight: 700, color: '#0f172a', marginBottom: 4 }}>Dashboard</h1>
            <p style={{ color: '#94a3b8', fontSize: 14 }}>בחר קטגוריה ושאל את ה-AI שלך</p>
          </div>

          {/* Chat box */}
          <div style={{ background: '#fff', borderRadius: 20, boxShadow: '0 4px 24px rgba(0,0,0,0.08)', overflow: 'hidden' }}>

            {/* Dropdowns */}
            <div style={{ padding: '20px 24px', borderBottom: '1px solid #f1f5f9', background: '#fafbff', display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: 180 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: '#94a3b8', display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.8 }}>קטגוריה</label>
                <select value={selectedCat} onChange={e => selectCategory(e.target.value)} style={{
                  width: '100%', padding: '10px 14px', borderRadius: 10,
                  border: '1.5px solid #e2e8f0', fontSize: 14, color: selectedCat ? '#0f172a' : '#94a3b8',
                  background: '#fff', outline: 'none', cursor: 'pointer'
                }}>
                  <option value="">-- בחר קטגוריה --</option>
                  {catError
                    ? <option disabled>⚠️ שגיאה בטעינה</option>
                    : categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)
                  }
                </select>
              </div>

              {selectedCat && (
                <div style={{ flex: 1, minWidth: 180 }}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: '#94a3b8', display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.8 }}>תת-קטגוריה</label>
                  <select value={selectedSub} onChange={e => setSelectedSub(e.target.value)} style={{
                    width: '100%', padding: '10px 14px', borderRadius: 10,
                    border: '1.5px solid #e2e8f0', fontSize: 14, color: selectedSub ? '#0f172a' : '#94a3b8',
                    background: '#fff', outline: 'none', cursor: 'pointer'
                  }}>
                    <option value="">-- בחר תת-קטגוריה --</option>
                    {subCategories.length === 0
                      ? <option disabled>אין תת-קטגוריות</option>
                      : subCategories.map(s => <option key={s._id} value={s._id}>{s.name}</option>)
                    }
                  </select>
                </div>
              )}
            </div>

            {sendError && (
              <div style={{ padding: '12px 24px', color: '#dc2626', background: '#fef2f2', fontSize: 13, borderBottom: '1px solid #fecaca' }}>
                ⚠️ {sendError}
              </div>
            )}

            {messages.length > 0 && (
              <div style={{ padding: '20px 24px', borderBottom: '1px solid #f1f5f9', display: 'flex', flexDirection: 'column', gap: 16, maxHeight: 400, overflowY: 'auto' }}>
                {messages.map((msg, i) => (
                  <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', flexDirection: msg.role === 'user' ? 'row-reverse' : 'row' }}>
                    <div style={{
                      width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
                      background: msg.role === 'user' ? 'linear-gradient(135deg, #10b981, #059669)' : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16
                    }}>{msg.role === 'user' ? '👤' : '🤖'}</div>
                    <div style={{
                      background: msg.role === 'user' ? '#f0fdf4' : '#f8fafc',
                      borderRadius: 12, padding: '12px 16px', fontSize: 14,
                      color: '#334155', lineHeight: 1.7, maxWidth: '75%', direction: 'rtl'
                    }}>{msg.text}</div>
                  </div>
                ))}
              </div>
            )}

            {/* Input */}
            <form onSubmit={handleSend} style={{ padding: '16px 20px', display: 'flex', gap: 12, alignItems: 'flex-end' }}>
              <textarea rows={2} placeholder="הקלד את השאלה שלך כאן..." value={prompt}
                onChange={e => setPrompt(e.target.value)} required
                style={{
                  flex: 1, padding: '12px 16px', borderRadius: 12,
                  border: '1.5px solid #e2e8f0', fontSize: 14, color: '#0f172a',
                  background: '#f8fafc', resize: 'none', outline: 'none',
                  fontFamily: 'inherit', direction: 'rtl', lineHeight: 1.5
                }}
                onFocus={e => e.target.style.borderColor = '#6366f1'}
                onBlur={e => e.target.style.borderColor = '#e2e8f0'}
              />
              <button type="submit" disabled={loading} style={{
                padding: '12px 24px', borderRadius: 12, border: 'none',
                background: loading ? '#a5b4fc' : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                color: '#fff', fontSize: 14, fontWeight: 600,
                cursor: loading ? 'not-allowed' : 'pointer', flexShrink: 0, whiteSpace: 'nowrap'
              }}>
                {loading ? '⏳ שולח...' : '🚀 שלח'}
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
