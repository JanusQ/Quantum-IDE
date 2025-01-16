import { create } from 'zustand'

export const lineIndexStore = create((set) => ({
  lineIndex: null,
  updateLineIndex: (newlineIndex) => set({ lineIndex: newlineIndex }),
}))

export const labelsStroe = create((set) => ({
  labels: null,
  updateLabels: (value) =>
    set({
      labels: value,
    }),
}))
