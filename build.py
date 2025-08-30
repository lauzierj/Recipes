import os
import re
import json
import shutil
import subprocess
from pathlib import Path


RECIPES_DIR = Path('recipes')
OUTPUT_DIR = Path('site')

RECIPE_TEMPLATE = """<!doctype html>
<html>
<head>
  <meta charset='utf-8'>
  <title>{title}</title>
  <link rel='stylesheet' href='../styles.css'>
</head>
<body>
  <a href='../index.html'>Home</a>
  <h1>{title}</h1>
  {body}
  <p><a href='{download}' download>Download recipe</a></p>
</body>
</html>
"""

INDEX_TEMPLATE = """<!doctype html>
<html>
<head>
  <meta charset='utf-8'>
  <title>Recipes</title>
  <link rel='stylesheet' href='styles.css'>
</head>
<body>
  <h1>Recipes</h1>
  <input id='search' placeholder='Search recipes'>
  <select id='tag'><option value=''>All Tags</option></select>
  <ul id='results'></ul>
  <script>const TAGS = {tags};</script>
  <script src='search.js'></script>
</body>
</html>
"""


def slugify(name: str) -> str:
    name = name.lower().strip()
    name = re.sub(r'[^a-z0-9\s-]', '', name)
    name = re.sub(r'[\s]+', '-', name)
    return name


def markdown_to_html(text: str) -> str:
    lines = text.splitlines()
    html_lines = []
    in_list = False
    for line in lines:
        if line.startswith('- '):
            if not in_list:
                html_lines.append('<ul>')
                in_list = True
            html_lines.append(f"<li>{line[2:].strip()}</li>")
        else:
            if in_list:
                html_lines.append('</ul>')
                in_list = False
            if line.startswith('>'):
                html_lines.append(f"<blockquote>{line[1:].strip()}</blockquote>")
            elif line.startswith('![](') and line.endswith(')'):
                src = line[4:-1]
                html_lines.append(f"<img src='{src}' alt='' />")
            elif line.startswith('# '):
                html_lines.append(f"<h1>{line[2:].strip()}</h1>")
            elif line.strip() == '':
                continue
            else:
                html_lines.append(f"<p>{line}</p>")
    if in_list:
        html_lines.append('</ul>')
    return "\n".join(html_lines)


def parse_recipe(path: Path, package: bool):
    text = path.read_text(encoding='utf-8')
    title_match = re.search(r'^#\s+(.+)', text, re.MULTILINE)
    title = title_match.group(1).strip() if title_match else path.stem
    desc_match = re.search(r'^>\s+(.+)', text, re.MULTILINE)
    tags = re.findall(r'#(\w+)', desc_match.group(1)) if desc_match else []
    if package:
        text = re.sub(r'!\[]\(([^)]+\.webp)\)', r'![](Photos/\1)', text)
    html_body = markdown_to_html(text)
    plain = re.sub(r'<[^>]+>', '', html_body)
    return title, tags, html_body, plain


def build():
    subprocess.run(["npm", "run", "build"], check=True)
    if OUTPUT_DIR.exists():
        shutil.rmtree(OUTPUT_DIR)
    OUTPUT_DIR.mkdir()

    recipes_meta = []
    for item in RECIPES_DIR.iterdir():
        if item.suffix == '.recipe':
            recipe_path = item
            package = False
        elif item.suffix == '.recipepackage':
            recipe_path = item / f'{item.stem}.recipe'
            package = True
        else:
            continue

        slug = slugify(item.stem)
        out_dir = OUTPUT_DIR / slug
        out_dir.mkdir(parents=True, exist_ok=True)

        title, tags, html_body, plain_text = parse_recipe(recipe_path, package)

        shutil.copy2(recipe_path, out_dir / f'{slug}.recipe')
        if package:
            photos_src = item / 'Photos'
            if photos_src.exists():
                shutil.copytree(photos_src, out_dir / 'Photos')

        html = RECIPE_TEMPLATE.format(title=title, body=html_body, download=f'{slug}.recipe')
        (out_dir / 'index.html').write_text(html, encoding='utf-8')

        recipes_meta.append({
            'title': title,
            'url': f'{slug}/',
            'tags': tags,
            'content': plain_text
        })

    tags_set = sorted({t for r in recipes_meta for t in r['tags']})
    index_html = INDEX_TEMPLATE.format(tags=json.dumps(tags_set))
    (OUTPUT_DIR / 'index.html').write_text(index_html, encoding='utf-8')
    (OUTPUT_DIR / 'recipes.json').write_text(json.dumps(recipes_meta), encoding='utf-8')

    static_dir = Path('static')
    for file in ['styles.css', 'search.js']:
        shutil.copy2(static_dir / file, OUTPUT_DIR / file)


if __name__ == '__main__':
    build()
