# MedBox

Medicatie-tracker als React-app (PWA-achtig, geoptimaliseerd voor telefoongebruik). Bijhouden van medicatie, doseertijden, voorraad, een week- en maandoverzicht, een mantelzorgweergave en een noodkaart.

## Projectstructuur

```
medbox/
├── src/
│   ├── MedBox.jsx     ← de volledige app (alle componenten, logica, teksten)
│   └── entry.jsx      ← opstartpunt: rendert <App/> en simuleert window.storage met localStorage
├── dist/
│   ├── index.html     ← kant-en-klare, losstaande build — direct openen in de browser, geen build nodig
│   └── bundle.js       ← de "kale" gebundelde JS (wordt in index.html geplakt)
├── build-html.js       ← plakt bundle.js in de HTML-wrapper (draait automatisch bij `npm run build`)
├── package.json
└── package-lock.json
```

Dit is geen aparte `index.html` + `style.css` + `script.js`-opzet zoals bij een klassieke statische site: de app is een React-component die met esbuild tot één JS-bundel wordt samengevoegd en vervolgens in een HTML-bestand wordt geplakt (inline `<script>`, geen losse CSS-bestanden — styling gebeurt via inline style-objecten in de React-code). Dat is de gangbare opzet voor dit soort React-apps en werkt prima op GitHub: `src/MedBox.jsx` is het bestand waar je (of ik) in verder werkt.

## Zelf builden

```bash
npm install
npm run build
```

Dit genereert `dist/index.html` opnieuw vanuit `src/`. Er is al een kant-en-klare `dist/index.html` in dit archief bijgevoegd, dus builden is alleen nodig als je `src/MedBox.jsx` aanpast.

## Lokaal bekijken

Open `dist/index.html` direct in een browser, of host de map met een simpele static server, bv.:

```bash
npx serve dist
```

## Live zetten via GitHub Pages (automatisch bij elke push)

Dit project bevat al een GitHub Actions-workflow (`.github/workflows/deploy.yml`) die bij elke push naar `main` automatisch bouwt en publiceert. Eenmalig instellen, hierna hoef je nooit meer zelf te builden of uploaden:

1. Maak op [github.com](https://github.com) een nieuw, leeg repository aan (geen README/`.gitignore` aanvinken — die staan al in dit archief).
2. Upload de inhoud van dit archief naar dat repository (via "uploading an existing file" in de GitHub-interface, of met git vanaf de command line — zie hieronder).
3. Ga naar **Settings → Pages** in het repository, en zet bij **Source** de optie **GitHub Actions** aan (niet "Deploy from a branch").
4. Wacht tot het tabblad **Actions** de workflow groen laat zien (duurt ongeveer een minuut) — daarna staat de link onder **Settings → Pages** en werkt de app op `https://<jouw-gebruikersnaam>.github.io/<repository-naam>/`.

Vanaf dat moment: elke keer dat je `src/MedBox.jsx` aanpast en naar `main` pusht, bouwt en publiceert GitHub de nieuwe versie zelf, zonder dat je iets hoeft te doen.

Met git vanaf de command line (stap 2 hierboven):

```bash
cd medbox
git init
git add .
git commit -m "Eerste versie"
git branch -M main
git remote add origin https://github.com/<jouw-gebruikersnaam>/<repository-naam>.git
git push -u origin main
```

## Belangrijk om te weten

- **Opslag**: de app gebruikt een `window.storage`-shim (in `entry.jsx`) die alles opslaat in `localStorage` van de browser. Dat betekent dat data per apparaat/browser blijft — er is geen echte backend. Voor de "huishouden delen"-functie (mantelzorger) is dus wél een echte server nodig als je dat cross-device wilt laten werken; nu werkt dat alleen tussen tabbladen van dezelfde browser.
- **AI-functies** (naam herkennen via foto, bijsluiterinfo ophalen): deze roepen in de code de Claude API rechtstreeks aan vanuit de browser. Dat werkt niet zonder een eigen backend met een API-sleutel (rechtstreeks vanuit de browser bellen naar de Anthropic API wordt geblokkeerd). Dit is bewust zo gelaten in de code — als je dit wilt laten werken, heb je een klein servertje nodig dat de aanroep namens de app doet.
- **Meertaligheid**: de app is volledig vertaald naar Engels, Duits, Frans, Spaans, Turks en Arabisch (naast Nederlands als standaardtaal), met een taalkeuzeknop naast de donker/licht-knop (rechtsboven). Arabisch schakelt de layout automatisch naar rechts-naar-links. Eén uitzondering: de bijsluiterinfo die via de AI-functie wordt opgehaald, komt altijd in het Nederlands terug — dat is een bewuste keuze omdat het om medicatie-veiligheidsinformatie gaat en niet om vrij te vertalen interfacetekst.
