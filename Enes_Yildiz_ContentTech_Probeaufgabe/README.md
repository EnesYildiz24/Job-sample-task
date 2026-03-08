# Probearbeit: Werkstudent Content-Tech

## English version available below!

---

## Überblick

Diese Probearbeit testet deine Fähigkeiten in der Backend-Entwicklung mit TypeScript, API-Integration und Datenverarbeitung.
Du wirst einen Bot entwickeln, der Jira-Issues analysiert und strukturierte Reports erstellt.

**Zeitrahmen:** 2 Stunden  
**Technologien:** TypeScript, Node.js

## Aufgabenstellung

Entwickle einen Bot namens `jiraStaleIssuesReporter`, der Jira-Issues analysiert, die seit längerer Zeit nicht bearbeitet wurden.

### Anforderungen

#### 1. Datenabfrage und -verarbeitung (Mock-Daten)

Da du keinen Zugriff auf die echte Jira-API hast, arbeite mit den bereitgestellten Mock-Daten in `src/mockData/jiraIssues.ts`.

Implementiere folgende Funktionalität:

- Filtere alle Issues, die seit mehr als 14 Tagen im Status "In Progress" sind
- Gruppiere die Issues nach zugewiesenem Benutzer (assignee)
- Sortiere die Gruppen nach Anzahl der Issues (absteigend)
- Berechne für jede Gruppe:
  - Anzahl der Issues
  - Durchschnittliche Verweildauer im aktuellen Status (in Tagen)
  - Liste der Issue-Keys

#### 2. Report-Generierung

Erstelle eine formatierte Ausgabe mit:
- Gesamtanzahl der "stale" Issues
- Liste der Benutzer mit ihren Statistiken
- Top 3 älteste Issues mit Details

#### 3. Code-Struktur

Organisiere deinen Code in sinnvolle Module:
- `src/index.ts` - Haupteinstiegspunkt
- `src/services/issueAnalyzer.ts` - Logik für Issue-Analyse
- `src/services/reportGenerator.ts` - Logik für Report-Generierung
- `src/types/index.ts` - TypeScript Type Definitionen
- `src/utils/dateHelper.ts` - Hilfsfunktionen für Datums-Berechnungen

#### 4. Fehlerbehandlung & Logging

- Implementiere Try-Catch-Blöcke für kritische Operationen
- Erstelle eine einfache Logger-Funktion
- Validiere Eingabedaten

## Erwartete Ausgabe

Nach der Ausführung von `npm start`, sollte dein Ergebnis ungefähr so aussehen: \
_Formatierung ist hierbei zweitrangig. Du kannst gerne ein Format deiner Wahl nutzen, solange es lesbar ist_


```
🚀 Starting Jira Stale Issues Reporter...

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 STALE ISSUES REPORT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Total stale issues (>14 days in "In Progress"): 11

Issues by Assignee:
┌────────────────┬────────┬──────────────┐
│ Assignee       │ Issues │ Avg. Days    │
├────────────────┼────────┼──────────────┤
│ Max Mustermann │ 5      │ 20.6  days   │
│ Anna Schmidt   │ 4      │ 20.5  days   │
│ Unassigned     │ 2      │ 20    days   │
└────────────────┴────────┴──────────────┘

Top 3 Oldest Issues:
1. PLAN-1234 - "Update product comparison for smartphones" (Max Mustermann, 28 days)
2. PLAN-2345 - "Create new comparison for headphones" (Anna Schmidt, 25 days)
3. PLAN-1235 - "Review SEO keywords for laptop category" (Max Mustermann, 24 days)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ Report completed successfully
```

## Technische Vorgaben

### Setup

```bash
cd werkstudent-probearbeit
npm install
npm start
```

### TypeScript Konfiguration

Eine `tsconfig.json` ist bereits vorbereitet. Nutze TypeScript-Features wie:
- Interfaces/Types für Datenstrukturen

### Code-Qualität

- Verwende aussagekräftige Variablen- und Funktionsnamen
- Schreibe kurze, fokussierte Funktionen (max. 30 Zeilen)
- Kommentiere komplexe Logik
- Vermeide Code-Duplikation

## Tipps

- Beginne mit der Datenstruktur (Types/Interfaces)
- Implementiere zuerst die Kern-Logik, dann die Formatierung
- Teste mit den Mock-Daten regelmäßig
- Schaue dir die Beispiel-Dateien im `examples/` Ordner an

## Fragen?

Bei Fragen zur Aufgabenstellung oder technischen Problemen melde dich gerne!

Viel Erfolg! 🚀

---
