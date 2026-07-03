// Games data (from NewSignupModal)
export const games = [
  { id: "apex", name: "Apex Legends", image: "/games/apex.png" },
  {
    id: "cod-bo7",
    name: "Call of Duty: Black Ops 7",
    image: "/games/codm.png",
  },
  {
    id: "cod-warzone",
    name: "Call of Duty: Warzone",
    image: "/games/codm.png",
  },
  { id: "chess", name: "Chess", image: "/games/chess.png" },
  { id: "cs2", name: "Counter-Strike 2", image: "/games/csgo.png" },
  { id: "crossfire", name: "Crossfire", image: "/games/cf.jpeg" },
  { id: "dota2", name: "Dota 2", image: "/games/dota2.png" },
  { id: "fc26-pc", name: "FC26 - PC", image: "/games/fifapc.png" },
  {
    id: "fc26-consoles",
    name: "FC26 - Consoles",
    image: "/games/fcconsole.png",
  },
  { id: "fc26-mobile", name: "FC26 - Mobile", image: "/games/fcmobile.png" },
  {
    id: "efootball-pc",
    name: "eFootball - PC",
    image: "/games/efootballpc.png",
  },
  {
    id: "efootball-consoles",
    name: "eFootball - Consoles",
    image: "/games/efootballconsole.png",
  },
  {
    id: "efootball-mobile",
    name: "eFootball - Mobile",
    image: "/games/efootballmobile.png",
  },
  {
    id: "fatal-fury",
    name: "Fatal Fury: City of the Wolves",
    image: "/games/ff.jpeg",
  },
  { id: "freefire", name: "Free Fire", image: "/games/freefire.png" },
  { id: "hok", name: "Honor of Kings", image: "/games/hk.jpeg" },
  { id: "lol", name: "League of Legends", image: "/games/lol.png" },
  { id: "mlbb", name: "Mobile Legends: Bang Bang", image: "/games/mlbb.png" },
  { id: "overwatch2", name: "Overwatch 2", image: "/games/overwatch.png" },
  { id: "pubg", name: "PUBG / PUBG: Battlegrounds", image: "/games/pubg.png" },
  { id: "pubg-mobile", name: "PUBG Mobile", image: "/games/pubg.png" },
  { id: "r6x", name: "Rainbow Six Siege X", image: "/games/r6.jpeg" },
  { id: "sf6", name: "Street Fighter 6", image: "/games/sf6.png" },
  { id: "tft", name: "Teamfight Tactics", image: "/games/tt.jpeg" },
  { id: "valorant", name: "VALORANT", image: "/games/valorant.png" },
  {
    id: "valorant-mobile",
    name: "VALORANT Mobile",
    image: "/games/valorant.png",
  },
  { id: "coc", name: "Clash of Clans", image: "/games/coc.png" },
  { id: "tekken8", name: "Tekken 8", image: "/games/tekken.jpeg" },
  { id: "mk11", name: "Mortal Kombat 11", image: "/games/mk11.png" },
  { id: "brawlstars", name: "Brawl Stars", image: "/games/brawlstars.png" },
];

// Helper to get game image from title or game name
export const getGameImage = (eventTitle, gameName) => {
  const searchTerm = (gameName || eventTitle || "").toLowerCase();
  const matchedGame = games.find(
    (g) =>
      searchTerm.includes(g.name.toLowerCase()) ||
      g.name.toLowerCase().includes(searchTerm.split(" ")[0]),
  );
  return matchedGame?.image || "/games/pubg.png";
};
