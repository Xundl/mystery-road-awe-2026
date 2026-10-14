Demo 6: Struktur "by feature":
app/ (Shell), components/ (geteilt), data/ (Daten laden),features/ (dashboard, team, timeline)

# Architecture (React part)

```
src/
  main.tsx              entry: createRoot(...).render(<App />)
  app/                  app shell: App (router), Header, NavBar
  components/           shared UI used by 2+ features: Card, Badge, StubPage
  data/                 data loading (useCaseData) - placeholder until Ex. 5
  features/
    dashboard/          DashboardPage, CaseSummaryCard, StatCard, ProgressBar
    team/               TeamPage (tabs), PeopleList, PersonCard, PersonDetailPage,
                        LocationList, LocationCard
    timeline/           TimelinePage, TimelineFilters, TimelineList, TimelineEventCard
```

**Rule shared vs. feature-local:** a component lives in its feature folder until a
second feature needs it; then it moves to `components/`. Example feature-local:
`PersonCard` (only team). Example shared: `Badge` (Dashboard + Timeline), `Card`
(all three features).

**Routes (HashRouter, bookmarkable):** `/dashboard`, `/team/people`,
`/team/people/:personId`, `/team/locations`, `/timeline?person=<id>`; unknown URL
redirects to `/dashboard`.
