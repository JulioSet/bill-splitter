<template>
  <div class="mx-auto max-w-xl rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
    <!-- Empty State -->
    <label
      v-if="!previewUrl"
      class="flex cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed border-slate-300 px-6 py-16 transition hover:border-emerald-500 hover:bg-emerald-50"
    >
      <i class="pi pi-camera text-4xl text-emerald-600" />

      <h2 class="mt-5 text-lg font-semibold text-slate-900">Upload Receipt</h2>

      <p class="mt-2 max-w-xs text-center text-sm text-slate-500">
        Click or drag your receipt image here
      </p>

      <input type="file" accept="image/*" class="hidden" @change="onFileChange" />
    </label>

    <!-- Preview State -->
    <div v-else class="space-y-5">
      <div class="overflow-hidden rounded-2xl border border-slate-200">
        <img :src="previewUrl" class="max-h-96 w-full object-contain bg-slate-100" />
      </div>

      <div class="flex gap-3">
        <label class="flex-1 cursor-pointer">
          <input type="file" accept="image/*" class="hidden" @change="onFileChange" />

          <div
            class="flex h-11 items-center justify-center rounded-xl border border-slate-300 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Change
          </div>
        </label>

        <button
          class="flex-1 rounded-xl bg-emerald-600 text-sm font-medium text-white hover:bg-emerald-700"
          @click="emit('scan')"
        >
          Start Scan
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const previewUrl = ref<string>()

const emit = defineEmits<{
  upload: [file: File]
  scan: []
}>()

function onFileChange(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]

  if (!file) {
    return
  }

  previewUrl.value = URL.createObjectURL(file)

  emit('upload', file)
}
</script>
