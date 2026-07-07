<template>
  <div class="mx-auto max-w-3xl space-y-6 text-slate-900">
    <section>
      <h1 class="text-2xl font-bold">Review Receipt</h1>

      <p class="text-slate-500">Check the detected items before splitting.</p>
    </section>

    <div class="rounded-2xl bg-white border border-slate-200 p-5 space-y-4">
      <div v-for="item in items" :key="item.id" class="flex gap-3 items-center">
        <input
          class="flex-1 rounded-lg border border-slate-300 px-3 py-2"
          :value="item.name"
          @input="updateName(item.id, $event)"
        />

        <input
          class="w-32 rounded-lg border border-slate-300 px-3 py-2 text-right"
          :value="item.quantity"
          @input="updateQuantity(item.id, $event)"
        />

        <input
          class="w-32 rounded-lg border border-slate-300 px-3 py-2 text-right"
          :value="formatPrice(item.price)"
          @input="updatePrice(item.id, $event)"
        />

        <button class="text-red-500" @click="receiptStore.removeItem(item.id)">
          <i class="pi pi-trash" />
        </button>
      </div>
    </div>

    <Button label="Continue" class="w-full" @click="continueSplit" />
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
