// app/posts/page.tsx
'use client';
import React from 'react';

type Post = { id: number; title: string; content?: string; createdAt?: string };

export default function PostsPage() {
  const [posts, setPosts] = React.useState<Post[]>([]);
  const [title, setTitle] = React.useState('');
  const [content, setContent] = React.useState('');
  const [busy, setBusy] = React.useState(false);

  async function load() {
    const res = await fetch('/api/posts', { cache: 'no-store' });
    const data = await res.json();
    setPosts(data.posts ?? []);
  }
  React.useEffect(() => { load().catch(() => {}); }, []);

  async function createPost() {
    if (!title) return;
    setBusy(true);
    try {
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content }),
      });
      if (!res.ok) throw new Error('Create failed');
      setTitle(''); setContent(''); await load();
    } finally { setBusy(false); }
  }

  async function remove(id: number) {
    setBusy(true);
    try { await fetch('/api/posts/' + id, { method: 'DELETE' }); await load(); }
    finally { setBusy(false); }
  }

  return (
    <main style={{ maxWidth: 900, margin: '0 auto', padding: '1rem' }}>
      <h1>Posts CRUD</h1>
      <div style={{ display: 'grid', gap: 8, maxWidth: 500 }}>
        <input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
        <textarea placeholder="Content" value={content} onChange={(e) => setContent(e.target.value)} />
        <button onClick={createPost} disabled={busy || !title}>{busy ? 'Saving…' : 'Create'}</button>
      </div>
      <ul style={{ marginTop: 16, padding: 0, listStyle: 'none' }}>
        {posts.map((p) => (
          <li key={p.id} style={{ border: '1px solid #ddd', borderRadius: 6, padding: 12, marginTop: 8 }}>
            <div><strong>{p.title}</strong></div>
            {p.content && <div style={{ whiteSpace: 'pre-wrap' }}>{p.content}</div>}
            <button onClick={() => remove(p.id)} style={{ marginTop: 8 }}>Delete</button>
          </li>
        ))}
      </ul>
    </main>
  );
}
