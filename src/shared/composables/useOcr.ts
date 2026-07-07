import { ref } from 'vue'

import { recognizeReceipt } from '@/shared/lib/ocr'

export function useOcr() {
  const loading = ref(false)
  const progress = ref(0)
  const text = ref('')

  async function scan(file: File) {
    loading.value = true
    progress.value = 0

    try {
      text.value = await recognizeReceipt(file, (value) => {
        progress.value = value
      })

      return text.value
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    progress,
    text,
    scan,
  }
}
