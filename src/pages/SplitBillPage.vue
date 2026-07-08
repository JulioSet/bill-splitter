<template>
  <div class="mx-auto max-w-4xl space-y-6 text-slate-900">
    <h1 class="text-2xl font-bold">Split Bill</h1>

    <!-- People -->

    <div class="rounded-2xl bg-white border p-5">
      <h2 class="font-semibold">People</h2>

      <div class="mt-3 flex gap-2">
        <input v-model="newPerson" class="rounded-lg border px-3 py-2" placeholder="Name" />

        <button class="rounded-lg bg-emerald-600 px-4 text-white" @click="addPerson">Add</button>
      </div>

      <div class="mt-4 flex gap-2 flex-wrap">
        <span
          v-for="person in peopleStore.people"
          :key="person.id"
          class="rounded-full bg-slate-100 px-3 py-1 text-sm"
        >
          {{ person.name }}
        </span>
      </div>
    </div>

    <!-- Items -->

    <div class="space-y-4">
      <div v-for="item in items" :key="item.id" class="rounded-2xl bg-white border p-5">
        <div>
          <span class="font-medium">
            {{ item.name }}
          </span>
          <div class="flex justify-between">
            <div class="text-sm text-slate-600">
              <p>Qty: {{ item.quantity }}</p>
              <p>{{ item.unitPrice.toLocaleString('en-US') }}</p>
            </div>

            <span class="font-bold">
              {{ item.price.toLocaleString('en-US') }}
            </span>
          </div>
        </div>

        <div class="mt-4 flex gap-2 flex-wrap">
          <button
            v-for="person in peopleStore.people"
            :key="person.id"
            class="rounded-full border px-3 py-1 text-sm"
            :class="item.assignedTo.includes(person.id) ? 'bg-emerald-600 text-white' : 'bg-white'"
            @click="toggle(item.id, person.id)"
          >
            {{ person.name }}
          </button>
        </div>
      </div>
    </div>

    <Card class="mb-6">
      <template #title> Additional Charges </template>

      <template #content>
        <div class="grid gap-4 md:grid-cols-2">
          <div>
            <label class="mb-2 block text-sm font-medium"> Service Charge </label>
            <InputNumber v-model="serviceCharge" suffix="%" :min="0" :max="100" fluid />
          </div>

          <div>
            <label class="mb-2 block text-sm font-medium"> PB1 </label>
            <InputNumber v-model="pb1" suffix="%" :min="0" :max="100" fluid />
          </div>
        </div>
      </template>
    </Card>

    <section class="rounded-2xl bg-white border p-5">
      <h2 class="font-semibold">Summary</h2>

      <div class="mt-4 space-y-3">
        <div
          v-for="person in summary"
          :key="person.person.id"
          class="rounded-xl border border-slate-200 p-4"
        >
          <div class="flex justify-between">
            <span class="font-semibold">
              {{ person.person.name }}
            </span>

            <span class="font-bold">
              {{ person.total.toLocaleString('en-US') }}
            </span>
          </div>

          <div class="mt-3 text-sm text-slate-500">
            <div class="flex justify-between">
              <span>Subtotal</span>
              <span>{{ person.subtotal.toLocaleString('en-US') }}</span>
            </div>

            <div class="flex justify-between">
              <span>Service Charge</span>
              <span>{{ person.serviceCharge.toLocaleString('en-US') }}</span>
            </div>

            <div class="flex justify-between">
              <span>PB1</span>
              <span>{{ person.pb1.toLocaleString('en-US') }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'

import { usePeopleStore } from '@/stores/people'
import { useReceiptStore } from '@/stores/receipt'
import { useSplit } from '@/shared/composables/useSplit'
import { Card, InputNumber } from 'primevue'
import router from '@/router'

const peopleStore = usePeopleStore()
const receiptStore = useReceiptStore()

const { summary } = useSplit()

const newPerson = ref('')

const items = computed(() => receiptStore.receipt?.items ?? [])
const serviceCharge = computed({
  get: () => receiptStore.receipt.serviceCharge ?? 5,
  set: (value) => receiptStore.updateServiceCharge(value ?? 0),
})
const pb1 = computed({
  get: () => receiptStore.receipt.pb1 ?? 10,
  set: (value) => receiptStore.updatePb1(value ?? 0),
})

function addPerson() {
  if (!newPerson.value.trim()) {
    return
  }

  peopleStore.addPerson(newPerson.value)

  newPerson.value = ''
}

function toggle(itemId: string, personId: string) {
  receiptStore.togglePerson(itemId, personId)
}

onMounted(() => {
  if (!receiptStore.receipt || receiptStore.receipt.items.length === 0) {
    router.push('/')
  }
})
</script>
