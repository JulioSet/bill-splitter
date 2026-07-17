<template>
  <div class="mx-auto max-w-4xl space-y-6 text-slate-900">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold">History</h1>
      <Button
        v-if="historyStore.entries.length > 0"
        label="Clear All"
        icon="pi pi-trash"
        size="small"
        severity="danger"
        outlined
        @click="historyStore.clearHistory()"
      />
    </div>

    <div
      v-if="historyStore.entries.length === 0"
      class="rounded-2xl bg-white border border-slate-200 p-8 text-center text-slate-500"
    >
      <i class="pi pi-history text-3xl" />
      <p class="mt-2">No saved splits yet.</p>
      <p class="text-sm">Complete a split and save it to see it here.</p>
    </div>

    <div
      v-for="entry in historyStore.entries"
      :key="entry.id"
      class="rounded-2xl bg-white border border-slate-200 p-5"
    >
      <div class="flex items-start justify-between">
        <div>
          <div class="flex items-center gap-2">
            <span class="font-semibold">{{ entry.label }}</span>
            <span class="text-xs text-slate-400">{{ formatDate(entry.timestamp) }}</span>
          </div>
          <div class="mt-1 text-sm text-slate-500">
            {{ entry.receipt.items.length }} items &middot; {{ entry.people.length }} people
          </div>
          <div class="mt-1 flex flex-wrap gap-1">
            <span
              v-for="person in entry.people"
              :key="person.id"
              class="rounded-full bg-slate-100 px-2 py-0.5 text-xs"
            >
              {{ person.name }}
            </span>
          </div>
        </div>
        <div class="flex gap-2">
          <Button label="Load" icon="pi pi-upload" size="small" @click="loadEntry(entry)" />
          <Button
            icon="pi pi-trash"
            size="small"
            severity="danger"
            outlined
            @click="historyStore.deleteEntry(entry.id)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useHistoryStore, type HistoryEntry } from '@/stores/history'
import { useReceiptStore } from '@/stores/receipt'
import { usePeopleStore } from '@/stores/people'
import { Button } from 'primevue'
import router from '@/router'

const historyStore = useHistoryStore()
const receiptStore = useReceiptStore()
const peopleStore = usePeopleStore()

function formatDate(ts: number) {
  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(ts)
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(value)
}

function loadEntry(entry: HistoryEntry) {
  receiptStore.setReceipt(entry.receipt)
  peopleStore.people.splice(0, peopleStore.people.length, ...entry.people)
  router.push('/split')
}
</script>
