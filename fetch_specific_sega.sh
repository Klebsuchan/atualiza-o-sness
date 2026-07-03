#!/bin/bash
# popular games URLs on retrogames.cc:
GAMES=(
"https://www.retrogames.cc/genesis-games/sonic-the-hedgehog-usa-europe.html"
"https://www.retrogames.cc/genesis-games/sonic-the-hedgehog-2-world-rev-a.html"
"https://www.retrogames.cc/genesis-games/sonic-the-hedgehog-3-usa.html"
"https://www.retrogames.cc/genesis-games/sonic-knuckles-world.html"
"https://www.retrogames.cc/genesis-games/ultimate-mortal-kombat-3-usa.html"
"https://www.retrogames.cc/genesis-games/mortal-kombat-ii-world.html"
"https://www.retrogames.cc/genesis-games/mortal-kombat-world-v1-1.html"
"https://www.retrogames.cc/genesis-games/streets-of-rage-world.html"
"https://www.retrogames.cc/genesis-games/streets-of-rage-2-usa.html"
"https://www.retrogames.cc/genesis-games/streets-of-rage-3-usa.html"
"https://www.retrogames.cc/genesis-games/disneys-aladdin-usa.html"
"https://www.retrogames.cc/genesis-games/lion-king-the-world.html"
"https://www.retrogames.cc/genesis-games/comix-zone-usa.html"
"https://www.retrogames.cc/genesis-games/golden-axe-world-rev-a.html"
"https://www.retrogames.cc/genesis-games/golden-axe-ii-world.html"
)

> popular_sega_games.txt

for link in "${GAMES[@]}"; do
  echo "Processing $link"
  html=$(curl -s "$link")
  embed=$(echo "$html" | grep -o 'src="//www.retrogames.cc/embed/[^"]*"' | head -1 | cut -d'"' -f2 | sed 's/^...//')
  title=$(echo "$html" | grep -o '<title>[^<]*' | head -1 | sed 's/<title>//' | sed 's/ - Play.*//' | sed 's/Play Genesis //')
  
  if [ -n "$embed" ] && [ -n "$title" ]; then
    echo "  {" >> popular_sega_games.txt
    echo "    id: \"sega-$(echo "$link" | awk -F'/' '{print $NF}' | sed 's/.html//')\"," >> popular_sega_games.txt
    echo "    title: \"$title\"," >> popular_sega_games.txt
    echo "    category: \"Sega Mega Drive\"," >> popular_sega_games.txt
    echo "    description: \"Jogue $title diretamente no seu navegador!\"," >> popular_sega_games.txt
    echo "    rating: 4.8," >> popular_sega_games.txt
    echo "    system: \"Mega Drive\"," >> popular_sega_games.txt
    echo "    imageUrl: \"https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Sega-Mega-Drive-JP-Mk1-Console-Set.png/320px-Sega-Mega-Drive-JP-Mk1-Console-Set.png\"," >> popular_sega_games.txt
    echo "    bannerUrl: \"https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Sega-Mega-Drive-JP-Mk1-Console-Set.png/320px-Sega-Mega-Drive-JP-Mk1-Console-Set.png\"," >> popular_sega_games.txt
    echo "    playUrl: \"https://$embed\"" >> popular_sega_games.txt
    echo "  }," >> popular_sega_games.txt
  fi
done
