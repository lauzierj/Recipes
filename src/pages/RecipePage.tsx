import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

interface Recipe {
  title: string;
  slug: string;
  tags: string[];
  content: string;
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

  return (
    <div>
      <h1>{recipe.title}</h1>
      <pre style={{ whiteSpace: 'pre-wrap' }}>{recipe.content}</pre>
      <p>
        <Link to="/">Back to search</Link>
      </p>
    </div>
  );
}
