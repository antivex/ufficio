const ROSTER = [
  { id: "olivetti", nome: "Olivetti", ruolo: "Direzione", ex: "Claude", posto: [-7.6, -4.2], capelli: "#3b2b24", pelle: "#f0c8a6", stile: 0, fa: "decide le priorità della squadra di Claude" },
  { id: "marco-polo", nome: "Marco Polo", ruolo: "Ricerca", ex: "Claude", posto: [-4.4, -4.2], capelli: "#c49a45", pelle: "#e9b892", stile: 1, fa: "cerca segnali e richieste di clienti su Reddit e Hacker News" },
  { id: "mercurio", nome: "Mercurio", ruolo: "Clienti", ex: "Claude", posto: [-7.6, -1.2], capelli: "#5a3e2b", pelle: "#d9a37e", stile: 2, fa: "prepara le risposte alle richieste di servizio EPUB" },
  { id: "sede", nome: "Sede", ruolo: "Lavori del PC", ex: "Claude", posto: [-4.4, -1.2], capelli: "#6d6f7d", pelle: "#e3c9b0", stile: 0, fa: "applica le decisioni del titolare, passa i lavori tra Claude e Codex e aggiorna la sede" },
  { id: "leonardo", nome: "Leonardo", ruolo: "Officina", ex: "Claude", posto: [-7.6, 1.8], capelli: "#2b2b2b", pelle: "#f2cfb1", stile: 1, fa: "costruisce e rivede il codice" },
  { id: "galileo", nome: "Galileo", ruolo: "Controllo", ex: "Claude", posto: [-4.4, 1.8], capelli: "#9a9a9a", pelle: "#e3b48d", stile: 2, fa: "controlla le bozze prima che il titolare le pubblichi" },
  { id: "atlas", nome: "Atlas", ruolo: "Direzione", ex: "Codex", posto: [7.6, -4.2], capelli: "#1f2a33", pelle: "#c98e65", stile: 0, fa: "coordina la squadra di Codex con quella di Claude" },
  { id: "scout", nome: "Scout", ruolo: "Ricerca", ex: "Codex", posto: [4.4, -4.2], capelli: "#7a4a2a", pelle: "#f0c8a6", stile: 1, fa: "cerca gare, taglie e comunità dove c'è domanda pagata" },
  { id: "pulse", nome: "Pulse", ruolo: "Risposte", ex: "Codex", posto: [7.6, -1.2], capelli: "#d6b96a", pelle: "#e9b892", stile: 2, fa: "segue le risposte a candidature e post" },
  { id: "iris", nome: "Iris", ruolo: "Qualifica", ex: "Codex", posto: [4.4, -1.2], capelli: "#4a2f2a", pelle: "#f2cfb1", stile: 2, fa: "valuta se un'opportunità vale il lavoro" },
  { id: "forge", nome: "Forge", ruolo: "Sviluppo", ex: "Codex", posto: [7.6, 1.8], capelli: "#3b2f4a", pelle: "#b97e58", stile: 0, fa: "costruisce Quest Relay, il gioco per la gara TwitchCon" },
  { id: "ledger", nome: "Ledger", ruolo: "Cassa", ex: "Codex", posto: [4.4, 1.8], capelli: "#6b6b52", pelle: "#f2cfb1", stile: 1, fa: "tiene i conti, per ora a zero" },
  { id: "prisma", nome: "Prisma", ruolo: "Regia", ex: "Codex", posto: [7.6, 4.6], capelli: "#2a3550", pelle: "#e3b48d", stile: 1, fa: "cura la regia, il palazzo dove si vede tutto il lavoro" },
];
const LIBERI = [[-7.6, 4.6, "Claude"], [4.4, 4.6, "Codex"]];
const ISSUE = [
  ["Gare", "Studiare gare e hackathon con un premio"], ["EPUB", "Il servizio per sistemare gli ebook"],
  ["Codice", "Strumenti e il gioco per TwitchCon"], ["Community", "Leggere Reddit, forum e social"],
  ["Video", "La serie su TikTok"], ["Regia", "Il palazzo dove si vede tutto"], ["Ricerca", "Cercare clienti e richieste"],
  ["Conti", "Spese e incassi"], ["Posta", "Notifiche e risposte"], ["Idee", "Nuovi prodotti da provare"],
];
