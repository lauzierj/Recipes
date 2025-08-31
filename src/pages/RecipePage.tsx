import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface Recipe {
  title: string;
  slug: string;
  tags: string[];
  content: string;
  packageFolder?: string;
}

export default function RecipePage() {
  const { slug } = useParams();
  const [recipe, setRecipe] = useState<Recipe | null>(null);

  useEffect(() => {
    const base = import.meta.env.BASE_URL;
    fetch(`${base}recipes.json`)
      .then(r => r.json())
      .then((list: Recipe[]) => {
        setRecipe(list.find(r => r.slug === slug) || null);
      });
  }, [slug]);

  if (!recipe) {
    return <div>Loading...</div>;
  }

  // Process image URLs in content for recipepackage images
  const processedContent = recipe.content.replace(
    /!\[([^\]]*)\]\(([-\w]+\.(webp|jpeg|jpg|png|gif))\)/gi,
    (match, alt, filename) => {
      // Use the actual package folder name if available, otherwise fall back to slug
      const folderName = recipe.packageFolder || `${slug}.recipepackage`;
      const packageBase = `${import.meta.env.BASE_URL}recipes/${folderName}/Photos/`;
      return `![${alt}](${packageBase}${filename})`;
    }
  );

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => (
            <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{children}</h1>
          ),
          blockquote: ({ children }) => (
            <blockquote style={{
              borderLeft: '4px solid #ccc',
              paddingLeft: '1rem',
              marginLeft: 0,
              fontStyle: 'italic',
              color: '#666'
            }}>
              {children}
            </blockquote>
          ),
          img: ({ src, alt }) => (
            <img
              src={src}
              alt={alt}
              style={{
                maxWidth: '100%',
                height: 'auto',
                borderRadius: '8px',
                margin: '1rem 0'
              }}
            />
          ),
          a: ({ href, children }) => {
            // Check if this is a hashtag link
            if (href?.startsWith('#') && typeof children === 'string' && children.startsWith('#')) {
              const tag = children.substring(1);
              return (
                <Link
                  to={`/?tag=${encodeURIComponent(tag)}`}
                  style={{ color: '#0066cc', textDecoration: 'none' }}
                >
                  {children}
                </Link>
              );
            }
            return <a href={href} style={{ color: '#0066cc' }}>{children}</a>;
          },
          ul: ({ children }) => (
            <ul style={{ marginLeft: '1.5rem', marginBottom: '1rem' }}>{children}</ul>
          ),
          li: ({ children }) => (
            <li style={{ marginBottom: '0.5rem' }}>{children}</li>
          ),
          p: ({ children }) => (
            <p style={{ lineHeight: '1.6', marginBottom: '1rem' }}>{children}</p>
          )
        }}
      >
        {processedContent}
      </ReactMarkdown>
      <p style={{ marginTop: '2rem', paddingTop: '1rem', borderTop: '1px solid #eee' }}>
        <Link to="/" style={{ color: '#0066cc', textDecoration: 'none' }}>← Back to search</Link>
      </p>
    </div>
  );
}
