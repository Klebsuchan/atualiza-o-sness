#!/bin/bash
curl -s "https://www.retrogames.cc/genesis-games" | grep -o 'href="https://www.retrogames.cc/genesis-games/[^"]*"' | cut -d'"' -f2 | sort -u | head -n 30 > genesis_links.txt
for link in $(cat genesis_links.txt); do
  echo "Processing $link"
  html=$(curl -s "$link")
  embed=$(echo "$html" | grep -o 'src="//www.retrogames.cc/embed/[^"]*"' | head -1 | cut -d'"' -f2 | sed 's/^...//')
  title=$(echo "$html" | grep -o '<title>[^<]*' | head -1 | sed 's/<title>//' | sed 's/ - Play.*//')
  img=$(echo "$html" | grep -o '<img src="https://art.gametdb.com/genesis/cover/[^"]*"' | head -1 | cut -d'"' -f2)
  if [ -z "$img" ]; then
    img="https://picsum.photos/400/300"
  fi
  if [ -n "$embed" ] && [ -n "$title" ]; then
    echo "  {"
    echo "    id: \"sega-$(echo "$link" | awk -F'/' '{print $NF}' | sed 's/.html//')\","
    echo "    title: \"$title\","
    echo "    category: \"Aventura\","
    echo "    description: \"Jogue $title diretamente no seu navegador!\","
    echo "    rating: 4.5,"
    echo "    system: \"Mega Drive\","
    echo "    imageUrl: \"$img\","
    echo "    bannerUrl: \"$img\","
    echo "    playUrl: \"https://$embed\""
    echo "  },"
  fi
done > sega_games_output.txt
