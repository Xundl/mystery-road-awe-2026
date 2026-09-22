import {
  allEvidence,
  allPeople,
  notesStore,
  STORAGE_KEY_HYPOTHESIS,
} from "../app.js";
import { openEvidenceDetail } from "./evidence.js";
import { getEl } from "./utils.js";

export function renderWorkspace() {
  renderBookmarksList();
  renderNotesList();
  populateHypothesisDropdowns();
  loadHypothesisFromStorage();
}

function renderBookmarksList() {
  const container = document.getElementById("bookmarksList");
  if (!container) return;

  const bookmarkedItems = allEvidence.filter(function (ev) {
    return ev.bookmarked;
  });

  if (bookmarkedItems.length === 0) {
    container.innerHTML =
      "<p>No bookmarked evidence yet. Bookmark items from the Evidence view.</p>";
    return;
  }

  let html = "";
  for (let i = 0; i < bookmarkedItems.length; i++) {
    const ev = bookmarkedItems[i];
    html +=
      '<div class="mini-list-item"><strong>' +
      ev.id +
      "</strong> &mdash; " +
      ev.title +
      ' <button type="button" class="btn btn-small btn-secondary" data-open-evidence="' +
      ev.id +
      '">Open</button></div>';
  }
  container.innerHTML = html;

  const openButtons = container.querySelectorAll("[data-open-evidence]");
  for (let b = 0; b < openButtons.length; b++) {
    openButtons[b].addEventListener("click", function (e) {
      window.navigateTo("evidence");
      const target = e.target as HTMLElement;
      const id = target.getAttribute("data-open-evidence") || "";
      setTimeout(function () {
        openEvidenceDetail(id);
      }, 0);
    });
  }
}

function renderNotesList() {
  const container = document.getElementById("notesList");
  if (!container) return;

  const noteEntries: {
    index: number;
    evidenceId: string;
    title: string;
    text: string;
  }[] = [];
  for (let i = 0; i < allEvidence.length; i++) {
    const note = notesStore[allEvidence[i].id];
    if (note) {
      noteEntries.push({
        index: i,
        evidenceId: allEvidence[i].id,
        title: allEvidence[i].title,
        text: note,
      });
    }
  }

  if (noteEntries.length === 0) {
    container.innerHTML =
      "<p>No notes yet. Add one from an evidence item's detail view.</p>";
    return;
  }

  let html = "";
  for (let n = 0; n < noteEntries.length; n++) {
    const entry = noteEntries[n];
    html +=
      '<div class="mini-list-item"><strong>' +
      entry.evidenceId +
      "</strong> &mdash; " +
      entry.title;
    html +=
      '<div id="noteText-' + entry.index + '">' + entry.text + "</div></div>";
  }
  container.innerHTML = html;
}

export function populateHypothesisDropdowns() {
  const suspectSelect = document.getElementById(
    "hypSuspect",
  ) as HTMLSelectElement | null;
  const evidenceSelect = document.getElementById(
    "hypEvidence",
  ) as HTMLSelectElement | null;
  if (!suspectSelect || !evidenceSelect) return;

  const currentSuspect = suspectSelect.value;
  suspectSelect.innerHTML = '<option value="">Select a person…</option>';
  for (let p = 0; p < allPeople.length; p++) {
    suspectSelect.innerHTML +=
      '<option value="' +
      allPeople[p].id +
      '">' +
      allPeople[p].name +
      "</option>";
  }
  suspectSelect.value = currentSuspect;

  evidenceSelect.innerHTML = "";
  for (let i = 0; i < allEvidence.length; i++) {
    evidenceSelect.innerHTML +=
      '<option value="' +
      allEvidence[i].id +
      '">' +
      allEvidence[i].id +
      " - " +
      allEvidence[i].title +
      "</option>";
  }
}

export function saveHypothesis() {
  const draft = {
    suspectId: getEl<HTMLSelectElement>("hypSuspect").value,
    nature: getEl<HTMLSelectElement>("hypNature").value,
    evidenceIds: getSelectedOptions(getEl<HTMLSelectElement>("hypEvidence")),
    confidence: getEl<HTMLInputElement>("hypConfidence").value,
    explanation: getEl<HTMLTextAreaElement>("hypExplanation").value,
    alternative: getEl<HTMLTextAreaElement>("hypAlternative").value,
    savedAt: new Date().toISOString(),
  };

  try {
    localStorage.setItem(STORAGE_KEY_HYPOTHESIS, JSON.stringify(draft));
  } catch (err) {
    console.error("Could not save hypothesis draft", err);
    alert("Your hypothesis could not be saved to local storage.");
    return;
  }

  const msg = document.getElementById("hypothesisSavedMsg");
  if (!msg) return;
  msg.classList.remove("hidden");
  setTimeout(function () {
    msg.classList.add("hidden");
  }, 2000);
}

function getSelectedOptions(selectEl: HTMLSelectElement): string[] {
  const result: string[] = [];
  for (let i = 0; i < selectEl.options.length; i++) {
    if (selectEl.options[i].selected) result.push(selectEl.options[i].value);
  }
  return result;
}

function loadHypothesisFromStorage() {
  const raw = localStorage.getItem(STORAGE_KEY_HYPOTHESIS);
  if (!raw) return;

  const draft = JSON.parse(raw);

  getEl<HTMLSelectElement>("hypSuspect").value = draft.suspectId || "";
  getEl<HTMLSelectElement>("hypNature").value = draft.nature || "";
  getEl<HTMLInputElement>("hypConfidence").value = String(
    draft.confidence || 50,
  );
  getEl("hypConfidenceValue").textContent = String(draft.confidence || 50);
  getEl<HTMLTextAreaElement>("hypExplanation").value = draft.explanation || "";
  getEl<HTMLTextAreaElement>("hypAlternative").value = draft.alternative || "";

  const evidenceSelect = getEl<HTMLSelectElement>("hypEvidence");
  const savedIds: string[] = draft.evidenceIds || [];
  for (let i = 0; i < evidenceSelect.options.length; i++) {
    evidenceSelect.options[i].selected =
      savedIds.indexOf(evidenceSelect.options[i].value) !== -1;
  }
}
