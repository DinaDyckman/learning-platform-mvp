import { useState, useEffect } from 'react';
import axios from 'axios';
import LessonCard from '../components/LessonCard';
import { sendPrompt } from '../services/api';

interface Category { _id: string; name: string; description?: string; icon?: string; }
interface SubCategory { _id: string; name: string; }

const USER_ID = '665f000000000000000000001'; // placeholder until auth is added

export default function Dashboard() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [selectedCat, setSelectedCat] = useState('');
  const [selectedSub, setSelectedSub] = useState('');
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    axios.get('http://localhost:5000/api/categories').then(r => setCategories(r.data));
  }, []);

  const selectCategory = async (id: string) => {
    setSelectedCat(id);
    setSelectedSub('');
    const r = await axios.get(`http://localhost:5000/api/categories/sub/${id}`);
    setSubCategories(r.data);
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCat || !selectedSub) return;
    setLoading(true);
    try {
      const data = await sendPrompt({ user_id: USER_ID, category_id: selectedCat, sub_category_id: selectedSub, prompt });
      setResponse(data.response);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Dashboard</h2>
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
        {categories.map(c => (
          <LessonCard key={c._id} name={c.name} description={c.description} icon={c.icon}
            onClick={() => selectCategory(c._id)} />
        ))}
      </div>

      {subCategories.length > 0 && (
        <select value={selectedSub} onChange={e => setSelectedSub(e.target.value)} style={{ marginBottom: '1rem' }}>
          <option value="">-- Select sub-category --</option>
          {subCategories.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
        </select>
      )}

      <form onSubmit={handleSend} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxWidth: 600 }}>
        <textarea rows={4} placeholder="Enter your prompt..." value={prompt}
          onChange={e => setPrompt(e.target.value)} required />
        <button type="submit" disabled={loading}>{loading ? 'Sending...' : 'Send'}</button>
      </form>

      {response && (
        <div style={{ marginTop: '1.5rem', padding: '1rem', background: '#f4f4f4', borderRadius: 8 }}>
          <strong>AI Response:</strong>
          <p>{response}</p>
        </div>
      )}
    </div>
  );
}
