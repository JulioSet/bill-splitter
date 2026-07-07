<script setup lang="ts">
import Header from '@/components/layout/Header.vue'
</script>

<template>
  <div class="min-h-screen bg-slate-50">
    <Header />

    <main class="mx-auto max-w-5xl px-4 py-8">
      <RouterView />
    </main>
  </div>
</template>
