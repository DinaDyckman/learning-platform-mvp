interface Props {
  name: string;
  description?: string;
  icon?: string;
  onClick?: () => void;
  selected?: boolean;
}

export default function LessonCard({ name, description, icon, onClick, selected }: Props) {
  return (
    <div onClick={onClick} style={{
      border: `2px solid ${selected ? '#6366f1' : '#e2e8f0'}`,
      borderRadius: 12, padding: '18px 20px', cursor: 'pointer', width: 180,
      background: selected ? '#eef2ff' : '#fff',
      boxShadow: selected ? '0 0 0 4px rgba(99,102,241,0.12)' : '0 1px 4px rgba(0,0,0,0.05)',
      transition: 'all 0.18s ease',
      textAlign: 'center'
    }}
      onMouseEnter={e => { if (!selected) (e.currentTarget as HTMLDivElement).style.borderColor = '#a5b4fc'; }}
      onMouseLeave={e => { if (!selected) (e.currentTarget as HTMLDivElement).style.borderColor = '#e2e8f0'; }}
    >
      <div style={{ fontSize: 36, marginBottom: 10 }}>{icon ?? '📚'}</div>
      <h3 style={{ fontSize: 14, fontWeight: 600, color: selected ? '#4f46e5' : '#0f172a', margin: 0 }}>{name}</h3>
      {description && <p style={{ fontSize: 12, color: '#94a3b8', marginTop: 6, lineHeight: 1.5 }}>{description}</p>}
    </div>
  );
}
