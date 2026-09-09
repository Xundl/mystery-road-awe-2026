import { loadBookmarksFromStorage, loadNotesFromStorage } from "./storage.js";
import { loadAllData } from "./data.js";
import { navigateTo, handleHashChange } from "./navigation.js";
import {
  renderEvidenceList,
  handleSearchInput,
  clearFilters,
  handleSortChange,
  saveCurrentNote,
  closeEvidenceDetail
} from "./evidence.js";
import { renderTimeline } from "./timeline.js";
import { switchPeopleTab } from "./people.js";
import { saveHypothesis } from "./workspace.js";
import { loadNoteAsync } from "../app.js";

window.navigateTo = navigateTo;
window.switchPeopleTab = switchPeopleTab;
window.saveHypothesis = saveHypothesis;
window.handleSortChange = handleSortChange;
window.saveCurrentNote = saveCurrentNote;
window.closeEvidenceDetail = closeEvidenceDetail;

function setupEventListeners() {
  window.addEventListener("hashchange", handleHashChange);

// --- DEMO 4 BUGFIX ---
// Original: for (var i = 0; i < navButtons.length; i++) { ... }
// var ist funktions-gescoped, alle Klick-Callbacks teilten sich
// dasselbe i. Nach Schleifenende war i === navButtons.length, also
// navButtons[i] undefined -> TypeError beim Klicken.
// Fix: forEach übergibt jedem Callback sein Element direkt als
// Parameter (btn) - kein gemeinsames i mehr, das schiefgehen kann.
  const navButtons = document.querySelectorAll(".nav-btn");
  navButtons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      const targetView = btn.getAttribute("data-view");
      console.log("nav clicked:", targetView);
    });
  });

  document.getElementById("evidenceSearch").addEventListener("input", handleSearchInput);

  document.getElementById("filterType").addEventListener("change", renderEvidenceList);
  document.getElementById("filterPerson").addEventListener("change", renderEvidenceList);
  document.getElementById("filterLocation").addEventListener("change", renderEvidenceList);
  document.getElementById("filterStatus").addEventListener("change", renderEvidenceList);
  document.getElementById("filterRelevance").addEventListener("change", renderEvidenceList);

  document.getElementById("clearFiltersBtn").addEventListener("click", clearFilters);

  document.getElementById("timelineOrder").addEventListener("change", renderTimeline);
  document.getElementById("timelinePersonFilter").addEventListener("change", renderTimeline);
  document.getElementById("timelineLocationFilter").addEventListener("change", renderTimeline);
  document.getElementById("timelineTypeFilter").addEventListener("change", renderTimeline);

  document.getElementById("hypConfidence").addEventListener("input", (e) => {
    document.getElementById("hypConfidenceValue").textContent = e.target.value;
  });
}

function initApp() {
  loadBookmarksFromStorage();
  loadNotesFromStorage();
  setupEventListeners();

  loadAllData().then(function () {
    handleHashChange();
    const firstNote = loadNoteAsync("E01");
    console.log("First note preview:", firstNote);
  });
}

window.addEventListener("DOMContentLoaded", initApp);
window.addEventListener("hashchange", handleHashChange);