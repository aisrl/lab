'use client';

import { useSyncExternalStore } from 'react';

// Per-lab progress. Every graded element on a lab page (quiz, fill in the blank, short answer,
// autograder) registers the points it is worth and awards the points a learner earns. Earned
// points live in this browser's local storage; nothing is sent anywhere.

export type LabSnapshot = { earned: number; total: number; items: Record<string, number> };

const EMPTY: LabSnapshot = { earned: 0, total: 0, items: {} };
const listeners = new Set<() => void>();
const cache = new Map<string, LabSnapshot>();
const maxes = new Map<string, Map<string, number>>();

const key = (labId: string) => `aisrl_progress_${labId}`;

function readItems(labId: string): Record<string, number> {
  try {
    const raw = localStorage.getItem(key(labId));
    return raw ? (JSON.parse(raw) as Record<string, number>) : {};
  } catch {
    return {};
  }
}

function compute(labId: string): LabSnapshot {
  const items = readItems(labId);
  const registered = maxes.get(labId) ?? new Map<string, number>();
  let total = 0;
  let earned = 0;
  registered.forEach((max, id) => {
    total += max;
    earned += Math.min(items[id] ?? 0, max);
  });
  return { earned, total, items };
}

function emit(labId: string) {
  cache.set(labId, compute(labId));
  listeners.forEach((l) => l());
}

export function registerItem(labId: string, id: string, max: number) {
  const m = maxes.get(labId) ?? new Map<string, number>();
  if (m.get(id) === max) return;
  m.set(id, max);
  maxes.set(labId, m);
  emit(labId);
}

export function getItemPoints(labId: string, id: string): number {
  return readItems(labId)[id] ?? 0;
}

// Keeps the best result, so a retry can never lower a score.
export function awardPoints(labId: string, id: string, points: number) {
  const items = readItems(labId);
  if ((items[id] ?? 0) >= points) return;
  items[id] = points;
  try {
    localStorage.setItem(key(labId), JSON.stringify(items));
  } catch {
    /* storage unavailable: the points last for this visit only */
  }
  emit(labId);
}

export function resetLab(labId: string) {
  try {
    localStorage.removeItem(key(labId));
  } catch {
    /* nothing to clear */
  }
  emit(labId);
  window.dispatchEvent(new CustomEvent('aisrl_lab_reset', { detail: { labId } }));
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
}

export function useLabProgress(labId: string): LabSnapshot {
  return useSyncExternalStore(
    subscribe,
    () => cache.get(labId) ?? EMPTY,
    () => EMPTY,
  );
}
