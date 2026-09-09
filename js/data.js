import {
  setCaseData,
  setAllPeople,
  setAllLocations,
  setAllEvidence,
  setAllTimeline,
  setEvidenceViewLoading,
  setFilteredEvidence,
  currentPage,
  populateAllDropdowns
} from "../app.js";

import { 
    renderDashboard
} from "./dashboard.js";

import { 
    applyStoredBookmarkFlags,
    renderEvidenceList 
} from "./evidence.js";

import { 
    renderTimeline 
} from "./timeline.js";

let loadingStepsRemaining = 2;

export function showLoadingOverlay(msg) {
  const overlay = document.getElementById("loadingOverlay");
  const text = document.getElementById("loadingText");
  if (text) text.textContent = msg;
  if (overlay) overlay.classList.remove("hidden");
}

function hideLoadingStep() {
  loadingStepsRemaining--;
  if (loadingStepsRemaining <= 0) {
    const overlay = document.getElementById("loadingOverlay");
    if (overlay) overlay.classList.add("hidden");
  }
}

async function loadCorePeopleAndLocations() {
  const caseRes = await fetch("data/case.json");
  //const caseJson = caseRes.json();
  const caseJson = await caseRes.json();
  setCaseData(caseJson);

  const peopleRes = await fetch("data/people.json");
  const peopleJson = await peopleRes.json();
  setAllPeople(peopleJson);

  const locationsRes = await fetch("data/locations.json");
  const locationsJson = await locationsRes.json();
  setAllLocations(locationsJson);

  hideLoadingStep();
  renderDashboard();
  populateAllDropdowns();
}

async function loadEvidenceData() {
  try {
    const res = await fetch("data/evidence.json");
    const data = await res.json();

    setAllEvidence(data);
    applyStoredBookmarkFlags();
    setFilteredEvidence(data.slice());
    setEvidenceViewLoading(false);
    renderDashboard();
    populateAllDropdowns();
    if (currentPage === "evidence") renderEvidenceList();
  } catch (err) {
    console.error("Failed to load evidence.json", err);
    alert("Evidence could not be loaded. Some views may be incomplete.");
  }
}

function loadTimelineData() {
  return fetch("data/timeline.json")
    .then(function (res) { return res.json(); })
    .then(function (data) {
      setAllTimeline(data);
      renderDashboard();
      if (currentPage === "timeline") renderTimeline();
      populateAllDropdowns();
    })
    .catch(function (err) {
      console.log("timeline load error", err);
    })
    .finally(function () {
      hideLoadingStep();
    });
}

export function loadAllData() {
  showLoadingOverlay("Loading case file…");
  loadingStepsRemaining = 2;
  return loadCorePeopleAndLocations().then(function () {
    loadEvidenceData();
    loadTimelineData();
  });
}