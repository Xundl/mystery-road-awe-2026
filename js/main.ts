import { loadBookmarksFromStorage, loadNotesFromStorage } from "./storage.js";
import { loadAllData } from "./data.js";
import { navigateTo, handleHashChange } from "./navigation.js";
import {
  renderEvidenceList,
  handleSearchInput,
  clearFilters,
  handleSortChange,
  saveCurrentNote,
  closeEvidenceDetail,
} from "./evidence.js";
import { renderTimeline } from "./timeline.js";
import { switchPeopleTab } from "./people.js";
import { saveHypothesis } from "./workspace.js";
import { loadNoteAsync } from "../app.js";
import { getEl } from "./utils.js";

window.navigateTo = navigateTo;
window.switchPeopleTab = switchPeopleTab;
window.saveHypothesis = saveHypothesis;
window.handleSortChange = handleSortChange;
window.saveCurrentNote = saveCurrentNote;
window.closeEvidenceDetail = closeEvidenceDetail;

function setupEventListeners() {
  window.addEventListener("hashchange", handleHashChange);

  const navButtons = document.querySelectorAll(".nav-btn");
  navButtons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      const targetView = btn.getAttribute("data-view");
      console.log("nav clicked:", targetView);
    });
  });

  getEl("evidenceSearch").addEventListener("input", handleSearchInput);

  getEl("filterType").addEventListener("change", renderEvidenceList);
  getEl("filterPerson").addEventListener("change", renderEvidenceList);
  getEl("filterLocation").addEventListener("change", renderEvidenceList);
  getEl("filterStatus").addEventListener("change", renderEvidenceList);
  getEl("filterRelevance").addEventListener("change", renderEvidenceList);

  getEl("clearFiltersBtn").addEventListener("click", clearFilters);

  getEl("timelineOrder").addEventListener("change", renderTimeline);
  getEl("timelinePersonFilter").addEventListener("change", renderTimeline);
  getEl("timelineLocationFilter").addEventListener("change", renderTimeline);
  getEl("timelineTypeFilter").addEventListener("change", renderTimeline);

  getEl<HTMLInputElement>("hypConfidence").addEventListener("input", (e) => {
    getEl("hypConfidenceValue").textContent = (
      e.target as HTMLInputElement
    ).value;
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
