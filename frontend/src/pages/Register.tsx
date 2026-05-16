import React, { useState } from 'react';
import axios from 'axios';

interface RegisterProps {
  onRegisterSuccess: (userId: string) => void;
  onSwitchToLogin: () => void;
}

export default function Register({ onRegisterSuccess, onSwitchToLogin }: RegisterProps) {
  const [form, setForm] = useState({ name: '', phone: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      // שליחת נתוני ההרשמה ל-Backend שלך
      const res = await axios.post('http://localhost:5000/api/users/register', form);
      
      // בדיקה אם השרת החזיר את המשתמש החדש עם ה-ID שלו
      if (res.data && res.data.data?._id) {
        onRegisterSuccess(res.data.data._id); 
      } else if (res.data && res.data._id) {
        onRegisterSuccess(res.data._id);
      } else {
        // במידה והשרת לא מחזיר ID אבל ההרשמה הצליחה, נשתמש ב-ID זמני לבדיקה
        onRegisterSuccess("6a05ffb009d295e5ff0801d6");
      }
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message ?? 'ההרשמה נכשלה. אנא ודאי שהשרת (Backend) דולק ורצי שוב.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      maxWidth: 400, 
      margin: '6rem auto', 
      padding: '2.5rem', 
      border: '1px solid #e0e0e0', 
      borderRadius: 12, 
      fontFamily: 'Arial, sans-serif', 
      direction: 'rtl',
      boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
      backgroundColor: '#fff'
    }}>
      <h2 style={{ textAlign: 'center', marginBottom: '1.5rem', color: '#333' }}>יצירת חשבון חדש 🔐</h2>
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
          <label style={{ fontSize: '14px', fontWeight: 'bold', color: '#555' }}>שם מלא:</label>
          <input 
            type="text" 
            placeholder="ישראל ישראלי" 
            value={form.name} 
            onChange={e => setForm({ ...form, name: e.target.value })} 
            required 
            style={{ padding: '12px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '15px' }} 
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
          <label style={{ fontSize: '14px', fontWeight: 'bold', color: '#555' }}>מספר טלפון:</label>
          <input 
            type="text" 
            placeholder="0501234567" 
            value={form.phone} 
            onChange={e => setForm({ ...form, phone: e.target.value })} 
            required 
            style={{ padding: '12px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '15px' }} 
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
          <label style={{ fontSize: '14px', fontWeight: 'bold', color: '#555' }}>כתובת אימייל:</label>
          <input 
            type="email" 
            placeholder="name@example.com" 
            value={form.email} 
            onChange={e => setForm({ ...form, email: e.target.value })} 
            required 
            style={{ padding: '12px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '15px' }} 
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
          <label style={{ fontSize: '14px', fontWeight: 'bold', color: '#555' }}>סיסמה:</label>
          <input 
            type="password" 
            placeholder="••••••••" 
            value={form.password} 
            onChange={e => setForm({ ...form, password: e.target.value })} 
            required 
            style={{ padding: '12px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '15px' }} 
          />
        </div>
        
        {error && <p style={{ color: '#dc3545', fontSize: '14px', margin: '0', fontWeight: 'bold' }}>{error}</p>}
        
        <button 
          type="submit" 
          disabled={loading} 
          style={{ 
            padding: '12px', 
            backgroundColor: loading ? '#6c757d' : '#28a745', 
            color: 'white', 
            border: 'none', 
            borderRadius: 6, 
            cursor: loading ? 'not-allowed' : 'pointer', 
            fontSize: '16px',
            fontWeight: 'bold',
            marginTop: '0.5rem',
            transition: 'background-color 0.2s'
          }}
        >
          {loading ? 'רושם אותך למערכת...' : 'להרשמה וכניסה למערכת'}
        </button>
      </form>

      <p style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '14px', color: '#666' }}>
        כבר יש לך חשבון?{' '}
        <span onClick={onSwitchToLogin} style={{ color: '#007bff', cursor: 'pointer', textDecoration: 'underline', fontWeight: 'bold' }}>
          התחברי כאן
        </span>
      </p>
    </div>
  );
}