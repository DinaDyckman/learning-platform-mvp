import React, { useState, useEffect } from 'react';
import { getCategories, createCategory, createSubCategory } from '../services/api';

interface IdNamePair {
  _id: string;
  name: string;
}

interface AdminProps {
  onBackToChat: () => void;
}

export default function Admin({ onBackToChat }: AdminProps) {
  const [categories, setCategories] = useState<IdNamePair[]>([]);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newSubCategoryName, setNewSubCategoryName] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // טעינת הקטגוריות הקיימות מיד כשהמסך עולה
  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const res = await getCategories();
      if (res.success) {
        setCategories(res.data);
      }
    } catch (err) {
      console.error("Failed to load categories", err);
    }
  };

  // 1. הוספת קטגוריה ראשית חדשה
  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;

    setMessage('');
    setError('');

    try {
      const res = await createCategory(newCategoryName);
      if (res.success) {
        setMessage(`הקטגוריה הראשית "${newCategoryName}" נוצרה בהצלחה!`);
        setNewCategoryName('');
        loadCategories(); // רענון תיבת הבחירה כדי שהקטגוריה החדשה תופיע מיד
      }
    } catch (err: any) {
      setError(err.response?.data?.message ?? 'שגיאה ביצירת קטגוריה ראשית');
    }
  };

  // 2. הוספת תת-קטגוריה חדשה
  const handleAddSubCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubCategoryName.trim() || !selectedCategoryId) {
      alert("אנא בחרי קטגוריה ראשית והקלידי שם לתת-הקטגוריה");
      return;
    }

    setMessage('');
    setError('');

    try {
      const res = await createSubCategory(selectedCategoryId, newSubCategoryName);
      if (res.success) {
        setMessage(`תת-הקטגוריה "${newSubCategoryName}" נוצרה בהצלחה!`);
        setNewSubCategoryName('');
      }
    } catch (err: any) {
      setError(err.response?.data?.message ?? 'שגיאה ביצירת תת-קטגוריה');
    }
  };

  return (
    <div style={{ 
      maxWidth: 600, 
      margin: '3rem auto', 
      padding: '2.5rem', 
      border: '1px solid #e0e0e0', 
      borderRadius: 12, 
      fontFamily: 'Arial, sans-serif', 
      direction: 'rtl', 
      backgroundColor: '#ffffff',
      boxShadow: '0 4px 15px rgba(0,0,0,0.05)'
    }}>
      
      {/* כותרת וכפתור חזרה */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', borderBottom: '2px solid #f0f0f0', paddingBottom: '1rem' }}>
        <h2 style={{ margin: 0, color: '#333' }}>פאנל ניהול קטגוריות 🛠️</h2>
        <button 
          onClick={onBackToChat} 
          style={{ padding: '10px 20px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 'bold' }}
        >
          חזרה לצ'אט 💬
        </button>
      </div>

      {/* הודעות הצלחה או שגיאה */}
      {message && <div style={{ padding: '12px', backgroundColor: '#d4edda', color: '#155724', borderRadius: 6, marginBottom: '1.5rem', fontWeight: 'bold' }}>{message}</div>}
      {error && <div style={{ padding: '12px', backgroundColor: '#f8d7da', color: '#721c24', borderRadius: 6, marginBottom: '1.5rem', fontWeight: 'bold' }}>{error}</div>}

      {/* חלק א': יצירת קטגוריה ראשית */}
      <div style={{ backgroundColor: '#f9f9f9', padding: '1.5rem', borderRadius: 8, border: '1px solid #eee', marginBottom: '2rem' }}>
        <h3 style={{ marginTop: 0, color: '#444' }}>1. הוספת נושא ראשי (קטגוריה ראשית)</h3>
        <form onSubmit={handleAddCategory} style={{ display: 'flex', gap: '10px' }}>
          <input 
            type="text" 
            placeholder="למשל: תכנות, רפואה, פיננסים..." 
            value={newCategoryName}
            onChange={e => setNewCategoryName(e.target.value)}
            style={{ flex: 1, padding: '12px', borderRadius: 6, border: '1px solid #ccc', fontSize: '15px' }}
            required
          />
          <button type="submit" style={{ padding: '12px 20px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 'bold' }}>
            הוסף קטגוריה
          </button>
        </form>
      </div>

      {/* חלק ב': יצירת תת-קטגוריה */}
      <div style={{ backgroundColor: '#f9f9f9', padding: '1.5rem', borderRadius: 8, border: '1px solid #eee' }}>
        <h3 style={{ marginTop: 0, color: '#444' }}>2. הוספת תת נושא (תת-קטגוריה)</h3>
        <form onSubmit={handleAddSubCategory} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#555' }}>תחת איזה נושא ראשי לשייך?</label>
            <select 
              value={selectedCategoryId} 
              onChange={e => setSelectedCategoryId(e.target.value)}
              style={{ width: '100%', padding: '12px', borderRadius: 6, border: '1px solid #ccc', fontSize: '15px', backgroundColor: '#fff' }}
              required
            >
              <option value="">-- בחרי קטגוריה מהרשימה --</option>
              {categories.map(cat => (
                <option key={cat._id} value={cat._id}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#555' }}>שם תת-הנושא החדש:</label>
            <div style={{ display: 'flex', gap: '10px' }}>
              <input 
                type="text" 
                placeholder="למשל: TypeScript, אנטומיה, משכנתא..." 
                value={newSubCategoryName}
                onChange={e => setNewSubCategoryName(e.target.value)}
                style={{ flex: 1, padding: '12px', borderRadius: 6, border: '1px solid #ccc', fontSize: '15px' }}
                required
              />
              <button type="submit" style={{ padding: '12px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 'bold' }}>
                הוסף תת-נושא
              </button>
            </div>
          </div>

        </form>
      </div>

    </div>
  );
}