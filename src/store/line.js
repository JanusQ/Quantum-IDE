import { create } from 'zustand'

export const lineIndexStore = create((set) => ({
  lineIndex: 0,
  updateLineIndex: (newlineIndex) => set({ lineIndex: newlineIndex }),
}))

export const labelsStroe = create((set) => ({
  labels: null,
  updateLabels: (value) =>
    set({
      labels: value,
    }),
}))
