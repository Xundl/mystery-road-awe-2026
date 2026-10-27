# Exercise 5 – Antworten (Vorlage, in eigenen Worten umformulieren)

## Demo 1 – Event handling
**Q1:** In React schreibe ich `onClick={handler}` direkt am JSX-Element. In Vanilla stand ein inline `onclick="..."` im HTML-String oder ein `addEventListener` im JS. Vanilla bekommt das native DOM-`Event`; React reicht ein `SyntheticEvent` (ein Wrapper um das native Event, in allen Browsern gleich; das echte steht in `e.nativeEvent`).
**Q2:** Nein. Delegation war nötig, weil `innerHTML` die Elemente bei jedem Render neu erzeugt hat und Listener sonst weg waren bzw. sich gestapelt haben. In React hänge ich den Handler deklarativ ans Element, React kümmert sich ums Registrieren/Entfernen (intern delegiert React selbst am Root).

## Demo 2 – useState & controlled forms
**Q1:** Controlled = der angezeigte Wert kommt aus dem State (`value={state}`), jede Änderung läuft über `onChange` → Setter. Ohne `onChange` lässt sich nicht tippen: React rendert nach dem Tastendruck mit dem alten State-Wert, `value` wird also sofort zurückgesetzt (plus Konsolenwarnung). Live zeigen: in `EvidenceToolbar.tsx` das `onChange` der Suche auskommentieren.
**Q2:** Hypothesen-Formular: ein State-Objekt `draft` mit einem generischen `setField(key, value)`. Die Felder gehören zusammen, werden gemeinsam gespeichert/geladen, und es braucht nur einen Handler statt sechs. Update immutable: `{ ...d, [key]: value }`. Bei den Filtern (Demo 7) nehme ich stattdessen einen Reducer.

## Demo 4 – Derived values
**Q1:** Regel: In `useState` kommt nur, was nicht aus anderem State/Props berechnet werden kann (was der Nutzer eingibt/ändert). Alles Berechenbare wird beim Rendern berechnet. Die gefilterte Liste ist `f(evidence, filters)` → `filterAndSortEvidence(...)` pro Render; `useMemo` wäre bei 18 Einträgen unnötig.
**Q2:** Die Dashboard-Zahl wird bei jedem Render aus `bookmarks.length` berechnet. Es gibt kein "schon gerendert"-Flag und keine zweite Kopie, die veralten kann. `filteredEvidence` entsteht bei jedem Render neu durch `.filter()` (immer ein neues Array, nie dieselbe Referenz wie die Master-Liste) und wird nicht gespeichert. Beide Bugs kamen von gespeicherten Kopien/Caches. Wo nichts gespeichert wird, kann nichts driften.

## Demo 5 – Lifting state
**Q1:** State wandert von der Kindkomponente zum nächsten gemeinsamen Besitzer, der ihn nach unten gibt. Vorher: Dashboard las die Bookmark-Zahl einmalig aus localStorage (eigene Kopie), in Vanilla war es ein globales Array. Jetzt: ein `useState` in `BookmarksProvider` (`BookmarksContext.tsx`), über dem Router, weil Dashboard, Evidence und Workspace Geschwister-Routen sind.
**Q2:** Drei getrennte States würden auseinanderlaufen: Stern in Evidence setzen ändert nur dessen Kopie, Dashboard zeigt die alte Zahl, Workspace die alte Liste. Außerdem geht lokaler State beim Routenwechsel verloren, weil die Seite unmountet.

## Demo 6 – Callbacks nach unten
**Q1:** Ein Kind hat keinen Zugriff auf den Setter des Besitzers, und direktes Ändern würde kein Re-Render auslösen. Mit einem Callback entscheidet der Besitzer, wie sich der State ändert, das Kind meldet nur "Stern X wurde geklickt" (Daten nach unten, Events nach oben). Die Änderungslogik liegt an einer Stelle.
**Q2:** `onToggleBookmark` ist in `BookmarksProvider` definiert (mit `setBookmarks`) → `EvidencePage` (über `useBookmarks()`) → Prop an `EvidenceCard` → `onClick` am Stern. `onSaveNote`: `App` (`setNotes`) → `EvidencePage` → `EvidenceDetail` → Save-Button, also 3 Ebenen. Das ist nicht zu viel, jede Ebene nutzt oder verteilt den Prop wirklich. Drilling ist hier kein echtes Problem.

## Demo 7 – useReducer
**Q1:** 7 zusammengehörige Werte, die oft gemeinsam geändert oder zurückgesetzt werden. Der Reducer (`filtersReducer`) sammelt alle erlaubten Änderungen an einer Stelle mit benannten Aktionen, und die Toolbar bekommt nur `filters` und `dispatch`, statt 7 Werte und 7 Setter.
**Q2:** `CLEAR_FILTERS` gibt `{ ...initialFilters, sort: state.sort }` zurück. Das ist ein einziges Update, in dem alle Felder konsistent zurückgesetzt werden. Mit einzelnen Settern müsste ich 6 Aufrufe machen und bei einem neuen Feld daran denken, sonst bleibt der Zustand inkonsistent.
**Q3:** `useState` ist im Kern ein Spezialfall von `useReducer` mit einem eingebauten Reducer ("der neue Wert ersetzt den alten", bzw. eine Funktion wird auf den alten angewendet). Beide halten einen State und eine Funktion, die einen neuen State auslöst. Der Unterschied ist nur, wo die Update-Logik liegt.

## Demo 8 – Context
**Q1:** Context löst Prop Drilling: Werte sind in tiefen Komponentenbäumen verfügbar, ohne dass jede Zwischenebene sie durchreicht. Er ist kein State-Management: keine Selektoren, keine Berechnung, keine Persistenz, und jeder Consumer rendert neu, wenn sich der Context-Wert ändert.
**Q2:** In Demo 6 war das Drilling mit 2–3 Ebenen gut handhabbar. Meine Schwelle: wenn Zwischenebenen Props nur weiterreichen, ohne sie zu nutzen, oder wenn viele Consumer in verschiedenen Zweigen sitzen.
**Entscheidung:** Bookmarks über Context (3 Consumer in 3 verschiedenen Routen: Dashboard, Evidence, Workspace). Notes und Evidence-Edits bleiben bei Props (nur 2 Consumer, wenige Ebenen). Ehrlich: Bei dieser App-Größe hätte auch Lifting mit Props gereicht.
**Q3:** Ja, so etwas kann passieren: Wenn man alles in Context legt, hat man faktisch globalen State. Bei Bookmarks ist das gerechtfertigt (wirklich app-weit). Die Filter wären dafür ein schlechtes Beispiel, deshalb bleiben sie lokal in `EvidencePage`.

## Demo 9 – Probleme finden und beheben
1. **Duplizierter/stale State:** `useCaseData` las die Bookmark-Zahl einmal aus localStorage (`readBookmarkCount`), parallel zum neuen Bookmark-State. Entdeckt beim Durchlesen des Codes (zwei Stellen kennen "Bookmarks"). Fix: Das Dashboard nimmt `bookmarks.length` aus dem gemeinsamen Provider.
2. **Stale State:** Das Dashboard hätte `evidence` direkt aus dem Fetch gelesen, Statusänderungen aus dem Detail wären dort nicht angekommen. Beim Entwurf erkannt (und im Browser getestet: Status auf "reviewed" → Dashboard-Zahl steigt). Fix: `App` berechnet `evidence` = geladene Daten + Edits pro Render und gibt dieselbe Liste an alle Views.
**Q2:** Am deutlichsten duplizierter bzw. stale State: In Vanilla stand die Tatsache "ist gebookmarkt" doppelt (`ev.bookmarked` und das Array `bookmarks`) und musste per `applyStoredBookmarkFlags()` manuell synchron gehalten werden. Dazu kam der Render-Cache `viewRendered` für das Dashboard.

## Demo 10 – Wrap-up
Prüfung: `grep -rn "document\.\|innerHTML\|classList\|querySelector" src` findet nur `document.getElementById("root")` in `main.tsx`, den Mount-Punkt für `createRoot`.
**Q1:** Unsicher bin ich beim Context für Bookmarks. Pro: 3 Consumer in verschiedenen Routen, kein Drilling. Contra: bei dieser App-Größe hätte Lifting in `App` mit Props gereicht, und Context versteckt den Datenfluss etwas.
**Q2:** Der stale Dashboard-Bug durch den manuellen Render-Cache (`viewRendered`) ist strukturell ausgeschlossen: In React ist die UI eine Funktion von State und Props, es gibt keine View, die "schon gerendert" ist, und keine zweite Kopie der Zahl.
