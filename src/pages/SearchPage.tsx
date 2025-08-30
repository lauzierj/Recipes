import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

interface Recipe {
  title: string;
  slug: string;
  tags: string[];
  content: string;
}

export default function SearchPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [query, setQuery] = useState('');
  const [tagFilter, setTagFilter] = useState('');

  useEffect(() => {
    fetch('/recipes.json').then(r => r.json()).then(setRecipes);
    fetch('/tags.json').then(r => r.json()).then(setTags);
  }, []);

  const filtered = recipes.filter(r =>
    (!tagFilter || r.tags.includes(tagFilter)) &&
    (r.title.toLowerCase().includes(query.toLowerCase()) ||
      r.content.toLowerCase().includes(query.toLowerCase()))
  );

  return (
    <div>
      <h1>Recipes</h1>
      <input
        placeholder="Search"
        value={query}
        onChange={e => setQuery(e.target.value)}
      />
      <div>
        <strong>Tags:</strong>
        <button onClick={() => setTagFilter('')} style={{ marginLeft: '0.5rem' }}>
          All
        </button>
        {tags.map(t => (
          <button
            key={t}
            onClick={() => setTagFilter(t)}
            style={{ marginLeft: '0.5rem' }}
          >
            {t}
          </button>
        ))}
      </div>
      <ul>
        {filtered.map(r => (
          <li key={r.slug}>
            <Link to={`/recipe/${r.slug}`}>{r.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
