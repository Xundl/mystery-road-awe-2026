# Exercise 2 — Build Tooling, TypeScript & CI/CD

This is the second exercise in Advanced Web Engineering Course (CSDC). It builds directly on
**Exercise 1**, you need the ES-module split from that exercise finished first, since this exercise migrates those modules to TypeScript and puts them through a real build pipeline.

By the end of this exercise the project will: be managed by a package manager instead of a plain
`<script>` tag, run through Vite for both development and production builds, be written in
TypeScript instead of JavaScript, and be linted, formatted, and deployed automatically by GitHub
Actions whenever code is pushed.

**Out of scope for this exercise** (these come later in the course): migrating to a framework (e.g.
React)

Keep a running note of what you changed and why. As in Exercise 1, **commits are the easiest way to
demonstrate a before/after live**, e.g. "workflow fails here, passes after this commit," or "this
compiled fine in JS, here's the TypeScript error it produces and the fix."

## Corresponding manuscript reading

This exercise corresponds to the following chapters in the course manuscript:

- **Chapter 7, The Build First Mindset** — PDF pp. 55–57
- **Chapter 8, Dependencies, Package Managers, and Vite** — PDF pp. 58–62
- **Chapter 9, Linting, Formatting, and Asset Processing** — PDF pp. 63–66
- **Chapter 10, TypeScript: Static Types for JavaScript** — PDF pp. 67–78
- **Chapter 11, Continuous Integration and Automated Deployment** — PDF pp. 80–83

## Self-Check

The exercise is organized into 10 individual tasks with corresponding questions, that are
presented in class.

These checkboxes are for self-checking. Don't forget to do the actual checking of tasks you are able to present in the Moodle course. **Before class, tick only what you can genuinely demonstrate
or answer on the spot, live.**

| # | Demo | Ready? |
|---|---|---|
| 1 | Initialize the package manager & project metadata | ☐ |
| 2 | Integrate Vite as the dev server | ☐ |
| 3 | Production build & preview | ☐ |
| 4 | `package.json` scripts: lint & format | ☐ |
| 5 | TypeScript setup & first conversions | ☐ |
| 6 | Typing the domain data | ☐ |
| 7 | Full migration & resolving type errors | ☐ |
| 8 | GitHub Actions: development workflow | ☐ |
| 9 | GitHub Actions: deployment workflow | ☐ |
| 10 | Workflow triggers, permissions & failure modes | ☐ |

A demo only counts as "Ready" once **every** task and question checkbox inside it (below) is
ticked. The table above is just a fast overview, tick the boxes inside each demo first.

GRUNDKONZEPT:
Wir haben die App von "ein paar Dateien, die der Browser direkt lädt" zu einem echten Build-Prozess umgebaut: npm verwaltet, welche Werkzeuge/Bibliotheken das Projekt braucht und in welcher Version. Vite ist sowohl Entwicklungs-Server (schnelles Testen mit Live-Reload) als auch Bauwerkzeug (bündelt, minifiziert, optimiert für die echte Auslieferung). ESLint/Prettier prüfen automatisch Code-Qualität und -Stil. TypeScript fügt Typsicherheit hinzu, die Fehler schon beim Kompilieren statt erst beim Ausführen zeigt. GitHub Actions stellt sicher, dass diese Prüfungen bei jedem Push automatisch laufen, unabhängig davon ob wer's lokal vergessen hat.

---

## Demo 1 — Initialize the package manager & project metadata

**Tasks**

- [ ] Choose **npm** or **pnpm** and record why you picked it over the other.
- [ ] Initialize `package.json` for the project (name, version, description, etc. filled in properly).
- [ ] Add a `.gitignore` entry for `node_modules` (and any other tool output you generate in later demos, e.g. `dist/`).
- [ ] Install one real dependency (you'll add more in later demos) and show the resulting lockfile (`package-lock.json` or `pnpm-lock.yaml`) committed to the repo.

**Questions** (depend on the tasks above)

- [ ] What problem does a package manager actually solve that "download the library and put it in a folder yourself" doesn't? Be specific.

       Was löst ein Package Manager, das "Library selbst runterladen" nicht löst? → Verwaltet Abhängigkeiten von Abhängigkeiten automatisch (Vite hat 15 eigene Pakete mitgebracht), sorgt für konsistente Versionen im Team, macht das Setup mit einem Befehl reproduzierbar.

- [ ] What's the difference between `dependencies` and `devDependencies` in `package.json`? Which
      category will Vite, your linter/formatter, and TypeScript belong to, and why?

      dependencies vs devDependencies? → dependencies laufen in der fertigen App beim Nutzer mit, devDependencies (Vite, ESLint, Prettier, TypeScript) brauchst nur du beim Entwickeln/Bauen, landen nie im Nutzer-Browser.

- [ ] What is a lockfile for, and what could go wrong for your teammates (or CI) if it weren't
      committed to the repo?

      Wofür ist ein Lockfile? → Legt exakte Versionen aller (auch verschachtelten) Pakete fest. Ohne es könnten zwei Installationen zu unterschiedlichen Zeiten leicht unterschiedliche Versionen bekommen → "bei mir geht's, bei dir nicht"-Probleme trotz gleichem Code.

- [ ] If you chose pnpm: what does it do differently from npm regarding how `node_modules` is laid out and how disk space/install time is shared across projects? If you chose npm: what would you gain or lose by switching to pnpm on a larger project?

      npm vs. pnpm? → pnpm speichert Pakete zentral und verlinkt sie in Projekte (spart Platz/Zeit bei vielen Projekten), npm kopiert pro Projekt. Für dieses kleine Projekt macht der Unterschied kaum was aus, npm war die pragmatische Wahl.


---

## Demo 2 — Integrate Vite as the dev server

**Tasks**

- [ ] Install Vite and configure it for this project (restructure files if needed so Vite can find `index.html`/your modules/the `data/` and `assets/` folders correctly).
- [ ] Get `vite`'s dev server running the app with the same functionality it had before. Verify every view still works, not just that the page loads.
- [ ] Trigger Hot Module Replacement at least once: change something in the running app's source and observe the update happen without a full page reload.

**Questions** (depend on the tasks above)

- [ ] What is the difference between how you used to run this app (a plain static file server) and running it through Vite's dev server? Name at least one thing Vite's dev server does that a plain static server doesn't.
      
      Unterschied zu Live Server? → Live Server liefert Dateien 1:1 aus, Vite verarbeitet Code beim Ausliefern (später TS-Transpilation) und bietet Live-Reload/HMR eingebaut.

- [ ] What is Hot Module Replacement, and what specifically did you observe happen (and *not* happen, e.g. to app state) when you triggered it?

      Was genau bei HMR beobachtet? → Bei uns tatsächlich ein kompletter Reload (kein echtes HMR), weil unser Vanilla-JS keinen HMR-Boundary definiert — Vite fällt automatisch auf Live-Reload zurück. Zustand (Sucheingabe) ging dabei verloren.

- [ ] Why does an app already split into ES modules (Exercise 1) integrate naturally with a tool like Vite, compared to the original single-`<script>` version?

      Warum passt ES-Module-Struktur natürlich zu Vite? → Vite ist von Grund auf für natives import/export gebaut, nutzt genau diese Struktur, um gezielt einzelne Module zu verarbeiten/ersetzen.
---

## Demo 3 — Production build & preview

**Tasks**

- [ ] Run the production build (`vite build`) and inspect the generated `dist/` folder.
- [ ] Serve that build locally with `vite preview` (not the dev server) and confirm the app still works end-to-end from the built output.
- [ ] Compare the dev-mode source with the built output for at least one file: note what changed (filenames, size, formatting/minification).

**Questions** (depend on the tasks above)

- [ ] Name at least three concrete transformations Vite applied to your source when building for production (e.g. bundling, minification, hashed filenames. Pick the ones you actually observed).

      Drei Transformationen? → Bundling (11 Dateien → 1 .js), Hashed Filenames (index-Y4XK8t4i.js), Minifizierung (keine Kommentare/Einrückung mehr). Bonus: public/-Mechanismus für Dateien, die per fetch()/String-Pfad geladen werden.

- [ ] Why do production filenames typically include a content hash? What problem does that solve for real deployments?

      Warum Content-Hash im Namen? → Sichert Browser-Caching ab — neue Version bekommt automatisch neuen Namen, alte gecachte Dateien bleiben nicht fälschlich aktiv.

- [ ] Why would you never want to deploy the dev server itself (`vite dev`/`vite`) to real users, even though it "works"?

      Warum nie den Dev-Server deployen? → Unminifiziert, unoptimiert, für schnelles Entwickler-Feedback gebaut, nicht für Performance/Stabilität bei echten Nutzern.

---

## Demo 4 — `package.json` scripts: lint & format

**Tasks**

- [ ] Install and configure a linter (e.g. ESLint) and a formatter (e.g. Prettier) for this TypeScript/JS project.
- [ ] Add these scripts to `package.json`: `dev`, `build`, `lint`, `lint:fix`, `format`. Each one must actually do something real when run, not just print a placeholder.
- [ ] Run `lint` and show it catching at least one real issue in your code (introduce one on purpose if you have to). Run `lint:fix` and/or `format` and show it actually changing a file.

**Questions** (depend on the tasks above)

- [ ] What's the difference between what a linter checks/fixes and what a formatter checks/fixes? Give one concrete finding from each tool on this codebase.

      Linter vs. Formatter, je ein Fund? → Linter prüft Logik/Struktur (Fund: loadingIndicator unbenutzt in evidence.js), Formatter nur Aussehen (Fund: alle 11 Dateien bei format angepasst).

- [ ] Why are `lint` and `lint:fix` two separate scripts instead of one script that always auto-fixes? When would you deliberately want the non-fixing version?

      Warum lint und lint:fix getrennt? → Live bewiesen: lint:fix hat 0 der 34 no-unused-vars-Warnungen automatisch behoben — zu riskant, Code blind zu löschen. Trennung nötig für CI, wo man nur prüfen, nicht automatisch verändern will.

- [ ] What does `npm run lint` (or `pnpm lint`) actually do under the hood? Where does npm/pnpm look for the `lint` command, and would it work if your linter weren't installed as a project dependency (only globally on your machine)?

      Was macht npm run lint unter der Haube? → Schaut in package.json → scripts.lint, führt dann node_modules/.bin/eslint aus. Ohne lokale Installation (nur global) würde es bei Teammitgliedern ohne globale Installation nicht laufen — deswegen gehört der Linter in devDependencies.

---

## Demo 5 — TypeScript setup & first conversions

**Tasks**

- [ ] Install TypeScript and add a `tsconfig.json`. Deliberately choose your strictness settings (don't just copy a default blindly) and be ready to justify at least one setting you turned on or left off.
- [ ] Convert 2–3 of your smallest/utility modules from Exercise 1 (e.g. formatting or lookup helpers) from `.js` to `.ts`, with **no `any`**, and get them compiling with zero errors.
- [ ] Wire TypeScript into your `build`/`dev` scripts from Demo 4 so type errors are actually surfaced by your tooling, not just by your editor.

**Questions** (depend on the tasks above)

- [ ] What does the `strict` option in `tsconfig.json` actually turn on? Name at least two individual checks bundled under it, and say whether you kept it on and why.

      Was schaltet strict: true ein? → Bündel von Checks, u.a. strictNullChecks (zwingt zu explizitem undefined-Handling) und noImplicitAny (verbietet stillschweigenden any-Typ).

- [ ] What is the difference between a compile-time type error and the runtime bugs you fixed in Exercise 1? Could TypeScript alone have caught any of those specific bugs? Why or why not?

      Compile-Time vs. Laufzeit-Bugs aus Übung 1? → TypeScript hätte weder den var-Closure-Bug (Demo 4) noch den Referenz-Bug (Demo 2) gefangen — beide sind typmäßig gültiger Code, nur logisch falsch. TS ist stark bei Formfehlern, nicht bei Logikfehlern.

- [ ] What does `any` do to TypeScript's checking for a value, and why did you avoid it in this first pass even though it would have been faster to just silence the errors with it?

      Warum any vermieden? → Schaltet Typprüfung komplett ab. Bewusst nur bei den Lookup-Funktionen verwendet, weil die echten Domain-Typen erst in Demo 6 kommen.

---

## Demo 6 — Typing the domain data

**Tasks**

- [ ] Define TypeScript types/interfaces for the case's data model (evidence, people, locations, timeline events) that match the shape of `data/*.json`.
- [ ] Convert your data-loading module to use these types instead of untyped `fetch().json()` results.
- [ ] Pick one field that was genuinely ambiguous or inconsistent in the original JavaScript version (for example: something that could be either an id or a display name, or a date stored in more than one format) and show what modeling it as a proper TypeScript type forced you to decide.

**Questions** (depend on the tasks above)

- [ ] Walk through the ambiguous field you picked: how did the JavaScript version get away without deciding on one shape, and what did TypeScript force you to commit to?
- [ ] Is there a data-shape problem in this app that TypeScript's static types **can't** catch on their own, because the actual bad data would only show up at runtime from a JSON file, not from your code? What would you need in addition to types to catch that?
- [ ] What's the difference between an `interface` and a `type` alias for an object shape in TypeScript? Which did you use for your domain models, and does it actually matter here?

---

## Demo 7 — Full migration & resolving type errors across the app

**Tasks**

- [ ] Convert the remaining `.js` modules to `.ts`, and get the **entire app** compiling with zero TypeScript errors under the strictness settings from Demo 5.
- [ ] Find at least 3 real spots where the compiler flagged something you had to actually think about (a union type, a possibly-`undefined` value, an implicit `any`, etc.). For each, decide and record whether it pointed at a real latent bug or was "just" the compiler being pedantic.
- [ ] Confirm the app still behaves identically to the working JavaScript version — a type-safe app that behaves differently is not a successful migration.

**Questions** (depend on the tasks above)

- [ ] Show one specific type error you had to actually think about (not just silence with `any` or the `!` non-null assertion). What did it tell you about your code that plain JS review or testing hadn't?
- [ ] When (if ever) is reaching for `any` the right call during a migration like this, versus a sign you should model the type properly? Where did you draw that line?
- [ ] Did the migration reveal anything that was a genuine, previously-unnoticed bug (as opposed to just noise)? If yes, explain it. If no, explain how you're confident it was only noise.

---

## Demo 8 — GitHub Actions: development workflow

**Tasks**

- [ ] Write a GitHub Actions workflow that triggers on push (and/or pull request), checks out the repo, sets up Node.js at the right version, installs dependencies (with dependency caching), and runs your `lint` and a format-check (e.g. `prettier --check`).
- [ ] Push a commit that deliberately fails lint or format, and show the workflow **failing** in the Actions tab.
- [ ] Fix it and push again, and show the same workflow **passing**.

**Questions** (depend on the tasks above)

- [ ] What is the difference between a workflow, a job, and a step in GitHub Actions? Point to one of each in your workflow file.

      Workflow/Job/Step? → Workflow = die ganze ci.yml, Job = lint-and-format (eigene VM), Step = einzelne Aktionen wie "Run ESLint".

- [ ] Why should lint/format run in CI at all, if it already runs (or could run) on every developer's own machine before they push?

      Warum Lint/Format auch in CI? → Live erlebt: utils.ts war nicht formatiert, lokal nie aufgefallen, CI hat's automatisch erzwungen und den Build blockiert.

- [ ] What is dependency caching doing in your workflow, and what would happen (both correctness- and speed-wise) if you removed it?

      Was macht Caching? → Wiederverwendet node_modules zwischen Runs statt jedes Mal alles neu herunterzuladen — schneller, Korrektheit bleibt (Cache invalidiert sich am Lockfile).

---

## Demo 9 — GitHub Actions: deployment workflow

**Tasks**

- [ ] Write a second workflow that, on push to your main branch (or another trigger you choose and can justify), checks out the repo, installs dependencies, lints, builds (`vite build`), and deploys the `dist/` output to GitHub Pages (or an equivalent static host).
- [ ] Confirm the deployed URL actually serves the working app end-to-end, not just that the workflow reports success.
- [ ] Make a real change, push it, and show it going live via the workflow without any manual deployment step.

**Questions** (depend on the tasks above)

- [ ] Why does the deploy workflow re-run lint and build itself, instead of trusting "it already passed on my machine" or reusing Demo 8's workflow's result directly?
- [ ] What is the actual mechanism your deploy workflow uses to publish to GitHub Pages (e.g. a dedicated deploy action publishing an artifact, pushing to a `gh-pages` branch, or something else)? Explain, concretely, what it does.
- [ ] What would you need to change in this workflow if you were deploying to a different static host instead (e.g. Netlify, Vercel, a plain server over SFTP)? What would stay the same?

---

## Demo 10 — Workflow triggers, permissions & failure modes

**Tasks**

- [ ] Deliberately commit a real TypeScript error (or a lint failure) that should block deployment, push it, and show the deploy workflow failing *before* it reaches the deploy step.
- [ ] Identify exactly what permissions and/or secrets your deploy workflow needs to publish to GitHub Pages, and show where they're configured (repository settings, the `permissions:` key in the workflow file, etc.).
- [ ] Open the run history for both workflows and be ready to read a failed run's logs live and explain, to someone unfamiliar with it, what failed and why.

**Questions** (depend on the tasks above)

- [ ] When your build step fails, does the previously-deployed version of the app stay live, get taken down, or something else? Is that the behavior you want, and why?
- [ ] What GitHub Actions permission(s) or secret(s) does your deploy workflow actually need, and where did you grant/store them? What's the security risk of over-granting permissions here?
- [ ] What's the difference between triggering a workflow `on: push`, `on: pull_request`, and `on: workflow_dispatch`? Which did you use for the development workflow (Demo 8) and which for the deployment workflow (Demo 9), and why is that pairing the right one?

---

## What to bring to class

For each of the 10 demos: your changed code/config (ideally as commits you can diff live), the actual GitHub Actions run history for both workflows (not just the files), and the ticked checkboxes
above reflecting what you can genuinely demonstrate and answer *right now*. Be ready to trigger a real workflow run live (e.g. via a small commit) on request, not just describe
one that ran earlier.
