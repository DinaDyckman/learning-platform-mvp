import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Category { _id: string; name: string; }

export default function Admin({ onBackToChat }: { onBackToChat: () => void }) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [catName, setCatName] = useState('');
  const [subName, setSubName] = useState('');
  const [selectedCatId, setSelectedCatId] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const load = () => axios.get('http://localhost:5000/api/categories')
    .then(r => setCategories(r.data))
    .catch(() => notify('שגיאה בטעינת קטגוריות', true));
  useEffect(() => { load(); }, []);

  const notify = (msg: string, isError = false) => {
    isError ? setError(msg) : setMessage(msg);
    setTimeout(() => { setMessage(''); setError(''); }, 3000);
  };

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/categories', { name: catName });
      notify(`קטגוריה "${catName}" נוצרה בהצלחה ✅`);
      setCatName('');
      load();
    } catch (err: any) {
      notify(err.response?.data?.message ?? 'שגיאה ביצירת קטגוריה', true);
    }
  };

  const handleAddSubCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCatId) { notify('יש לבחור קטגוריה ראשית', true); return; }
    try {
      await axios.post('http://localhost:5000/api/categories/sub', { name: subName, category_id: selectedCatId });
      notify(`תת-קטגוריה "${subName}" נוצרה בהצלחה ✅`);
      setSubName('');
      setSelectedCatId('');
    } catch (err: any) {
      notify(err.response?.data?.message ?? 'שגיאה ביצירת תת-קטגוריה', true);
    }
  };

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
        <nav style={{ padding: '16px 12px', flex: 1 }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px',
            borderRadius: 8, background: 'rgba(251,191,36,0.15)', color: '#fbbf24', fontSize: 14, fontWeight: 500
          }}>
            <span>🛠️</span> Admin
          </div>
        </nav>
        <div style={{ padding: '16px 12px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <button onClick={onBackToChat} style={{
            width: '100%', display: 'flex', alignItems: 'center', gap: 10,
            padding: '10px 12px', borderRadius: 8, border: 'none',
            background: 'transparent', color: '#a5b4fc', fontSize: 14, fontWeight: 500, cursor: 'pointer'
          }}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.06)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
          >
            <span>←</span> חזרה ל-Dashboard
          </button>
        </div>
      </aside>

      {/* Main */}
      <main style={{ flex: 1, padding: '32px', overflowY: 'auto' }}>
        <div style={{ maxWidth: 640 }}>
          <div style={{ marginBottom: 28 }}>
            <h1 style={{ fontSize: 26, fontWeight: 700, color: '#0f172a', marginBottom: 4 }}>פאנל ניהול 🛠️</h1>
            <p style={{ color: '#94a3b8', fontSize: 14 }}>הוסף קטגוריות ותת-קטגוריות למערכת</p>
          </div>

          {message && <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', color: '#16a34a', padding: '12px 16px', borderRadius: 10, marginBottom: 20, fontSize: 14, fontWeight: 500 }}>{message}</div>}
          {error && <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', padding: '12px 16px', borderRadius: 10, marginBottom: 20, fontSize: 14, fontWeight: 500 }}>{error}</div>}

          {/* Add Category */}
          <div style={{ background: '#fff', borderRadius: 16, padding: 24, boxShadow: '0 2px 12px rgba(0,0,0,0.06)', marginBottom: 20, direction: 'rtl' }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', marginBottom: 4 }}>➕ הוספת נושא ראשי</h2>
            <p style={{ fontSize: 13, color: '#94a3b8', marginBottom: 16 }}>למשל: מתמטיקה, פיזיקה, היסטוריה</p>
            <form onSubmit={handleAddCategory} style={{ display: 'flex', gap: 10 }}>
              <input value={catName} onChange={e => setCatName(e.target.value)} placeholder="שם הנושא הראשי" required style={{ ...inputStyle, flex: 1 }} />
              <button type="submit" style={{ ...btnStyle('#6366f1'), whiteSpace: 'nowrap', padding: '10px 20px' }}>הוסף</button>
            </form>
          </div>

          {/* Add SubCategory */}
          <div style={{ background: '#fff', borderRadius: 16, padding: 24, boxShadow: '0 2px 12px rgba(0,0,0,0.06)', direction: 'rtl' }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', marginBottom: 4 }}>➕ הוספת תת-נושא</h2>
            <p style={{ fontSize: 13, color: '#94a3b8', marginBottom: 16 }}>למשל: אנליזה, אלגברה (תחת מתמטיקה)</p>
            <form onSubmit={handleAddSubCategory} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <select value={selectedCatId} onChange={e => setSelectedCatId(e.target.value)} required style={inputStyle}>
                <option value="">-- בחר קטגוריה ראשית --</option>
                {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
              </select>
              <input value={subName} onChange={e => setSubName(e.target.value)} placeholder="שם תת-הקטגוריה" required style={inputStyle} />
              <button type="submit" style={btnStyle('#8b5cf6')}>הוסף תת-קטגוריה</button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  padding: '10px 14px', borderRadius: 10, border: '1.5px solid #e2e8f0',
  fontSize: 14, color: '#0f172a', background: '#f8fafc', outline: 'none', width: '100%'
};

const btnStyle = (bg: string): React.CSSProperties => ({
  padding: '11px', borderRadius: 10, border: 'none',
  background: bg, color: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer'
});
