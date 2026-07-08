<template>
  <div class="mx-auto max-w-3xl space-y-6 text-slate-900">
    <section>
      <h1 class="text-2xl font-bold">Review Receipt</h1>

      <p class="text-slate-500">Check the detected items before splitting.</p>
    </section>

    <!-- Mobile -->
    <div class="space-y-4 md:hidden">
      <div
        v-for="item in items"
        :key="item.id"
        class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
      >
        <div class="flex items-start justify-between gap-3">
          <div class="flex-1">
            <label class="mb-1 block text-sm font-medium text-slate-600"> Item </label>

            <input
              class="w-full rounded-lg border border-slate-300 px-3 py-2"
              :value="item.name"
              @input="updateName(item.id, $event)"
            />
          </div>

          <button
            class="mt-7 rounded-lg p-2 text-red-500 hover:bg-red-50"
            @click="receiptStore.removeItem(item.id)"
          >
            <i class="pi pi-trash text-lg" />
          </button>
        </div>

        <div class="mt-4 grid grid-cols-2 gap-3">
          <div>
            <label class="mb-1 block text-sm font-medium text-slate-600"> Qty </label>

            <input
              class="w-full rounded-lg border border-slate-300 px-3 py-2 text-right"
              :value="item.quantity"
              @input="updateQuantity(item.id, $event)"
            />
          </div>

          <div>
            <label class="mb-1 block text-sm font-medium text-slate-600"> Price </label>

            <input
              class="w-full rounded-lg border border-slate-300 px-3 py-2 text-right"
              :value="formatPrice(item.price)"
              @input="updatePrice(item.id, $event)"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Desktop -->
    <div class="hidden space-y-4 rounded-2xl border border-slate-200 bg-white p-5 md:block">
      <div v-for="item in items" :key="item.id" class="flex items-center gap-3">
        <input
          class="flex-1 rounded-lg border border-slate-300 px-3 py-2"
          :value="item.name"
          @input="updateName(item.id, $event)"
        />

        <input
          class="w-24 rounded-lg border border-slate-300 px-3 py-2 text-right"
          :value="item.quantity"
          @input="updateQuantity(item.id, $event)"
        />

        <input
          class="w-36 rounded-lg border border-slate-300 px-3 py-2 text-right"
          :value="formatPrice(item.price)"
          @input="updatePrice(item.id, $event)"
        />

        <button
          class="rounded-lg p-2 text-red-500 hover:bg-red-50"
          @click="receiptStore.removeItem(item.id)"
        >
          <i class="pi pi-trash" />
        </button>
      </div>
    </div>

    <Button
      label="Add Item"
      icon="pi pi-plus"
      severity="contrast"
      class="w-full mb-12"
      @click="receiptStore.addItem"
    />

    <!-- Sticky footer -->
    <div class="fixed inset-x-0 bottom-0 border-t border-slate-200 bg-white p-4">
      <div class="mx-auto max-w-3xl">
        <Button label="Continue" class="w-full" @click="continueSplit" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

import Button from 'primevue/button'

import { useReceiptStore } from '@/stores/receipt'

const router = useRouter()

const receiptStore = useReceiptStore()

const items = computed(() => receiptStore.receipt?.items ?? [])

function updateName(id: string, event: Event) {
  receiptStore.updateItem(id, {
    name: (event.target as HTMLInputElement).value,
  })
}

const formatPrice = (value: number) => {
  return new Intl.NumberFormat('en-US').format(value)
}

const updatePrice = (id: string, event: Event) => {
  const input = event.target as HTMLInputElement

  const rawValue = input.value.replace(/,/g, '')
  const price = Number(rawValue)

  if (!Number.isNaN(price)) {
    receiptStore.updateItem(id, {
      price: price,
      unitPrice:
        price / (receiptStore.receipt?.items.find((item) => item.id === id)?.quantity ?? 0),
    })
  }
}

function updateQuantity(id: string, event: Event) {
  const input = event.target as HTMLInputElement

  const rawValue = input.value.replace(/,/g, '')
  const quantity = Number(rawValue)

  if (!isNaN(quantity)) {
    receiptStore.updateItem(id, {
      quantity: Number((event.target as HTMLInputElement).value),
      unitPrice:
        (receiptStore.receipt?.items.find((item) => item.id === id)?.price ?? 0) / quantity,
    })
  }
}

function continueSplit() {
  router.push('/split')
}

onMounted(() => {
  if (!receiptStore.receipt || receiptStore.receipt.items.length === 0) {
    router.push('/')
  }
})
</script>
