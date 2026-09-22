export {};

declare global {
  interface Window {
    navigateTo: (viewName: string) => void;
    switchPeopleTab: (tab: string) => void;
    saveHypothesis: () => void;
    handleSortChange: () => void;
    saveCurrentNote: () => void;
    closeEvidenceDetail: () => void;
  }
}