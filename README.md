
# Währungsrechner-Projekt

Dieses Repository enthält ein monorepo für ein Währungsrechner-Projekt, das aus zwei Hauptanwendungen besteht: einem Frontend, entwickelt mit Angular, und einem Backend, entwickelt mit NestJS. Es nutzt `freecurrencyapi` zur Abfrage aktueller Wechselkurse.


## Struktur des Projekts

- **apps/**
  - **frontend/**: Angular-Anwendung für das User Interface.
  - **server/**: NestJS-Anwendung als API-Server.
  - **shared/**: Ordner für gemeinsame Typ-Definitionen, die von beiden Projekten genutzt werden.

## Voraussetzungen

Um das Projekt lokal auszuführen, benötigen Sie:

- Node.js (Version xx oder höher)
- NX CLI (installiert über npm oder yarn)
- Angular CLI
- Jest (für das Ausführen von Tests)

## Installation

1. Klonen Sie das Repository:
   ```bash
   git clone https://github.com/ChristinaBusacker/NxCurrency.git
    ```
2. Installieren Sie die Abhängigkeiten in beiden Projekten:
   ```bash
   npm install
   ```

## Konfiguration

Fügen Sie Ihre API-Schlüssel für `freecurrencyapi` in die `.env`-Datei im `server`-Projekt ein. Eine Vorlage hierfür finden Sie in der `example.env`-Datei.

## Entwicklungsserver

- **Frontend starten:**
   ```bash
   nx serve frontend
   ```
   Zugriff auf das Frontend über `http://localhost:4200`.

- **Backend starten:**
   ```bash
   nx serve backend
   ```
   Der Server läuft auf `http://localhost:3000` und ist so konfiguriert, dass CORS für lokale Anfragen zugelassen wird.

## Tests

- **Tests ausführen:**
Für das Backend und das Frontend können Tests mit Jest und Cypress durchgeführt werden:

```bash
nx test frontend
```
```bash
nx run frontend-e2e:e2e
```
```bash
nx test server
```

