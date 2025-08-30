import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';

interface Recipe {
  title: string;
  slug: string;
  tags: string[];
  content: string;
}

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [tagFilter, setTagFilter] = useState(searchParams.get('tag') || '');

  useEffect(() => {
    const base = import.meta.env.BASE_URL;
    fetch(`${base}recipes.json`).then(r => r.json()).then(setRecipes);
    fetch(`${base}tags.json`).then(r => r.json()).then(setTags);
  }, []);

  useEffect(() => {
    const params = new URLSearchParams();
    if (query) params.set('q', query);
    if (tagFilter) params.set('tag', tagFilter);
    setSearchParams(params);
  }, [query, tagFilter, setSearchParams]);

  const filtered = recipes.filter(r =>
    (!tagFilter || r.tags.includes(tagFilter)) &&
    (r.title.toLowerCase().includes(query.toLowerCase()) ||
      r.content.toLowerCase().includes(query.toLowerCase()))
  );

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '1.5rem' }}>Recipes</h1>
      <input
        placeholder="Search recipes..."
        value={query}
        onChange={e => setQuery(e.target.value)}
        style={{
          width: '100%',
          padding: '10px',
          fontSize: '16px',
          border: '1px solid #ddd',
          borderRadius: '4px',
          marginBottom: '1rem'
        }}
      />
      <div style={{ marginBottom: '1.5rem' }}>
        <strong>Filter by tag:</strong>
        <button
          onClick={() => setTagFilter('')}
          style={{
            marginLeft: '0.5rem',
            padding: '6px 12px',
            border: tagFilter === '' ? '2px solid #0066cc' : '1px solid #ddd',
            borderRadius: '4px',
            backgroundColor: tagFilter === '' ? '#e6f2ff' : 'white',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          All
        </button>
        {tags.map(t => (
          <button
            key={t}
            onClick={() => setTagFilter(t)}
            style={{
              marginLeft: '0.5rem',
              padding: '6px 12px',
              border: tagFilter === t ? '2px solid #0066cc' : '1px solid #ddd',
              borderRadius: '4px',
              backgroundColor: tagFilter === t ? '#e6f2ff' : 'white',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            #{t}
          </button>
        ))}
      </div>
      {tagFilter && (
        <div style={{
          padding: '10px',
          backgroundColor: '#f0f8ff',
          borderRadius: '4px',
          marginBottom: '1rem'
        }}>
          Showing recipes tagged with <strong>#{tagFilter}</strong>
        </div>
      )}
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {filtered.map(r => (
          <li key={r.slug} style={{
            padding: '12px',
            borderBottom: '1px solid #eee',
            transition: 'background-color 0.2s'
          }}>
            <Link
              to={`/recipe/${r.slug}`}
              style={{
                color: '#0066cc',
                textDecoration: 'none',
                fontSize: '18px',
                fontWeight: '500'
              }}
            >
              {r.title}
            </Link>
            {r.tags.length > 0 && (
              <div style={{ marginTop: '4px' }}>
                {r.tags.map(tag => (
                  <span
                    key={tag}
                    style={{
                      display: 'inline-block',
                      marginRight: '8px',
                      fontSize: '12px',
                      color: '#666',
                      backgroundColor: '#f0f0f0',
                      padding: '2px 8px',
                      borderRadius: '12px'
                    }}
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
