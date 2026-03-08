1. Wie startet man das Projekt lokal?

A: npm install und npm run dev ausführen. es gab auch run build bei package aber eher optional

2. Was fehlt dem Projekt, damit es in einer Produktionsumgebung eingesetzt werden kann?

A: ich habe nicht so viel erfahrung im richtigen Produktionsumgebung, deswegen kenne ich nicht die "Must to haves". Aber
meine Antwort wären: CI/CD Pipelines für automatiesierte builds, test, etc., Docker (.yml) damit andere mitglieder sich auch einfach rein integrieren können wenn das projekt komplexer wird (Das wäre aber dann mehr ein dev ops projekt),
tests umgebungen sowei limiting weil es eine web projekt ist, Monitoring mit grafana oder andere tools. 
Mir würde noch security aaspekte auch einfallen aber eher später wie https statt http oder Cors origin.
gitignore *_. für mac user

3. Was sollte man ergänzen, wenn man mit mehreren Entwicklern daran arbeiten möchte?

A: Wie oben genannt eine docker umgebung herstellen damit das projekt reproduzierbar ist. 
Außerdem eine proejkt umgebung für aufgaben verteilng wie Jira oder Github issues herstellen für tickets oder sprints.
Ein weiterer Punkt wo ich mir aber nicht sicher bin wäre auch die Obenn genannten CI pipelines für tests und builds,
damit die Entwickler auch ihren stand korrekt halten könenn.

4. Welche Verbesserungen würdest du am Code vornehmen?

React state verwenden für bessere UI updates
dupplikate bei den produkten vermeiden id = 5
Error Handling bein loading mit try catch und Error states
man könnte noch Prettier verwenden 
und das + sichtbar machen (ich wusste nicht mal dass da einer war)

Ab den Punkt Habe ich die ki noch gefragt:

Produktdaten sauber typisieren und auslagern (kein [] as Product[], sondern useState<Product[]>([]), Daten z. B. aus Datei/API).
Rendering vereinfachen: statt if/else im map eine Klasse per Bedingung setzen.

5. Warum wird der Warenkorb beim Hinzufügen von Produkten nicht aktualisiert? Wie würdest du das Problem beheben?

wie bereits in 4 erwähnt liegt es an den fehlenden react states. der waren korb wird nur mutierrt cart.addItem aber setState wird nie ausgeführt
Der Warenkorb wurde so umgebaut, dass er pro Produkt eine Menge speichert (Map nach id). Dadurch kann ein Produkt mehrfach hinzugefügt werden, und getCount/getTotalPrice berücksichtigen die Mengen.

6. Kannst du die Produktliste aus einem Backend laden? Du kannst das Projekt dev-workout-backend-kotlin dafür verwenden.

Ja. Ich starte das Kotlin‑Backend (./gradlew bootRun), das unter http://localhost:8080/products die Produktliste liefert. Im Frontend lade ich die Daten per fetch('/api/products') und setze sie in den State. Damit es ohne CORS‑Probleme klappt, leitet Vite /api per Proxy an das Backend weiter (vite.config.ts).

7. Erstelle eine verbesserte Version des Projekts mit den von dir vorgeschlagenen Änderungen. Ähnliche Probleme /
   Fehler brauchst du nur einmal zu beheben

Ich habe die vorgeschlagenen Verbesserungen umgesetzt: Die Produktliste lädt aus dem Backend, der Warenkorb ist State‑basiert mit Mengenlogik, Fehler‑Handling wurde ergänzt und die description wird angezeigt. CI‑Pipelines und Docker‑Setup sind vorhanden und über das Makefile ausführbar.

8. Optionale Zusatzaufgabe: Füge eine einfache Produktdetailseite hinzu, die angezeigt wird, wenn auf ein Produkt in der
   Produktliste geklickt wird. Nimm dazu ein zusätzliches Feld "description" in den Produktdaten auf und zeige diese
   Beschreibung auf der Detailseite an.

Eine einfache Produktdetailseite ist umgesetzt: Klick auf ein Produkt führt zur Detailansicht, die Name, Preis und description anzeigt (Route /products/:id). Die description ist im Produkttyp enthalten und wird auf der Detailseite angezeigt.


Als Ein kleiner notiz am ende:

Ich bin kein Script‑Coder, der alles auswendig kann. Ich nutze KI als Unterstützung, um schneller zu Lösungen zu kommen. Mir ist wichtiger, den Workflow und den Code wirklich zu verstehen und nachvollziehen zu können, statt Dinge nur auswendig zu lernen.