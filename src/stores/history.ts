import { defineStore } from 'pinia'
import { ref } from 'vue'

import type { Receipt } from '@/entities/receipt/model'
import type { Person } from '@/stores/people'

const STORAGE_KEY = 'bill-splitter-history'

export interface HistoryEntry {
  id: string
  label: string
  timestamp: number
  receipt: Receipt
  people: Person[]
}

function loadHistory(): HistoryEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    return JSON.parse(raw) as HistoryEntry[]
  } catch {
    return []
  }
}

function saveHistory(entries: HistoryEntry[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries))
}

export const useHistoryStore = defineStore('history', () => {
  const entries = ref<HistoryEntry[]>(loadHistory())

  function saveEntry(label: string, receipt: Receipt, people: Person[]) {
    const entry: HistoryEntry = {
      id: crypto.randomUUID(),
      label,
      timestamp: Date.now(),
      receipt: JSON.parse(JSON.stringify(receipt)),
      people: JSON.parse(JSON.stringify(people)),
    }
    entries.value.unshift(entry)
    saveHistory(entries.value)
  }

  function deleteEntry(id: string) {
    entries.value = entries.value.filter((e) => e.id !== id)
    saveHistory(entries.value)
  }

  function clearHistory() {
    entries.value = []
    saveHistory(entries.value)
  }

  return {
    entries,
    saveEntry,
    deleteEntry,
    clearHistory,
  }
})
