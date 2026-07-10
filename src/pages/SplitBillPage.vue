<template>
  <div class="mx-auto max-w-4xl space-y-6 text-slate-900">
    <h1 class="text-2xl font-bold">Split Bill</h1>

    <!-- People -->

    <div class="rounded-2xl bg-white border border-slate-200 p-5">
      <h2 class="font-semibold">People</h2>

      <div class="mt-3 flex flex-col gap-2 sm:flex-row">
        <InputText v-model="newPerson" placeholder="Name" class="w-full" @keyup.enter="addPerson" />
        <Button
          label="Add"
          icon="pi pi-plus"
          class="w-full sm:w-auto"
          size="small"
          @click="addPerson"
        />
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
      <div
        v-for="item in items"
        :key="item.id"
        class="rounded-2xl bg-white border border-slate-200 p-5"
      >
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

    <section class="rounded-2xl bg-white border border-slate-200 p-5">
      <div class="flex items-center justify-between">
        <h2 class="font-semibold">Summary</h2>
        <Button
          :label="copied ? 'Copied to Clipboard' : 'Copy'"
          :icon="copied ? 'pi pi-check' : 'pi pi-copy'"
          class="w-full sm:w-auto"
          size="small"
          :outlined="copied"
          :severity="copied ? 'success' : 'secondary'"
          @click="copySummary"
        />
      </div>

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
              {{ formatCurrency(person.total) }}
            </span>
          </div>

          <div class="mt-3 text-sm text-slate-500">
            <div class="flex justify-between">
              <span>Subtotal</span>
              <span>{{ formatCurrency(person.subtotal) }}</span>
            </div>

            <div class="flex justify-between">
              <span>Service Charge</span>
              <span>{{ formatCurrency(person.serviceCharge) }}</span>
            </div>

            <div class="flex justify-between">
              <span>PB1</span>
              <span>{{ formatCurrency(person.pb1) }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'

import { usePeopleStore, type Person } from '@/stores/people'
import { useReceiptStore } from '@/stores/receipt'
import { useSplit } from '@/shared/composables/useSplit'
import { Card, InputNumber, InputText, Button } from 'primevue'
import router from '@/router'
import type { Receipt } from '@/entities/receipt/model'

const peopleStore = usePeopleStore()
const receiptStore = useReceiptStore()

const { summary } = useSplit()

const copied = ref(false)

const newPerson = ref('')

const items = computed(() => receiptStore.receipt?.items ?? [])
const serviceCharge = computed({
  get: () => receiptStore.receipt.serviceCharge,
  set: (value) => receiptStore.updateServiceCharge(value ?? 0),
})
const pb1 = computed({
  get: () => receiptStore.receipt.pb1,
  set: (value) => receiptStore.updatePb1(value ?? 0),
})

function addPerson() {
  if (!newPerson.value.trim()) {
    return
  }

  peopleStore.addPerson(newPerson.value)

  newPerson.value = ''
}

function buildReceiptText(receipt: Receipt, people: Person[]) {
  const lines: string[] = []

  lines.push('*RECEIPT*')
  lines.push('')

  receipt.items.forEach((item) => {
    lines.push(`${item.name.padEnd(24)} ${formatCurrency(item.price)}`)
  })

  lines.push('')
  lines.push(`Subtotal : ${formatCurrency(receipt.subtotal ?? 0)}`)
  lines.push(`Service  : ${formatCurrency(receipt.serviceChargeAmount ?? 0)}`)
  lines.push(`PB1      : ${formatCurrency(receipt.pb1Amount ?? 0)}`)
  lines.push(`Total    : ${formatCurrency(receipt.total ?? 0)}`)
  lines.push('')
  lines.push('*SPLIT SUMMARY*')
  lines.push('')

  summary.value.forEach((person) => {
    const items = receipt.items.filter((item) => item.assignedTo.includes(person.person.id))

    const subtotal = items.reduce((sum, item) => sum + item.price, 0)

    const service = person.serviceCharge
    const pb1 = person.pb1
    const total = subtotal + service + pb1

    lines.push(person.person.name)

    items.forEach((item) => {
      lines.push(`- ${item.name} (${formatCurrency(item.price)})`)
    })

    lines.push(`Subtotal : ${formatCurrency(subtotal)}`)

    if ((receipt.serviceCharge ?? 0) > 0) {
      lines.push(`Service  : ${formatCurrency(service)}`)
    }

    if ((receipt.pb1 ?? 0) > 0) {
      lines.push(`PB1      : ${formatCurrency(pb1)}`)
    }

    lines.push(`Total    : ${formatCurrency(total)}`)
    lines.push('')
  })

  return lines.join('\n')
}

function toggle(itemId: string, personId: string) {
  receiptStore.togglePerson(itemId, personId)
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(value)
}

const copySummary = async () => {
  const text = buildReceiptText(receiptStore.receipt!, peopleStore.people)

  await navigator.clipboard.writeText(text)

  copied.value = true

  setTimeout(() => {
    copied.value = false
  }, 2000)
}

onMounted(() => {
  if (!receiptStore.receipt || receiptStore.receipt.items.length === 0) {
    router.push('/')
  }
  receiptStore.updateServiceCharge(5)
  receiptStore.updatePb1(10)
})
</script>

<style scoped>
:deep(.p-inputtext) {
  background-color: white;
  color: black;
  border-color: gainsboro;
}
</style>
