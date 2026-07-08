<template>
  <div class="space-y-8">
    <section class="text-center">
      <h1 class="text-3xl font-bold text-slate-900">Split bills easily</h1>

      <p class="mt-2 text-slate-500">Upload your receipt and let us calculate everyone's share.</p>
    </section>

    <ReceiptUploadCard v-if="!loading" @upload="handleUpload" @scan="startScan" />

    <div v-else="loading" class="mx-auto max-w-xl rounded-2xl bg-white p-6 shadow-sm">
      <div class="flex items-center gap-3">
        <i class="pi pi-spin pi-spinner text-emerald-600" />
        <span class="text-emerald-600"> Reading receipt... {{ progress }}% </span>
      </div>

      <div class="mt-4 h-2 overflow-hidden rounded-full bg-slate-200">
        <div
          class="h-full rounded-full bg-emerald-600 transition-all"
          :style="{ width: `${progress}%` }"
        />
      </div>
    </div>

    <!-- <div v-if="receipt" class="mx-auto max-w-xl rounded-2xl bg-white p-6 shadow-sm text-slate-900">
      <h3 class="font-semibold">Items Found</h3>

      <div class="mt-4 space-y-3">
        <div
          v-for="item in receipt.items"
          :key="item.id"
          class="flex justify-between border-b border-slate-100 pb-2"
        >
          <span>
            {{ item.name }}
          </span>

          <span class="font-medium">
            {{ item.price.toLocaleString('en-US') }}
          </span>
        </div>
      </div>

      <Divider />

      <div v-if="receipt.subtotal" class="mt-4 flex justify-between font-bold text-slate-900">
        <span>Subtotal</span>
        <span>{{ receipt.subtotal.toLocaleString('en-US') }}</span>
      </div>

      <div v-if="receipt.serviceCharge" class="mt-4 flex justify-between font-bold text-slate-900">
        <span>Service Charge</span>
        <span>{{ receipt.serviceCharge.toLocaleString('en-US') }}</span>
      </div>

      <div v-if="receipt.pb1" class="mt-4 flex justify-between font-bold text-slate-900">
        <span>PB1</span>
        <span>{{ receipt.pb1.toLocaleString('en-US') }}</span>
      </div>

      <Divider />

      <div v-if="receipt.total" class="mt-4 flex justify-between font-bold text-slate-900">
        <span>Total</span>
        <span>{{ receipt.total.toLocaleString('en-US') }}</span>
      </div>
    </div> -->
  </div>
</template>

<script setup lang="ts">
import ReceiptUploadCard from '@/components/receipt/ReceiptUploadCard.vue'
import router from '@/router'
import { useOcr } from '@/shared/composables/useOcr'
import { useReceiptStore } from '@/stores/receipt'
import { Divider } from 'primevue'
import { ref } from 'vue'

const receiptStore = useReceiptStore()

const { scan, loading, progress, receipt } = useOcr()

const receiptFile = ref<File>()

function handleUpload(file: File) {
  receiptFile.value = file
}

async function startScan() {
  if (!receiptFile.value) {
    return
  }

  const result = await scan(receiptFile.value)

  if (result) {
    receiptStore.setReceipt(result)

    router.push('/review')
  }
}
</script>
