interface Recipe {
  title: string;
  url: string;
  tags: string[];
  content: string;
}

declare const TAGS: string[];

async function init(): Promise<void> {
  const resp = await fetch('recipes.json');
  const recipes: Recipe[] = await resp.json();
  const searchInput = document.getElementById('search') as HTMLInputElement;
  const tagSelect = document.getElementById('tag') as HTMLSelectElement;
  const resultsList = document.getElementById('results') as HTMLUListElement;

  TAGS.forEach(t => {
    const opt = document.createElement('option');
    opt.value = t;
    opt.textContent = t;
    tagSelect.appendChild(opt);
  });

  function render(list: Recipe[]): void {
    resultsList.innerHTML = '';
    list.forEach(r => {
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.href = r.url;
      a.textContent = r.title;
      li.appendChild(a);
      resultsList.appendChild(li);
    });
  }

  function filter(): void {
    const q = searchInput.value.toLowerCase();
    const tag = tagSelect.value;
    const filtered = recipes.filter(r =>
      (!tag || r.tags.includes(tag)) &&
      (r.title.toLowerCase().includes(q) || r.content.toLowerCase().includes(q))
    );
    render(filtered);
  }

  searchInput.addEventListener('input', filter);
  tagSelect.addEventListener('change', filter);
  render(recipes);
}

init();
