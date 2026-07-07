<script setup lang="ts">
import ReceiptUploadCard from '@/components/receipt/ReceiptUploadCard.vue'
import { useOcr } from '@/shared/composables/useOcr'
import { ref } from 'vue'

const receiptFile = ref<File>()

const { scan, loading, progress, text } = useOcr()

function handleUpload(file: File) {
  receiptFile.value = file
}

async function startScan() {
  if (!receiptFile.value) {
    return
  }

  await scan(receiptFile.value)
}
</script>

<template>
  <div class="space-y-8">
    <section class="text-center">
      <h1 class="text-3xl font-bold text-slate-900">Split bills easily</h1>

      <p class="mt-2 text-slate-500">Upload your receipt and let us calculate everyone's share.</p>
    </section>

    <ReceiptUploadCard @upload="handleUpload" @scan="startScan" />

    <div v-if="loading" class="mx-auto max-w-xl rounded-2xl bg-white p-6 shadow-sm">
      <div class="flex items-center gap-3">
        <i class="pi pi-spin pi-spinner text-emerald-600" />

        <span> Reading receipt... {{ progress }}% </span>
      </div>

      <div class="mt-4 h-2 overflow-hidden rounded-full bg-slate-200">
        <div
          class="h-full bg-emerald-600 transition-all"
          :style="{
            width: `${progress}%`,
          }"
        />
      </div>
    </div>

    <div v-if="text" class="mx-auto max-w-xl rounded-2xl bg-white p-6 shadow-sm">
      <h3 class="font-semibold">OCR Result</h3>

      <pre class="mt-4 whitespace-pre-wrap text-sm text-slate-600"
        >{{ text }}
      </pre>
    </div>
  </div>
</template>
