// ---------------------------------------------------------------------
// GLOBAL STATE
// ---------------------------------------------------------------------
import {
  findEvidenceById,
  findPersonById,
  findLocationById,
  evidenceMentionsPerson,
  formatDate,
  getStatusBadgeClass,
  getRelevanceBadgeClass
} from "./js/utils.js";

import {
  saveBookmarksToStorage,
  loadBookmarksFromStorage,
  saveNoteForEvidence,
  loadNoteForEvidence,
  loadNotesFromStorage
} from "./js/storage.js";

import {
  loadAllData 
} from "./js/data.js";

import {
  renderDashboard
} from "./js/dashboard.js";

import {
  renderEvidenceList,
  handleSortChange,
  clearFilters,
  handleSearchInput,
  openEvidenceDetail,
  closeEvidenceDetail,
  saveCurrentNote
} from "./js/evidence.js";

import { 
  switchPeopleTab,
  renderPeople,
  renderLocations
} from "./js/people.js";

import { 
  renderTimeline 
} from "./js/timeline.js";

import { 
  renderWorkspace,
  saveHypothesis,
  populateHypothesisDropdowns 
} from "./js/workspace.js";

import { 
  navigateTo,
  handleHashChange 
} from "./js/navigation.js";

export let allEvidence = [];
export let filteredEvidence = [];
export let selectedEvidence = null;
export const bookmarks = [];
export let currentPage = "dashboard";

export let allPeople = [];
export let allLocations = [];
export let allTimeline = [];
export let caseData = {};

export let currentPeopleTab = "people";


let evidenceViewLoading = true;


export const viewRendered = {
  dashboard: false,
  evidence: false,
  people: false,
  timeline: false,
  workspace: false
};

export const notesStore = {}; 

export const STORAGE_KEY_BOOKMARKS = "remotion_bookmarks";
export const STORAGE_KEY_NOTES = "remotion_notes";
export const STORAGE_KEY_HYPOTHESIS = "remotion_hypothesis";

export function setAllEvidence(data) { allEvidence = data; }
export function setAllPeople(data) { allPeople = data; }
export function setAllLocations(data) { allLocations = data; }
export function setAllTimeline(data) { allTimeline = data; }
export function setCaseData(data) { caseData = data; }
export function setEvidenceViewLoading(val) { evidenceViewLoading = val; }
export function setFilteredEvidence(data) { filteredEvidence = data; }
export function setSelectedEvidence(ev) { selectedEvidence = ev; }
export function setCurrentPeopleTab(tab) { currentPeopleTab = tab; }
export function setCurrentPage(page) { currentPage = page; }

export let modalCloseListenerCount = 0;
export function incrementModalCloseListenerCount() {
  modalCloseListenerCount++;
  return modalCloseListenerCount;
}

// ---------------------------------------------------------------------
// EVIDENCE CATALOGUE
// ---------------------------------------------------------------------

export function populateAllDropdowns() {
  populateEvidenceDropdowns();
  populateTimelineDropdowns();
  populateHypothesisDropdowns();
}

function populateEvidenceDropdowns() {
  const typeSelect = document.getElementById("filterType");
  const personSelect = document.getElementById("filterPerson");
  const locationSelect = document.getElementById("filterLocation");
  if (!typeSelect || !personSelect || !locationSelect) return;

  const types = [];
  for (let i = 0; i < allEvidence.length; i++) {
    const t = allEvidence[i].type.toLowerCase();
    if (types.indexOf(t) === -1) types.push(t);
  }
  typeSelect.innerHTML = '<option value="">All types</option>';
  for (let ti = 0; ti < types.length; ti++) {
    typeSelect.innerHTML += '<option value="' + types[ti] + '">' + types[ti] + "</option>";
  }

  personSelect.innerHTML = '<option value="">All people</option>';
  for (let p = 0; p < allPeople.length; p++) {
    personSelect.innerHTML += '<option value="' + allPeople[p].id + '">' + allPeople[p].name + "</option>";
  }

  locationSelect.innerHTML = '<option value="">All locations</option>';
  for (let l = 0; l < allLocations.length; l++) {
    locationSelect.innerHTML += '<option value="' + allLocations[l].id + '">' + allLocations[l].id + " - " + allLocations[l].name + "</option>";
  }
}

// ---------------------------------------------------------------------
// TIMELINE
// ---------------------------------------------------------------------

function populateTimelineDropdowns() {
  const personSelect = document.getElementById("timelinePersonFilter");
  const locationSelect = document.getElementById("timelineLocationFilter");
  const typeSelect = document.getElementById("timelineTypeFilter");
  if (!personSelect || !locationSelect || !typeSelect) return;

  personSelect.innerHTML = '<option value="">All people</option>';
  for (let p = 0; p < allPeople.length; p++) {
    personSelect.innerHTML += '<option value="' + allPeople[p].id + '">' + allPeople[p].name + "</option>";
  }

  locationSelect.innerHTML = '<option value="">All locations</option>';
  for (let l = 0; l < allLocations.length; l++) {
    locationSelect.innerHTML += '<option value="' + allLocations[l].id + '">' + allLocations[l].id + "</option>";
  }

  const types = [];
  for (let i = 0; i < allTimeline.length; i++) {
    if (types.indexOf(allTimeline[i].type) === -1) types.push(allTimeline[i].type);
  }
  typeSelect.innerHTML = '<option value="">All event types</option>';
  for (let t = 0; t < types.length; t++) {
    typeSelect.innerHTML += '<option value="' + types[t] + '">' + types[t] + "</option>";
  }
}


// ---------------------------------------------------------------------
// LOCAL STORAGE HELPERS (bookmarks & notes)
// ---------------------------------------------------------------------

export function loadNoteAsync(evidenceId) {
  return new Promise(function (resolve) {
    resolve(notesStore[evidenceId] || "");
  });
}
