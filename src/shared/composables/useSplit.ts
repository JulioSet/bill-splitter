import { computed } from 'vue'

import { useReceiptStore } from '@/stores/receipt'
import { usePeopleStore } from '@/stores/people'

import { calculateSplit } from '@/entities/split/calculator'

export function useSplit() {
  const receiptStore = useReceiptStore()
  const peopleStore = usePeopleStore()

  const summary = computed(() => {
    if (!receiptStore.receipt) {
      return []
    }

    return calculateSplit(receiptStore.receipt, peopleStore.people)
  })

  return {
    summary,
  }
}
