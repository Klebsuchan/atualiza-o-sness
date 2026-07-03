import urllib.request
import re
import json

base_url = "https://ssega.com/?az="
letters = list("abcdefghijklmnopqrstuvwxyz") + ["0-9"]

games = []

for letter in letters:
    url = base_url + letter
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        html = urllib.request.urlopen(req).read().decode('utf-8')
        
        # We need to find the game links and their titles/images.
        # It looks like there's a list of games on the page.
        # Let's extract blocks of games.
        # We can try a regex to find game links.
        # <a href="/game/..."> ... <img src="..."> ... <div>Title</div>
        
        # Simple regex for just the hrefs for now to see what we get
        matches = re.findall(r'<a href="(/game/[^"]+)"[^>]*>.*?<img[^>]*src="([^"]+)"[^>]*>.*?<div[^>]*class="thumb-title"[^>]*>([^<]+)</div>', html, re.DOTALL | re.IGNORECASE)
        for match in matches:
            href, img, title = match
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
        print(f"Error fetching {letter}: {e}")

print(f"Found {len(games)} games")
with open("ssega_scraped.json", "w") as f:
    json.dump(games, f, indent=2)
