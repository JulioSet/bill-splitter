import { ref } from 'vue'

import { recognizeReceipt } from '@/shared/lib/ocr'
import { parseReceipt } from '@/entities/receipt/parser'

import type { Receipt } from '@/entities/receipt/model'

export function useOcr() {
  const loading = ref(false)
  const progress = ref(0)

  const receipt = ref<Receipt>()

  async function scan(file: File) {
    loading.value = true
    progress.value = 0

    try {
      let text = await recognizeReceipt(file, (value) => {
        progress.value = value
      })

      text = cleanOCRText(text)

      receipt.value = parseReceipt(text)

      return receipt.value
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    progress,
    receipt,
    scan,
  }
}

function cleanOCRText(text: string) {
  return text
    .split('\n')
    .map((line) => {
      // remove accidental leading "1" before words
      return line.replace(/^1(?=[A-Za-z])/g, '')
    })
    .join('\n')
}
