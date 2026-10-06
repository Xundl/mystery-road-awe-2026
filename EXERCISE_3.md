# Exercise 3 — React Foundations & First Migration

This is the third exercise in Advanced Web Engineering Course (CSDC). It builds on Exercises 1 and 2. This exercise adds
React to that project and migrates the **application shell and one representative view (the Dashboard)** to it. The rest of the app stays vanilla TS for now. You'll migrate more of it in Exercises 4 and 5.

Keep a running note of what you changed and why, and commit as you go. Several theory questions ask you to point at a specific decision or diff you made.

## Corresponding manuscript reading

This exercise corresponds to the following chapters in the course manuscript:

- **Chapter 12, From Static Documents to Rich Web Applications** — PDF pp. 85–88
- **Chapter 13, Rendering and Navigation Architectures** — PDF pp. 90–95
- **Chapter 14, Hybrid Rendering and Modern Web Architectures** — PDF pp. 96–100
- **Chapter 15, React Foundations** — PDF pp. 102–109

## Self-Check

The exercise is organized into 10 individual tasks with corresponding questions, that are
presented in class. 

These checkboxes are for self-checking. Don't forget to do the actual checking of tasks you are able to present in the Moodle course. **Before class, tick only what you can genuinely demonstrate or answer on the spot, live.**

| # | Demo | Ready? |
|---|---|---|
| 1 | Historical view of the web | ☐ |
| 2 | SSR vs. CSR | ☐ |
| 3 | The virtual DOM | ☐ |
| 4 | SPA vs. MPA: state & routing | ☐ |
| 5 | React introduction | ☐ |
| 6 | React + TypeScript entry point in the Vite project | ☐ |
| 7 | Component hierarchy for the whole app | ☐ |
| 8 | Architecture Decision Record: why SPA/React | ☐ |
| 9 | Migrate the application shell | ☐ |
| 10 | Migrate the Dashboard view | ☐ |

A demo only counts as "Ready" once **every** task and question checkbox inside it (below) is
ticked — the table above is just a fast overview, tick the boxes inside each demo first.

---

## Demo 1 — Historical view of the web

**Tasks**

- [ ] Give a concise explanation of how web applications evolved over the years and place the app from the exercises on the timeline. Justify where you put it.

ANTWORT:
Frühe 90er waren es statische Seiten, also reines HTML jede Seite hatte seine eigene Datei, kein Javascript, kein Server-Processing. wenn man auf einen Link geclickt hat, kam ein komplett neuer Seitenaufruf.
200er gabs dann PHP, JSP usw. Server baut bei jedem Request die HTML Seite neu zusammen (aus Datenbank + Templates), schickt fertiges HTML. Immer noch: jeder Klick = kompletter Page Reload
Mitte 2000er dann AJAX Era, Seiten fangen an Teile von sich selbst nachzuladen, ohne die ganze Seite neu zu laden (XMLHHTTPRequest, später fetch). jQuery macht das DOM-Manipulieren erträglich
SPA-Frameworks kamen dann in den 2010er, wie Angular, React oder Vue. Die Ganze Seite wird zu einer einzigen langlebigen JavaScript anwendung. Der Server liefert nur noch ein JSON-API. keine fertigen HTML Seiten mehr

Unsere App ist AJAX Era. Sie gehört nicht zur modernen SPA era. Sie lädt zwar Daten dynamisch per fetch() ohne die Seite neu zu laden, aber sie benutzt kein Framework, das eigenständige DOM-Updates berechnet. Stattdessen baut sie bei jedem Render-Vorgang HTML Strings zusammen und setzt sie per innerHTML direkt ein. Das ist also ein handgeschriebenes, low Level Dom Management im AJAX style.

**Questions** (depend on the tasks above)

- [ ] What specific problem was AJAX (and libraries like jQuery) solving that plain server-rendered pages couldn't? What new problems did that approach introduce, that SPA frameworks then tried to solve?

ANTWORT: Vorher: Jede Interaktion = kompletter Page reload. AJAX erlaubt nur Daten im Hintergrund nachzuladen und gezielt Teile der Seite zu updaten. Neues Problem: das manuelle DOM-Update-Management wurde schnell unübersichtlich. Das Muster zeigt unsere app mit innerHTML-String. SPA-Frameworks lösen das systematisch

- [ ] This app currently uses hash-based routing (`#dashboard`, `#evidence`, ...) with no full page reload between views. Which era does that pattern belong to, and what does it tell you about when this architectural choice became common?

ANTWORT: AJAX Era Übergangslösung vor der History API. #-Fragmente ändern die URL ohne Server Request/Reload. Dass unsere App das noch so macht, zeigt: nie auf moderne Mechanismen (History API zb) aktualisiert.



---

## Demo 2 — SSR vs. CSR

**Tasks**

- [ ] Present a short comparison table for Server-Side Rendering and Client-Side Rendering. Explain what the server sends on first request, what the browser has to do before the user sees content, and what happens on subsequent navigation.
- [ ] Pick one real, publicly known website and argue whether it's (primarily) SSR or CSR, using
observable evidence (view source, network tab, etc.).

Tabelle:
https://docs.google.com/document/d/1selm-lrrhW0W--Qu7xT7F3CQuqUYQlTdqooylmc404g/edit?usp=sharing

Ich würde mir jz Wikipedia (SSR) und Gmail (CSR) als Beispiel ansehen. Rechtsclick -> Seitenquellentext anzeigen: Bei Wikipedia sieht man den vollen Artikeltext. Bei Gmail nur ein leeres "<div id="root">"

**Questions** (depend on the tasks above)

- [ ] Explain why this exercise application is SSR or CSR and why. Walk through, step by step, what happens between the browser requesting the page and the Dashboard actually being visible.

ANTWORT: CSR, Browser fordert index.html an -> fast leer, lädt main.ts Bundle -> JS führt aus, startet fetch() calls für case.json/evidence.json/etc. -> Daten kommen an -> renderDashboard() baut HTML string -> innerHTML setzt in ein -> erst jetzt sichtbar. Mehrere Netzwerk Runden nötig, bevor überhaupt irgendwas auf dem Bildschirm ist.

- [ ] Name one real cost of what the architecture pays for that choice (think about what a user with JavaScript disabled, or a slow connection, or a search engine crawler would see) and why.

ANTWORT: Ohne Javascript (oder bei sehr langsamer Verbindung) sieht der Nutzer nur eine leere/leer wirkende Seite mit Loading symbolen. Kein Inhalt, bis JS geladen und alle fetches durchgelaufen sind. Suchmaschinen-Crawler, die kein JS ausführen, sähen anfangs nichts.

---

## Demo 3 — The virtual DOM

**Tasks**

- [ ] In your own words (a few sentences, not a copied definition), explain what the virtual DOM is and what problem it solves.
- [ ] Find one concrete example in the *original* vanilla `app.js` (from before Exercise 1) where a small state change (e.g. toggling one bookmark) caused a large chunk of real DOM to be recreated via `innerHTML`, even though only a tiny part of it actually needed to change.

ANTWORT: Der virtuelle DOM ist eine leichte JavaScript-Objekt-Kopie der echten DOM-Struktur. Bei einer Änderung wird zuerst nur dieses Objekt neu berechnet, mit der alten Version verglichen und nur die tatsächlich unterschiedlichen Teile werden dann gezielt im echten DOM aktualisiert. statt alles neu zu erzeugen.

handleBookmarkClick() → ruft renderEvidenceList() auf, die den kompletten evidenceList-Container per innerHTML neu baut (alle Karten neu), nur weil sich bei einer Karte der Bookmark-Stern geändert hat.

**Questions** (depend on the tasks above)

- [ ] Using the example you found: how would a virtual-DOM-based approach (conceptually, not necessarily React-specific) avoid recreating the parts that didn't change?

ANTWORT: Er würde erkennen: nur das bookmark-btn-Element einer einzigen Karte hat sich geändert, und nur dieses eine DOM-Element gezielt patchen — alle anderen Karten bleiben unberührt im echten DOM.

- [ ] Is the virtual DOM a "faster" way to update the real DOM than directly calling `innerHTML`? Explain precisely what's actually being traded off (think about the diffing work itself).

ANTWORT: Nicht automatisch. Das Diffing selbst kostet CPU-Zeit. Der Tausch ist: zusätzliche JS-Rechenarbeit (Diffing) gegen weniger teure echte DOM-Operationen (Reflow/Repaint), die bei großem innerHTML-Austausch sonst für die ganze Liste anfallen würden.

- [ ] Does using a virtual DOM library automatically make your app fast? What could still make a React app slow despite it?

ANTWORT: Nein. Unnötige Re-Renders, schlechte key-Nutzung in Listen, teure Berechnungen bei jedem Render können eine React-App trotzdem langsam machen.
---

## Demo 4 — SPA vs. MPA: state & routing

**Tasks**

- [ ] Diagram or illustrate live how navigation currently works in this app: what triggers a view change, what code runs, and what does *not* happen (that would happen in a classic multi-page site).
- [ ] List every piece of state in the current app that would be lost on a full page reload, versus what's preserved (hint: check what's in `localStorage` versus what's only in memory).

ZUM HERZEIGEN: Im Browser DevTools/Network Tab und den Code klick mich durch die App und zeig dann her: Wenn der Network tab offen ist und ich auf einen nav button klicke, dann kommt kein neuer Request (beweis für "kein page reload") in VS Code zu navigateTo() in navigation.ts aufklappen, dann handleHashChange() daneben. während clicken Code ablauf erklären.

State verloren vs erhalten.
Erhalten (in localStorage): Bookmarks, Notizen, Hypothese-Entwurf. Verloren bei vollem Reload (nur im Speicher): aktuelle Filter/Suchtext, sortierauswahl, selectedEvidence, viewRendered-Cache-Flags, offenes Detail Panel.

**Questions** (depend on the tasks above)

- [ ] In a traditional multi-page app, where does "the current page's data" live between requests? Where does it live in this SPA instead, and what are the consequences of that difference (for good and for bad)?

ANTWORT: MPA: auf dem Server, pro Request neu zusammengebaut (Session/DB). SPA: in JS-Variablen im Browser-Speicher. Konsequenz: SPA-Navigation ist schneller, aber State geht bei echtem Reload verloren, wenn nicht explizit persistiert.

- [ ] This app currently implements routing by hand (`handleHashChange()`, a `switch`-like chain of `if`s, and manually toggling CSS classes). What is a router library actually responsible for that this hand-rolled version does *not* handle?

ANTWORT: Echte URL-Pfade statt nur Hash, verschachtelte Routen, Routen-Parameter, programmatische Navigation Guards, Scroll-Restoration, Code-Splitting pro Route, sauberes 404-Handling.

- [ ] If the user hits the browser's back button right now, what happens in this app, and why?

ANTWORT: Funktioniert überraschend gut: Hash-Änderungen erzeugen automatisch Browser-History-Einträge, 'Zurück' löst wieder hashchange aus, handleHashChange() zeigt die vorherige Ansicht — ganz ohne extra Code dafür.

---

## Demo 5 — React introduction

**Tasks**

- [ ] Read enough of the React docs (or equivalent) to write, from scratch, a single tiny component (it can live in a throwaway sandbox, not necessarily this project yet) that renders a piece of static data as JSX. No state, no props even, just to prove you can write and reason about JSX.
- [ ] Identify, in your own words, what "component" means in React, and how it differs from a plain JavaScript function that happens to return an HTML string (which is essentially what several functions in the old `app.js` did, e.g. `renderEvidenceCardHTML()`).

JSX: 
function Greeting() {
  return <h1>Hello, Project ReMotion</h1>;
}

Eine React-Komponente ist eine Funktion, die JSX zurückgibt, das React in echte DOM-Elemente übersetzt. renderEvidenceCardHTML() gibt dagegen einen reinen String zurück, der per innerHTML in den DOM gepresst wird — React 'kennt' die Struktur seines Outputs (als Baum von Objekten), während innerHTML nur rohen Text sieht, der jedes Mal komplett neu geparst werden muss.

**Questions** (depend on the tasks above)

- [ ] What is JSX, actually? What does it compile to?

ANTWORT: JSX ist HTML-ähnliche Syntax direkt in JavaScript. Es kompiliert zu normalen React.createElement(...)-Funktionsaufrufen

- [ ] Compare your tiny component to the old `renderEvidenceCardHTML(ev)` function (string concatenation returning an HTML string). What is fundamentally different about how each one's output becomes real DOM?

ANTWORT: renderEvidenceCardHTML erzeugt einen String, der geparst und komplett neu ins DOM eingefügt wird. JSX erzeugt ein strukturiertes Objekt (virtueller DOM), das React mit dem vorherigen Zustand vergleicht und nur die echten Unterschiede ins DOM schreibt.

- [ ] What does it mean that "components are just functions" in React? What would break if a
component's function body had a side effect (e.g. mutated a global variable) every time it rendered?

ANTWORT: Würde eine Komponente bei jedem Aufruf z.B. eine globale Variable mutieren, würde das bei jedem Re-Render erneut passieren — unvorhersehbar oft, abhängig davon wie oft React rendert, nicht wie oft der Nutzer wirklich etwas getan hat. React geht davon aus, dass Rendering eine reine Funktion ohne Seiteneffekte ist; Verstöße führen zu Bugs, die schwer nachvollziehbar sind.

---

## Demo 6 — React + TypeScript entry point in the Vite project

**Tasks**

- [ ] Add React and TypeScript support to the existing Vite project from Exercise 2 (the right Vite plugin, `tsx` support, React types).
- [ ] Create a minimal entry point (e.g. a root `<App />` component mounted into the page) that
renders *something* visible, without removing the working vanilla app yet.
- [ ] Decide and document how the two versions coexist during the migration (e.g. a separate route/ flag to view the React version, or a full swap-over. Your call, but be ready to justify it).

**Questions** (depend on the tasks above)

- [ ] What did you actually have to install and configure to get JSX compiling through Vite? What is each piece responsible for?
- [ ] How does your `<App />` component get from source code onto the actual page? Trace the path from your `.tsx` file to the DOM.
- [ ] What decision did you make about how the vanilla and React versions coexist during migration, and why? What would go wrong with an opposite choice?

---

## Demo 7 — Component hierarchy for the whole app

**Tasks**

- [ ] Design and diagram a proposed component hierarchy for the **entire application**, not just the part you're building this exercise. E.g. pages (one per current view) and the reusable components you expect to extract (cards, badges, buttons, form controls, etc.), even though most of them won't be built until Exercises 4 and 5.
- [ ] For at least 5 components in your diagram, briefly note what data/props each one would need and where that data comes from.

https://docs.google.com/document/d/1selm-lrrhW0W--Qu7xT7F3CQuqUYQlTdqooylmc404g/edit?usp=sharing

**Questions** (depend on the tasks above)

- [ ] What criteria did you use to decide something should be its own component versus staying inline inside a bigger one?

ANTWORT: Wird dieselbe Struktur mehrfach gebraucht (StatCard, EvidenceCard), oder hat ein Teil klar eigene Verantwortung (FilterToolbar) → eigene Komponente. Einmaliges, simples Markup bleibt inline.

- [ ] Pick one component in your diagram that appears in more than one place in the app. What made you extract it instead of duplicating its markup, and how does that compare to how the original vanilla app handled (or didn't handle) that same duplication?

ANTWORT: StatCard erscheint 5x im Dashboard. Der alte Code hatte dafür schon statCardHTML(value, label) als Helper — Wiederverwendung existierte also schon, aber als String-Builder statt als eigenständige, komponierbare Einheit.

- [ ] Your diagram includes components you won't build until later exercises. Why is it useful to design the whole hierarchy now rather than only diagramming what you're about to build?

ANTWORT: Verhindert Inkonsistenzen später (z.B. zwei leicht unterschiedliche Card-Varianten), und macht sichtbar, welche Komponenten mehrfach gebraucht werden, bevor man dort ankommt.
---

## Demo 8 — Architecture Decision Record: why SPA/React

**Tasks**

- [ ] Argue whether an SPA built with React is actually the right architecture for *this specific app*, given what it does.
- [ ] Include honest trade-offs or downsides of the SPA/React choice for this app, not just the benefits.

Für diese App ist SPA/React vertretbar, aber nicht zwingend nötig. Die App hat mehrere Ansichten mit viel clientseitiger Interaktivität (Filtern, Sortieren, Bookmarks, Formular-State) — genau das Szenario, wo React echten Mehrwert bringt: deklaratives UI-Update statt manuellem innerHTML-Jonglieren. Nachteile: Die App hat keine großen Performance-Probleme, die React lösen müsste — die Datenmenge ist klein (ein paar Dutzend Evidence-Items). Der Umstieg bringt Bundle-Size, Build-Komplexität (wie wir grad bei Übung 2 gesehen haben) und eine Lernkurve, ohne dass es echte SEO- oder Initial-Load-Anforderungen gäbe, die das rechtfertigen würden. Für eine reine Uni-Demo-App ist der Umstieg eher pädagogisch motiviert als technisch zwingend."

**Questions** (depend on the tasks above)

- [ ] What would you lose by keeping this app as server-rendered vanilla HTML/JS instead? What would you lose by choosing React specifically over a *different* SPA approach (e.g. vanilla JS with a router, or a lighter library)?

ANTWORT: Gegenüber Server-Rendering verliert man schnellere Interaktionen ohne Reload. React speziell gegenüber z.B. 'vanilla JS + kleiner Router' verliert man Einfachheit/kleinere Bundle-Size — man gewinnt dafür ein etabliertes Ökosystem, deklaratives Rendering, bessere Wartbarkeit bei wachsender Komplexität.

- [ ] If this app needed to support users on very low-end devices or poor connections as a hard requirement, would you stick with SPA or change the architecture? Why or why not?

ANTWORT: Wechseln, eher Richtung SSR oder sogar reines server-gerendertes HTML. SPA erzwingt erst JS-Download+Ausführung, bevor überhaupt Inhalt sichtbar ist — bei schlechter Verbindung/schwacher Hardware ein echter Nachteil gegenüber sofort sichtbarem HTML.

---

## Demo 9 — Migrate the application shell

**Tasks**

- [ ] Build the header/branding, the navigation bar, and a routing skeleton (even a minimal one, a full router library is not required yet) in React + TypeScript.
- [ ] Wire it up so navigating between (stub) pages actually changes what's rendered, mirroring the current five views even though only the Dashboard will have real content this exercise.

**Questions** (depend on the tasks above)

- [ ] How does "the current view" get tracked in your React shell? Compare this directly to how `currentPage` and `handleHashChange()` did it in the vanilla version? What's actually
different, and what's superficially different but conceptually the same?
- [ ] What happens in your shell if a user navigates to a view that doesn't exist? How does that compare to the vanilla app's fallback-to-dashboard behavior?

---

## Demo 10 — Migrate the Dashboard view

**Tasks**

- [ ] Rebuild the Dashboard view as React components (using your hierarchy from Demo 7 as a starting point), rendering the case summary, stat cards, review progress, and the recent
evidence/timeline lists. Reading from the same data your app already loads.
- [ ] Confirm it renders correctly with real data, and that navigating away and back doesn't lose or corrupt anything.

**Questions** (depend on the tasks above)

- [ ] Where does the Dashboard's data (case info, evidence, timeline) come from in your React version, and how does it get to the components that render it? Is this the final architecture you intend to keep, or a placeholder you know you'll change in a later exercise?
- [ ] The old vanilla dashboard had a real bug where it could show stale numbers because it only re-rendered on a view's *first* visit (a manual render-cache flag). Does your React version have an equivalent risk? Why or why not, given how React re-renders?
- [ ] What, if anything, does your React Dashboard do differently from the vanilla one in terms of *when* it recalculates derived values (like the review-progress percentage)?

---

## What to bring to class

For each of the 10 demos: your changed code/diagrams/documents (ideally as commits you can show live), and the ticked checkboxes above reflecting what you can genuinely demonstrate and answer *right now*.
