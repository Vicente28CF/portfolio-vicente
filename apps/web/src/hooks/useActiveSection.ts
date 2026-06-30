"use client";

import { useEffect, useSyncExternalStore } from "react";

const SECTION_IDS = [
  "hero",
  "stack",
  "github-activity",
  "servicios",
  "projects",
  "compatibilidad",
  "demo",
  "contact",
];

const NAVBAR_HEIGHT = 80;

let currentId = "hero";
const listeners = new Set<(id: string) => void>();
let observer: IntersectionObserver | null = null;

function subscribe(cb: (id: string) => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

function getSnapshot() {
  return currentId;
}

function findActiveSection(): string {
  let bestId = SECTION_IDS[0];
  let bestDist = Infinity;

  for (const id of SECTION_IDS) {
    const el = document.getElementById(id);
    if (!el) continue;

    const rect = el.getBoundingClientRect();

    if (rect.bottom <= NAVBAR_HEIGHT || rect.top >= window.innerHeight) continue;

    const dist = Math.abs(rect.top - NAVBAR_HEIGHT);
    if (dist < bestDist) {
      bestDist = dist;
      bestId = id;
    }
  }

  return bestId;
}

function startObserving() {
  const els = SECTION_IDS.map((id) => document.getElementById(id)).filter(
    (el): el is HTMLElement => el !== null,
  );
  if (els.length === 0) return;

  observer = new IntersectionObserver(
    () => {
      const id = findActiveSection();
      if (id !== currentId) {
        currentId = id;
        for (const fn of listeners) fn(currentId);
      }
    },
    { threshold: [0, 0.25, 0.5, 0.75, 1] },
  );

  for (const el of els) observer.observe(el);
}

function stopObserving() {
  if (observer) {
    observer.disconnect();
    observer = null;
  }
}

export function useActiveSection(): string {
  useEffect(() => {
    if (!observer) startObserving();
    return () => {
      if (listeners.size === 0) stopObserving();
    };
  }, []);

  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}
