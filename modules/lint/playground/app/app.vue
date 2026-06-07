<script setup lang="ts">
const count = ref(0)
</script>

<template>
  <div class="flex min-h-screen items-center justify-center">
    <!-- unsorted classes + unsorted `ui` object prop → better-tailwindcss warns -->
    <UButton
      class="px-4 py-2 bg-primary flex"
      :ui="{ base: 'rounded-lg text-white px-2' }"
      @click="count++"
    >
      Clicked {{ count }}
    </UButton>

    <!-- raw <button> → nustack/prefer-u-button warns -->
    <button class="p-2">
      Raw button
    </button>
  </div>
</template>
