import re
html = """<div class="card h-100 game-card">    <a href="/game/aaahh-real-monsters" class="text-decoration-none">      <div class="thumb-wrap position-relative">        <img src="/thumbs/aahrealmonsters.jpg" class="card-img-top" alt="AAAHH!!! Real Monsters">"""
matches = re.findall(r'href="(/game/[^"]+)"[^>]*>.*?<img\s+src="([^"]+)"[^>]*alt="([^"]+)"', html, re.DOTALL | re.IGNORECASE)
print(matches)
