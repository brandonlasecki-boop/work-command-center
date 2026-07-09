"use client";

import { createContext, useContext, useState } from "react";

type ProjectPhaseFilterContextValue = {
  selectedPhaseId: string | null;
  selectPhase: (phaseId: string) => void;
  clearPhase: () => void;
};

const ProjectPhaseFilterContext = createContext<ProjectPhaseFilterContextValue | null>(null);

export function ProjectPhaseFilterProvider({ children }: { children: React.ReactNode }) {
  const [selectedPhaseId, setSelectedPhaseId] = useState<string | null>(null);

  function selectPhase(phaseId: string) {
    setSelectedPhaseId((current) => (current === phaseId ? null : phaseId));
  }

  function clearPhase() {
    setSelectedPhaseId(null);
  }

  return (
    <ProjectPhaseFilterContext.Provider value={{ selectedPhaseId, selectPhase, clearPhase }}>
      {children}
    </ProjectPhaseFilterContext.Provider>
  );
}

export function useProjectPhaseFilter() {
  const context = useContext(ProjectPhaseFilterContext);
  if (!context) {
    throw new Error("useProjectPhaseFilter must be used within ProjectPhaseFilterProvider");
  }
  return context;
}
