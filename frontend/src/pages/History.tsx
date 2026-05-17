import { useState, useEffect } from 'react';
import { getUserHistory } from '../services/api';

interface PromptRecord {
  _id: string;
  prompt: string;
  response: string;
  tokens: number;
  isFavorite: boolean;
  createdAt: string;
  category_id?: { name: string };
  sub_category_id?: { name: string };
}

export default function History({ userId, onBack }: { userId: string; onBack: () => void }) {
  const [history, setHistory] = useState<PromptRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    getUserHistory(userId)
      .then(data => setHistory(data.data ?? data))
      .finally(() => setLoading(false));
  }, [userId]);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: "'Inter', sans-serif" }}>

      {/* Sidebar */}
      <aside style={{ width: 240, background: '#1e1b4b', color: '#c7d2fe', display: 'flex', flexDirection: 'column', padding: '24px 0', flexShrink: 0 }}>
        <div style={{ padding: '0 20px 24px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ fontSize: 22, fontWeight: 700, color: '#fff' }}>🎓 LearnAI</div>
        </div>
        <nav style={{ padding: '16px 12px', flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 8, background: 'rgba(99,102,241,0.3)', color: '#fff', fontSize: 14, fontWeight: 500 }}>
            <span>📊</span> היסטוריה
          </div>
        </nav>
        <div style={{ padding: '16px 12px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <button onClick={onBack} style={{
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
      <main style={{ flex: 1, padding: '32px', overflowY: 'auto', background: '#f8fafc' }}>
        <div style={{ maxWidth: 760 }}>
          <div style={{ marginBottom: 28 }}>
            <h1 style={{ fontSize: 26, fontWeight: 700, color: '#0f172a', marginBottom: 4 }}>היסטוריה 📊</h1>
            <p style={{ color: '#94a3b8', fontSize: 14 }}>{history.length} שיחות</p>
          </div>

          {loading && <div style={{ textAlign: 'center', color: '#94a3b8', padding: 40 }}>טוען...</div>}

          {!loading && history.length === 0 && (
            <div style={{ textAlign: 'center', padding: 60, background: '#fff', borderRadius: 20, boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>💬</div>
              <p style={{ color: '#94a3b8', fontSize: 15 }}>אין היסטוריה עדיין. התחל לשאול שאלות!</p>
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {history.map(item => {
              const title = [item.category_id?.name, item.sub_category_id?.name].filter(Boolean).join(' › ') || 'שיחה';
              const isOpen = expanded === item._id;
              return (
                <div key={item._id} style={{
                  background: '#fff', borderRadius: 16,
                  boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
                  overflow: 'hidden',
                  border: isOpen ? '1.5px solid #6366f1' : '1.5px solid transparent',
                  transition: 'border 0.2s'
                }}>

                  {/* Card Header */}
                  <div onClick={() => setExpanded(isOpen ? null : item._id)}
                    style={{ padding: '16px 20px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 14, direction: 'rtl' }}>

                    <div style={{
                      width: 40, height: 40, borderRadius: 12, flexShrink: 0,
                      background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18
                    }}>📚</div>

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 15, fontWeight: 700, color: '#0f172a' }}>{title}</div>
                      <div style={{ fontSize: 13, color: '#94a3b8', marginTop: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {item.prompt}
                      </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4, flexShrink: 0 }}>
                      <div style={{ fontSize: 12, color: '#94a3b8' }}>
                        {new Date(item.createdAt).toLocaleDateString('he-IL', { day: 'numeric', month: 'short' })}
                        {' '}
                        {new Date(item.createdAt).toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' })}
                      </div>
                      <div style={{ color: '#94a3b8', fontSize: 16, transition: 'transform 0.2s', transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>▾</div>
                    </div>
                  </div>

                  {/* Expanded Q&A */}
                  {isOpen && (
                    <div style={{ borderTop: '1px solid #f1f5f9', padding: '16px 20px', direction: 'rtl', display: 'flex', flexDirection: 'column', gap: 12 }}>
                      <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', flexDirection: 'row-reverse' }}>
                        <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'linear-gradient(135deg, #10b981, #059669)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, flexShrink: 0 }}>👤</div>
                        <div style={{ background: '#f0fdf4', borderRadius: 10, padding: '10px 14px', fontSize: 14, color: '#334155', lineHeight: 1.7, maxWidth: '80%' }}>{item.prompt}</div>
                      </div>
                      <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                        <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, flexShrink: 0 }}>🤖</div>
                        <div style={{ background: '#f8fafc', borderRadius: 10, padding: '10px 14px', fontSize: 14, color: '#334155', lineHeight: 1.7, maxWidth: '80%' }}>{item.response}</div>
                      </div>
                      <div style={{ fontSize: 12, color: '#cbd5e1', textAlign: 'left' }}>
                        {item.tokens} tokens {item.isFavorite ? '⭐' : ''}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}
