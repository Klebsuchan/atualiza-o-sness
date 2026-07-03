import urllib.request
import re
import json

letters = list("abcdefghijklmnopqrstuvwxyz") + ["0-9"]

games = []
seen = set()

for letter in letters:
    for page in range(1, 10):
        url = f"https://ssega.com/?p={page}&az={letter}"
        try:
            req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
            html = urllib.request.urlopen(req).read().decode('utf-8')
            
            parts = html.split('class="card h-100 game-card"')
            if len(parts) <= 1:
                break # No more games on this page
                
            for part in parts[1:]:
                href_m = re.search(r'href="(/game/[^"]+)"', part)
                img_m = re.search(r'<img[^>]*src="([^"]+)"', part)
                alt_m = re.search(r'alt="([^"]+)"', part)
                
                if href_m and img_m and alt_m:
                    href = href_m.group(1)
                    img = img_m.group(1)
                    title = alt_m.group(1)
                    
                    if href in seen:
                        continue
                    seen.add(href)
                    
                    games.append({
                        "id": "ssega-" + href.split("/")[-1],
                        "title": title.strip(),
                        "category": "Sega Mega Drive",
                        "description": "Jogue " + title.strip() + " diretamente no seu navegador!",
                        "rating": 4.5,
                        "system": "Mega Drive",
                        "imageUrl": ("https://ssega.com" + img) if img.startswith("/") else img,
                        "bannerUrl": ("https://ssega.com" + img) if img.startswith("/") else img,
                        "playUrl": "https://ssega.com" + href
                    })
        except Exception as e:
            print(f"Error fetching {letter} page {page}: {e}")
            break

print(f"Found {len(games)} games")

# Now chunk it into typescript files
chunk_size = 1000
for i in range(0, len(games), chunk_size):
    chunk = games[i:i+chunk_size]
    chunk_num = i // chunk_size + 1
    with open(f"src/data/ssega_games_part{chunk_num}.ts", "w") as f:
        f.write('import { Game } from "./types";\n\n')
        f.write(f'export const ssega_games_part{chunk_num}: Game[] = [\n')
        for idx, g in enumerate(chunk):
            f.write("  {\n")
            f.write(f'    id: {json.dumps(g["id"])},\n')
            f.write(f'    title: {json.dumps(g["title"])},\n')
            f.write(f'    category: {json.dumps(g["category"])},\n')
            f.write(f'    description: {json.dumps(g["description"])},\n')
            f.write(f'    rating: {g["rating"]},\n')
            f.write(f'    system: {json.dumps(g["system"])},\n')
            f.write(f'    imageUrl: {json.dumps(g["imageUrl"])},\n')
            f.write(f'    bannerUrl: {json.dumps(g["bannerUrl"])},\n')
            f.write(f'    playUrl: {json.dumps(g["playUrl"])}\n')
            f.write("  }")
            if idx < len(chunk) - 1:
                f.write(",")
            f.write("\n")
        f.write("];\n")

