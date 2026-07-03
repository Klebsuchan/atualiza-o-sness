import urllib.request
import re
req = urllib.request.Request("https://ssega.com/?az=a", headers={'User-Agent': 'Mozilla/5.0'})
html = urllib.request.urlopen(req).read().decode('utf-8')
matches = re.findall(r'href="(/game/[^"]+)"[^>]*>.*?<img\s+src="([^"]+)"[^>]*alt="([^"]+)"', html, re.DOTALL | re.IGNORECASE)
print(len(matches))
print(matches[:2])
