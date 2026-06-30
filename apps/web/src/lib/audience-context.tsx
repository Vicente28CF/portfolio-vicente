"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export type Audience = "recruiter" | "client";

interface AudienceContextType {
  audience: Audience;
  setAudience: (a: Audience) => void;
}

const AudienceContext = createContext<AudienceContextType | undefined>(undefined);

export function AudienceProvider({ children }: { children: React.ReactNode }) {
  const [audience, setAudienceState] = useState<Audience>("recruiter");

  useEffect(() => {
    try {
      const stored = window.sessionStorage.getItem("audience") as Audience;
      if (stored === "recruiter" || stored === "client") {
        setAudienceState(stored);
      }
    } catch (e) {
      console.warn("sessionStorage is not available", e);
    }
  }, []);

  const setAudience = (a: Audience) => {
    setAudienceState(a);
    try {
      window.sessionStorage.setItem("audience", a);
    } catch (e) {
      console.warn("sessionStorage is not available", e);
    }
  };

  return (
    <AudienceContext.Provider value={{ audience, setAudience }}>
      {children}
    </AudienceContext.Provider>
  );
}

export function useAudience() {
  const context = useContext(AudienceContext);
  if (context === undefined) {
    throw new Error("useAudience must be used within an AudienceProvider");
  }
  return context;
}
