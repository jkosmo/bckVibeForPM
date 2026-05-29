# Risiko- og avhengighetsradar

En enkel lokal webprototype for prosjektledere som vil se risikoer,
avhengigheter og kritiske sammenhenger i samme bilde.

## Første slice

Denne versjonen dekker en liten vertikal slice fra briefen:

- React + TypeScript + Vite
- seed-data for risikoer og avhengigheter
- lokal lagring i `localStorage`
- risikooversikt
- oppretting, redigering og sletting av risikoer
- 5x5 risikomatrise
- avhengighetsliste med koblede risikoer
- oppretting, redigering og sletting av avhengigheter
- redigering av koblinger mellom risikoer og avhengigheter
- filtre for ansvarlig, status, risikonivå og avhengighetstype
- nullstilling av demo-data

## Kjør lokalt

```bash
npm install
npm run dev
```

Åpne URL-en Vite viser i terminalen.

## Avgrensninger

Dette er ikke en komplett løsning. Prototypen har ikke backend, innlogging,
import/eksport, historikk, sanntidssamarbeid eller produksjonsklar sikkerhet.
Data lagres kun lokalt i nettleseren.

## Demo-QA

Verifisert lokalt:

- `npm install`
- `npm run build`
- Vite dev-server i nettleser
- endringer bevares etter refresh via `localStorage`
- nullstilling av demo-data

Seed-data inneholder ikke persondata eller hemmeligheter.
