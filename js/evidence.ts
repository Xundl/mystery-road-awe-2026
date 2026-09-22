import {
  allEvidence,
  bookmarks,
  setFilteredEvidence,
  setSelectedEvidence,
  currentPage,
  viewRendered,
} from "../app.js";
import {
  saveBookmarksToStorage,
  saveNoteForEvidence,
  loadNoteForEvidence,
} from "./storage.js";
import {
  findEvidenceById,
  findPersonById,
  findLocationById,
  evidenceMentionsPerson,
  formatDate,
  getStatusBadgeClass,
  getRelevanceBadgeClass,
  getEl,
} from "./utils.js";
import type { Evidence } from "./types.js";

function getFilteredEvidence(): Evidence[] {
  const searchBox = document.getElementById(
    "evidenceSearch",
  ) as HTMLInputElement | null;
  const searchTerm = searchBox ? searchBox.value.toLowerCase().trim() : "";
  const typeVal = getEl<HTMLSelectElement>("filterType").value;
  const personVal = getEl<HTMLSelectElement>("filterPerson").value;
  const locationVal = getEl<HTMLSelectElement>("filterLocation").value;
  const statusVal = getEl<HTMLSelectElement>("filterStatus").value;
  const relevanceVal = getEl<HTMLSelectElement>("filterRelevance").value;
  const sortSelectEl = document.getElementById(
    "sortEvidence",
  ) as HTMLSelectElement | null;
  const sortVal = sortSelectEl ? sortSelectEl.value : "date-desc";

  const results: Evidence[] = [];
  for (let i = 0; i < allEvidence.length; i++) {
    const item = allEvidence[i];
    let matches = true;

    if (searchTerm) {
      const haystack = (
        item.title +
        " " +
        item.summary +
        " " +
        item.tags.join(" ")
      ).toLowerCase();
      if (haystack.indexOf(searchTerm) === -1) matches = false;
    }
    if (matches && typeVal && item.type.toLowerCase() !== typeVal)
      matches = false;
    if (matches && personVal) {
      const person = findPersonById(personVal);
      if (!person || !evidenceMentionsPerson(item, person)) matches = false;
    }
    if (matches && locationVal && item.locationIds.indexOf(locationVal) === -1)
      matches = false;
    if (matches && statusVal && (item.status || "").toLowerCase() !== statusVal)
      matches = false;
    if (
      matches &&
      relevanceVal &&
      (item.relevance || "").toLowerCase() !== relevanceVal
    )
      matches = false;

    if (matches) results.push(item);
  }

  if (sortVal === "title-asc") {
    results.sort((a, b) => a.title.localeCompare(b.title));
  } else if (sortVal === "title-desc") {
    results.sort((a, b) => b.title.localeCompare(a.title));
  } else if (sortVal === "date-asc") {
    results.sort(
      (a, b) =>
        new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
    );
  } else {
    results.sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
    );
  }

  setFilteredEvidence(results);
  return results;
}

export function applyStoredBookmarkFlags() {
  for (let i = 0; i < allEvidence.length; i++) {
    allEvidence[i].bookmarked = bookmarks.indexOf(allEvidence[i].id) !== -1;
  }
}

export function renderEvidenceList() {
  const container = document.getElementById("evidenceList");
  if (!container) return;

  const results = getFilteredEvidence();

  let html = "";
  if (results.length === 0) {
    html = "<p>No evidence matches the current filters.</p>";
  }
  for (let i = 0; i < results.length; i++) {
    html += renderEvidenceCardHTML(results[i]);
  }
  container.innerHTML = html;

  container.addEventListener("click", handleEvidenceListClick);
}

function renderEvidenceCardHTML(ev: Evidence): string {
  const isBookmarked = bookmarks.indexOf(ev.id) !== -1;
  let html = '<div class="evidence-card" data-id="' + ev.id + '">';
  html +=
    '<button class="bookmark-btn ' +
    (isBookmarked ? "active" : "") +
    '" data-action="bookmark" data-id="' +
    ev.id +
    '" aria-label="Toggle bookmark for ' +
    ev.title +
    '"><span class="bookmark-icon">' +
    (isBookmarked ? "★" : "☆") +
    "</span></button>";
  html += "<h3>" + ev.title + "</h3>";
  html +=
    '<div class="evidence-meta">' +
    ev.id +
    " &middot; " +
    ev.type +
    " &middot; " +
    formatDate(ev.timestamp) +
    "</div>";
  html += '<div class="evidence-summary">' + ev.summary + "</div>";

  if (ev.tags.indexOf("critical") !== -1) {
    html += '<span class="badge badge-critical">Critical</span>';
  }
  html +=
    '<span class="badge ' +
    getStatusBadgeClass(ev.status) +
    '">' +
    ev.status +
    "</span>";
  html +=
    '<span class="badge ' +
    getRelevanceBadgeClass(ev.relevance) +
    '">' +
    ev.relevance +
    "</span>";
  html += "<div>";
  for (let t = 0; t < ev.tags.length; t++) {
    html += '<span class="tag-chip">' + ev.tags[t] + "</span>";
  }
  html += "</div></div>";
  return html;
}

function handleEvidenceListClick(event: Event) {
  const target = event.target as HTMLElement;
  if (
    target.dataset &&
    target.dataset.action === "bookmark" &&
    target.dataset.id
  ) {
    event.stopPropagation();
    handleBookmarkClick(target.dataset.id);
    return;
  }
  const card = target.closest(".evidence-card");
  if (card) openEvidenceDetail(card.getAttribute("data-id") || "");
}

function handleBookmarkClick(evidenceId: string) {
  const ev = findEvidenceById(evidenceId);
  if (!ev) return;

  const idx = bookmarks.indexOf(evidenceId);
  if (idx === -1) {
    bookmarks.push(evidenceId);
    ev.bookmarked = true;
  } else {
    bookmarks.splice(idx, 1);
    ev.bookmarked = false;
  }
  saveBookmarksToStorage();
  if (currentPage === "evidence") renderEvidenceList();
}

export function handleSortChange() {
  renderEvidenceList();
}

export function clearFilters() {
  getEl<HTMLInputElement>("evidenceSearch").value = "";
  getEl<HTMLSelectElement>("filterType").value = "";
  getEl<HTMLSelectElement>("filterPerson").value = "";
  getEl<HTMLSelectElement>("filterLocation").value = "";
  getEl<HTMLSelectElement>("filterStatus").value = "";
  getEl<HTMLSelectElement>("filterRelevance").value = "";
  renderEvidenceList();
}

function simulateAsyncSearch(term: string): Promise<string> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(term), 300);
  });
}

let latestSearchRequestId = 0;

export function handleSearchInput(event: Event) {
  const target = event.target as HTMLInputElement;
  const term = target.value;
  const requestId = ++latestSearchRequestId;

  simulateAsyncSearch(term).then(() => {
    if (requestId !== latestSearchRequestId) return;
    renderEvidenceList();
  });
}

export function openEvidenceDetail(evidenceId: string) {
  const ev = findEvidenceById(evidenceId);
  if (!ev) return;
  setSelectedEvidence(ev);

  const section = document.getElementById("evidenceDetailSection");
  if (!section) return;
  section.classList.remove("hidden");

  renderEvidenceDetail(ev);
  section.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function closeEvidenceDetail() {
  const section = document.getElementById("evidenceDetailSection");
  if (!section) return;
  section.classList.add("hidden");
  section.innerHTML = "";
  setSelectedEvidence(null);
}

function renderEvidenceDetail(ev: Evidence) {
  const section = document.getElementById("evidenceDetailSection");
  if (!section) return;

  const personNames = ev.personIds.map((id) => {
    const person = findPersonById(id);
    return person ? person.name : id;
  });

  const locationNames = ev.locationIds.map((id) => {
    const loc = findLocationById(id);
    return loc ? loc.id + " - " + loc.name : id;
  });

  let tagsHtml = "";
  for (let t = 0; t < ev.tags.length; t++) {
    tagsHtml += '<span class="tag-chip">' + ev.tags[t] + "</span>";
  }

  const storedNote = loadNoteForEvidence(ev.id);

  let html = "";
  html += '<div class="evidence-detail-header">';
  html += "<div><h2>" + ev.title + "</h2>";
  html +=
    '<div class="evidence-meta">' +
    ev.id +
    " &middot; " +
    ev.type +
    " &middot; " +
    formatDate(ev.timestamp) +
    "</div></div>";
  html +=
    '<button type="button" class="btn btn-secondary btn-small" onclick="closeEvidenceDetail()">Close</button>';
  html += "</div>";

  if (ev.tags.indexOf("critical") !== -1) {
    html +=
      '<div class="warning-banner">This item is tagged as critical evidence.</div>';
  }

  html +=
    '<div class="detail-field"><strong>Summary</strong>' +
    ev.summary +
    "</div>";
  html += '<div class="evidence-detail-content">' + ev.content + "</div>";
  html +=
    '<div class="detail-field"><strong>Related people</strong>' +
    personNames.join(", ") +
    "</div>";
  html +=
    '<div class="detail-field"><strong>Related locations</strong>' +
    locationNames.join(", ") +
    "</div>";
  html +=
    '<div class="detail-field"><strong>Tags</strong>' + tagsHtml + "</div>";

  html += '<div class="detail-field"><strong>Review status</strong>';
  html += '<select id="detailStatusSelect">';
  html += statusOptionHTML(ev.status, "unreviewed", "Unreviewed");
  html += statusOptionHTML(ev.status, "reviewed", "Reviewed");
  html += statusOptionHTML(ev.status, "flagged", "Flagged");
  html += "</select></div>";

  html += '<div class="detail-field"><strong>Relevance</strong>';
  html += '<select id="detailRelevanceSelect">';
  html += statusOptionHTML(ev.relevance, "unknown", "Unknown");
  html += statusOptionHTML(ev.relevance, "relevant", "Relevant");
  html += statusOptionHTML(ev.relevance, "irrelevant", "Irrelevant");
  html += "</select></div>";

  html += '<div class="detail-field"><strong>Investigator note</strong>';
  html +=
    '<textarea id="evidenceNoteInput" class="note-textarea" rows="3" data-evidence-id="' +
    ev.id +
    '" placeholder="Add a private note about this evidence...">' +
    storedNote +
    "</textarea>";
  html +=
    '<button type="button" class="btn btn-primary btn-small" style="margin-top:6px;" onclick="saveCurrentNote()">Save note</button>';
  html += "</div>";

  html +=
    '<div class="detail-field"><strong>Note preview</strong><div id="notePreview">' +
    storedNote +
    "</div></div>";

  section.innerHTML = html;

  getEl<HTMLSelectElement>("detailStatusSelect").addEventListener(
    "change",
    (e) => {
      ev.status = (e.target as HTMLSelectElement).value;
      renderEvidenceDetail(ev);
      if (viewRendered.evidence) renderEvidenceList();
    },
  );
  getEl<HTMLSelectElement>("detailRelevanceSelect").addEventListener(
    "change",
    (e) => {
      ev.relevance = (e.target as HTMLSelectElement).value;
      renderEvidenceDetail(ev);
      if (viewRendered.evidence) renderEvidenceList();
    },
  );
}

function statusOptionHTML(
  current: string | undefined,
  value: string,
  label: string,
): string {
  const currentLower = (current || "").toLowerCase();
  const selected = currentLower === value ? " selected" : "";
  return '<option value="' + value + '"' + selected + ">" + label + "</option>";
}

export function saveCurrentNote() {
  const textarea = document.getElementById(
    "evidenceNoteInput",
  ) as HTMLTextAreaElement | null;
  if (!textarea) return;
  const evidenceId = textarea.getAttribute("data-evidence-id") || "";
  const text = textarea.value;
  saveNoteForEvidence(evidenceId, text);
  const preview = document.getElementById("notePreview");
  if (preview) preview.innerHTML = text;
}
