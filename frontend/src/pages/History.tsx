import { useState, useEffect } from 'react';
import { getUserHistory } from '../services/api';

interface PromptRecord {
  _id: string;
  prompt: string;
  response: string;
  tokens: number;
  isFavorite: boolean;
  createdAt: string;
}

const USER_ID = '665f000000000000000000001'; // placeholder until auth is added

export default function History() {
  const [history, setHistory] = useState<PromptRecord[]>([]);

  useEffect(() => {
    getUserHistory(USER_ID).then(setHistory);
  }, []);

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Prompt History</h2>
      {history.length === 0 && <p>No history yet.</p>}
      {history.map(item => (
        <div key={item._id} style={{ border: '1px solid #ddd', borderRadius: 8, padding: '1rem', marginBottom: '1rem' }}>
          <p><strong>Prompt:</strong> {item.prompt}</p>
          <p><strong>Response:</strong> {item.response}</p>
          <small>Tokens: {item.tokens} | {new Date(item.createdAt).toLocaleString()} {item.isFavorite ? '⭐' : ''}</small>
        </div>
      ))}
    </div>
  );
}
