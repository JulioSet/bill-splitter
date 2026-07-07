import { defineStore } from 'pinia'
import { ref } from 'vue'

import type { Receipt } from '@/entities/receipt/model'

export const useReceiptStore = defineStore('receipt', () => {
  const receipt = ref<Receipt>({
    items: [],
    subtotal: 0,
    serviceCharge: 5,
    pb1: 10,
    total: 0,
  })

  function setReceipt(value: Receipt) {
    receipt.value = value
  }

  function updateItem(id: string, data: Partial<Receipt['items'][number]>) {
    const item = receipt.value?.items.find((x) => x.id === id)

    if (!item) {
      return
    }

    Object.assign(item, data)
  }

  function removeItem(id: string) {
    if (!receipt.value) {
      return
    }

    receipt.value.items = receipt.value.items.filter((x) => x.id !== id)
  }

  function togglePerson(itemId: string, personId: string) {
    const item = receipt.value?.items.find((x) => x.id === itemId)

    if (!item) {
      return
    }

    if (item.assignedTo.includes(personId)) {
      item.assignedTo = item.assignedTo.filter((x) => x !== personId)
    } else {
      item.assignedTo.push(personId)
    }
  }

  function updateServiceCharge(value: number) {
    if (!receipt.value) {
      return
    }

    receipt.value.serviceCharge = value
  }

  function updatePb1(value: number) {
    if (!receipt.value) {
      return
    }

    receipt.value.pb1 = value
  }

  return {
    receipt,

    setReceipt,

    updateItem,
    removeItem,
    togglePerson,

    updateServiceCharge,
    updatePb1,
  }
})
