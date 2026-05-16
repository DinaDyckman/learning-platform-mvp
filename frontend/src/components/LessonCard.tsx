interface Props {
  name: string;
  description?: string;
  icon?: string;
  onClick?: () => void;
}

export default function LessonCard({ name, description, icon, onClick }: Props) {
  return (
    <div onClick={onClick} style={{ border: '1px solid #ccc', borderRadius: 8, padding: '1rem', cursor: 'pointer', width: 200 }}>
      <div style={{ fontSize: 32 }}>{icon ?? '📚'}</div>
      <h3>{name}</h3>
      {description && <p style={{ fontSize: 14, color: '#666' }}>{description}</p>}
    </div>
  );
}
