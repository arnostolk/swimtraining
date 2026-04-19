# Backlog

Plek voor ideeen voor doorontwikkeling van SwimTraining.

Werkafspraak:

- Nieuwe ideeen komen eerst hier.
- Definitieve keuzes gaan daarna pas naar `APP_INSTRUCTIES.md` of `INSTRUCTIES.md`.
- Houd items kort, concreet en vergelijkbaar.

## Gebruik

Gebruik per idee dit format:

### Titel

- Probleem:
- Idee:
- Waarde:
- Type:
- Impact:
- Inspanning:
- Prioriteit:
- Status:
- Open vraag:

Toelichting op velden:

- `Type`: `UX`, `content`, `data`, `navigatie`, `mobiel`, `performance`, `beheer`
- `Impact`: bijvoorbeeld `laag`, `middel`, `hoog`
- `Inspanning`: bijvoorbeeld `laag`, `middel`, `hoog`
- `Prioriteit`: gebruik `P1`, `P2`, `P3` of `P4`
- `Status`: bijvoorbeeld `nieuw`, `te verfijnen`, `gepland`, `in uitvoering`, `gereed`, `niet doen`

## Prioriteitssysteem

Gebruik deze vaste betekenis:

- `P1`: hoge waarde, lage of middelgrote inspanning, snel oppakken
- `P2`: duidelijke waarde, maar minder urgent of meer werk
- `P3`: nuttig idee, maar geen directe noodzaak
- `P4`: alleen doen als er later ruimte of extra aanleiding is

Snelle beslisregel:

- Kies `P1` als het probleem vaak voorkomt en direct merkbare winst geeft.
- Kies `P2` als het goed is om te doen, maar niet direct blokkeert.
- Kies `P3` als het vooral optimalisatie of comfort is.
- Kies `P4` als het idee nog speculatief is of weinig waarde heeft.

Aanbevolen combinatie:

- `hoge waarde` + `lage inspanning` = meestal `P1`
- `hoge waarde` + `hoge inspanning` = meestal `P2`
- `middel waarde` + `middel of hoge inspanning` = meestal `P2` of `P3`
- `lage waarde` = meestal `P3` of `P4`

## Inbox

Nieuwe ingevingen die nog niet zijn uitgewerkt.

## Nu

Ideeen met duidelijke waarde die binnenkort opgepakt kunnen worden.

### Trainingen tunen

- Probleem: De inhoud en kwaliteit van trainingen kan waarschijnlijk nog scherper en consistenter.
- Idee: Verbeter de trainingsopbouw, inhoud en formulering op basis van praktijkgebruik.
- Waarde: Betere trainingen en meer vertrouwen in de gegenereerde content.
- Type: `content`
- Impact: `hoog`
- Inspanning: `middel`
- Prioriteit: `P1`
- Status: `te verfijnen`
- Open vraag: Gaat dit eerst over inhoudelijke kwaliteit, schrijfvorm of periodisering?

## Later

Goede ideeen zonder directe noodzaak.

### Applicatie-architectuur verbeteren

- Probleem: De huidige app-structuur kan op termijn lastig worden voor uitbreiding en onderhoud.
- Idee: Herzie de applicatie-architectuur voor duidelijkere scheiding van verantwoordelijkheden.
- Waarde: Betere onderhoudbaarheid en minder frictie bij doorontwikkeling.
- Type: `beheer`
- Impact: `hoog`
- Inspanning: `hoog`
- Prioriteit: `P3`
- Status: `te verfijnen`
- Open vraag: Zit het grootste probleem in contentlogica, routing, componentstructuur of dataflow?

### URL-structuur en UX tunen

- Probleem: De route-opbouw en gebruikersflow kunnen waarschijnlijk logischer en strakker.
- Idee: Herzie URL-structuur en UX-flow voor duidelijkere navigatie.
- Waarde: Sneller vinden, openen en delen van relevante pagina's.
- Type: `navigatie`
- Impact: `hoog`
- Inspanning: `middel`
- Prioriteit: `P1`
- Status: `te verfijnen`
- Open vraag: Ligt de nadruk hier op trainerflow, SEO-logica of technische consistentie?

### Minioren en junioren toevoegen

- Probleem: De content en app lijken nu nog niet duidelijk ingericht op meerdere doelgroepen.
- Idee: Voeg ondersteuning toe voor minioren en junioren als aparte doelgroep of trainingslijn.
- Waarde: Breder bruikbaar systeem met duidelijkere doelgroepsturing.
- Type: `data`
- Impact: `hoog`
- Inspanning: `hoog`
- Prioriteit: `P2`
- Status: `te verfijnen`
- Open vraag: Wordt dit een aparte contentstructuur, label of volledige seizoenssplitsing?

### Trainingen schalen

- Probleem: Trainingen zijn mogelijk nog niet flexibel schaalbaar naar niveau, groep of belasting.
- Idee: Maak trainingen schaalbaar in afstand, complexiteit of intensiteit.
- Waarde: 1 basistraining wordt bruikbaar voor meerdere groepen en niveaus.
- Type: `content`
- Impact: `hoog`
- Inspanning: `hoog`
- Prioriteit: `P2`
- Status: `te verfijnen`
- Open vraag: Wil je vooral schalen op meters, moeilijkheid, leeftijd of trainingsdoel?

## Ooit Misschien

Interessant, maar nu nog te vaag of te ver weg.

### Feedback over training mogelijk maken

- Probleem: Er is nu geen vaste plek om feedback op een training terug te geven.
- Idee: Voeg een manier toe om per training feedback vast te leggen.
- Waarde: Praktijkfeedback kan direct leiden tot betere trainingen.
- Type: `beheer`
- Impact: `hoog`
- Inspanning: `middel`
- Prioriteit: `P1`
- Status: `te verfijnen`
- Open vraag: Moet feedback in de app blijven of buiten de app worden opgeslagen?

## Gereed

Afgeronde items uit de backlog.

### Favicon op basis van logo

- Probleem: De site gebruikt nog geen duidelijke merkbare browser-icoonweergave.
- Idee: Maak een standaard favicon voor browser-tabs op basis van het bestaande SwimTraining-logo.
- Waarde: Herkenbaarheid in tabbladen, favorieten en homescreen-links.
- Type: `UX`
- Impact: `laag`
- Inspanning: `laag`
- Prioriteit: `P4`
- Status: `gereed`
- Open vraag: Geen.

### Deelweergave van de site aanpassen

- Probleem: Bij delen van de site is de titel, beschrijving of preview mogelijk nog niet scherp genoeg.
- Idee: Pas de metadata voor delen aan voor alle viewer-pagina's. Home gebruikt titel `Oceanus Aalsmeer Trainingen` en beschrijving `Training viewer`. Trainingsdetail gebruikt als titel-template `Training {datum} • {thema} • {slagfocus}` en als beschrijving-template `Bekijk de training van {datum} met focus op {thema} en {slagfocus}.` Andere viewer-pagina's krijgen ook een expliciete titel en beschrijving die passen bij hun route en functie.
- Waarde: Professionelere presentatie en duidelijkere context bij delen.
- Type: `UX`
- Impact: `middel`
- Inspanning: `laag`
- Prioriteit: `P3`
- Status: `gereed`
- Open vraag: Geen.

## Beslist Niet

Bewuste afwijzingen. Handig om later dezelfde discussie niet opnieuw te voeren.

## Voorbeeld

### Snellere toegang tot vandaag

- Probleem: De trainer wil met 1 tik direct naar de training van vandaag.
- Idee: Voeg een vaste actieknop toe bovenaan de homepagina.
- Waarde: Minder zoeken aan de badrand.
- Type: `UX`
- Impact: `middel`
- Inspanning: `laag`
- Prioriteit: `P1`
- Status: `nieuw`
- Open vraag: Is dit beter dan de huidige slimme kaart?