import React, { useState, useEffect } from 'react';
import { sendPrompt, getUserHistory, getCategories, getSubCategories } from './services/api';
import Register from './pages/Register';
import Admin from './pages/Admin';

interface PromptItem {
  _id: string;
  prompt: string;
  response: string;
  category_id?: { name: string };
  sub_category_id?: { name: string };
}

interface IdNamePair {
  _id: string;
  name: string;
}

function App() {
  const [userId, setUserId] = useState<string | null>(null);
  const [isAdminMode, setIsAdminMode] = useState<boolean>(false);
  const [categories, setCategories] = useState<IdNamePair[]>([]);
  const [subCategories, setSubCategories] = useState<IdNamePair[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>('');
  const [promptText, setPromptText] = useState<string>('');
  const [currentResponse, setCurrentResponse] = useState<string>('');
  const [history, setHistory] = useState<PromptItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (userId) {
      fetchHistory();
      fetchInitialCategories();
    }
  }, [userId]);

  useEffect(() => {
    if (selectedCategory) {
      fetchSubCategories(selectedCategory);
    } else {
      setSubCategories([]);
    }
    setSelectedSubCategory('');
  }, [selectedCategory]);

  const fetchInitialCategories = async () => {
    try {
      const res = await getCategories();
      if (res.success) setCategories(res.data);
    } catch (err) {
      console.error("Failed to load categories", err);
    }
  };

  const fetchSubCategories = async (catId: string) => {
    try {
      const res = await getSubCategories(catId);
      if (res.success) setSubCategories(res.data);
    } catch (err) {
      console.error("Failed to load subcategories", err);
    }
  };

  const fetchHistory = async () => {
    if (!userId) return;
    try {
      const res = await getUserHistory(userId);
      if (res.success) setHistory(res.data);
    } catch (err) {
      console.error("Failed to load history", err);
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId || !promptText.trim()) return;
    
    if (!selectedCategory || !selectedSubCategory) {
      alert("אנא בחרי קטגוריה ותת-קטגוריה לפני שליחת השאלה!");
      return;
    }

    setLoading(true);
    setCurrentResponse('');

    try {
      const data = await sendPrompt({
        user_id: userId,
        category_id: selectedCategory,
        sub_category_id: selectedSubCategory,
        prompt: promptText
      });

      if (data.success) {
        setCurrentResponse(data.data.response);
        setPromptText('');
        fetchHistory();
      }
    } catch (err) {
      console.error("Failed to send prompt", err);
      setCurrentResponse("אופס... משהו השתבש בתקשורת עם השרת.");
    } finally {
      setLoading(false);
    }
  };

  if (isAdminMode) {
    return <Admin onBackToChat={() => { setIsAdminMode(false); fetchInitialCategories(); }} />;
  }

  if (!userId) {
    return (
      <Register 
        onRegisterSuccess={(id) => setUserId(id)} 
        onSwitchToLogin={() => alert("אופציית ההתחברות תחובר בהמשך, כרגע אנא הירשמי!")} 
      />
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', fontFamily: 'Arial, sans-serif', direction: 'rtl' }}>
      
      {/* 🌟 סרגל כלים עליון קבוע (Header) המכיל את כפתורי הניהול בצורה ברורה */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#ffffff', padding: '10px 30px', borderBottom: '1px solid #e0e0e0', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
        <h2 style={{ margin: 0, fontSize: '20px', color: '#333' }}>🤖 מערכת למידה מבוססת AI</h2>
        <div style={{ display: 'flex', gap: '15px' }}>
          <button 
            onClick={() => setIsAdminMode(true)} 
            style={{ padding: '8px 16px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px' }}
          >
            ניהול מערכת 🛠️
          </button>
          <button 
            onClick={() => setUserId(null)} 
            style={{ padding: '8px 16px', backgroundColor: '#fff', color: '#dc3545', border: '1px solid #dc3545', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px' }}
          >
            התנתק 🚪
          </button>
        </div>
      </div>

      {/* האזור המרכזי המפוצל */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        
        {/* תפריט צד - היסטוריה */}
        <div style={{ width: '300px', backgroundColor: '#f0f2f5', padding: '20px', borderLeft: '1px solid #ccc', overflowY: 'auto' }}>
          <h3 style={{ marginTop: 0, marginBottom: '15px', borderBottom: '1px solid #ddd', paddingBottom: '10px', color: '#444' }}>היסטוריית שאלות</h3>
          {history.length === 0 ? <p style={{ color: '#888' }}>אין שאלות קודמות</p> : (
            <ul style={{ listStyleType: 'none', padding: 0, margin: 0 }}>
              {history.map((item) => (
                <li 
                  key={item._id} 
                  onClick={() => setCurrentResponse(item.response)}
                  style={{ padding: '12px', backgroundColor: '#fff', marginBottom: '12px', borderRadius: '8px', cursor: 'pointer', boxShadow: '0 1px 4px rgba(0,0,0,0.08)', transition: 'transform 0.1s' }}
                >
                  <strong style={{ display: 'block', marginBottom: '5px', color: '#333' }}>{item.prompt}</strong>
                  <div style={{ fontSize: '11px', color: '#777', backgroundColor: '#f8f9fa', padding: '3px 6px', borderRadius: '4px', display: 'inline-block' }}>
                    {item.category_id?.name} / {item.sub_category_id?.name}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* אזור מרכזי - הצ'אט */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '20px', backgroundColor: '#fff' }}>
          
          {/* אזור בחירת קטגוריות דינמיות */}
          <div style={{ display: 'flex', gap: '15px', marginBottom: '15px', backgroundColor: '#f9f9f9', padding: '15px', borderRadius: '8px', border: '1px solid #eee' }}>
            <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
              <label style={{ marginBottom: '5px', fontWeight: 'bold', fontSize: '14px', color: '#555' }}>בחר נושא ראשי:</label>
              <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc', fontSize: '15px', backgroundColor: '#fff' }}>
                <option value="">-- בחר קטגוריה --</option>
                {categories.map(cat => <option key={cat._id} value={cat._id}>{cat.name}</option>)}
              </select>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
              <label style={{ marginBottom: '5px', fontWeight: 'bold', fontSize: '14px', color: '#555' }}>בחר תת נושא:</label>
              <select value={selectedSubCategory} onChange={(e) => setSelectedSubCategory(e.target.value)} disabled={!selectedCategory} style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc', fontSize: '15px', backgroundColor: '#fff' }}>
                <option value="">-- בחר תת-קטגוריה --</option>
                {subCategories.map(sub => <option key={sub._id} value={sub._id}>{sub.name}</option>)}
              </select>
            </div>
          </div>
          
          {/* חלונית פלט התשובה */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '20px', backgroundColor: '#fafafa', borderRadius: '8px', marginBottom: '20px', whiteSpace: 'pre-wrap', border: '1px solid #f0f0f0', textAlign: 'right' }}>
            {loading ? <p style={{ fontWeight: 'bold', color: '#007bff' }}>ה-AI חושב עכשיו על תשובה... 🧠</p> : (
              currentResponse || <p style={{ color: '#999' }}>אנא בחרי נושא, תת נושא, והקלידי שאלה למטה כדי להתחיל לקבל תשובות מה-AI.</p>
            )}
          </div>

          {/* טופס קלט השאלה */}
          <form onSubmit={handleSend} style={{ display: 'flex', gap: '10px' }}>
            <input 
              type="text" 
              value={promptText}
              onChange={(e) => setPromptText(e.target.value)}
              placeholder="שאל אותי משהו בנושא שנבחר..."
              style={{ flex: 1, padding: '12px', borderRadius: '5px', border: '1px solid #ccc', fontSize: '16px' }}
              disabled={loading}
            />
            <button 
              type="submit" 
              disabled={loading}
              style={{ padding: '12px 24px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold' }}
            >
              שלח
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}

export default App;