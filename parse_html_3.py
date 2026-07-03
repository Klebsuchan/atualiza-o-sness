import urllib.request
from bs4 import BeautifulSoup
import json

base_url = "https://ssega.com/?az="
letters = list("abcdefghijklmnopqrstuvwxyz") + ["0-9"]

games = []
seen = set()

for letter in letters:
    url = base_url + letter
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        html = urllib.request.urlopen(req).read().decode('utf-8')
        
        soup = BeautifulSoup(html, 'html.parser')
        cards = soup.find_all('div', class_='game-card')
        for card in cards:
            a = card.find('a', href=True)
            if not a: continue
            href = a['href']
            img = card.find('img')
            if not img: continue
            src = img.get('src')
            title = img.get('alt')
            
            if href in seen:
                continue
            seen.add(href)
            
            games.append({
                "id": "ssega-" + href.split("/")[-1],
                "title": title.strip() if title else href.split("/")[-1],
                "category": "Sega Mega Drive",
                "description": "Jogue " + (title.strip() if title else "") + " diretamente no seu navegador!",
                "rating": 4.5,
                "system": "Mega Drive",
                "imageUrl": ("https://ssega.com" + src) if src.startswith("/") else src,
                "bannerUrl": ("https://ssega.com" + src) if src.startswith("/") else src,
                "playUrl": "https://ssega.com" + href
            })
    except Exception as e:
        print(f"Error fetching {letter}: {e}")

print(f"Found {len(games)} games")
with open("ssega_scraped.json", "w") as f:
    json.dump(games, f, indent=2)
