<script setup>
// Vue
import { computed, watch } from 'vue'

// Router
import { useRouter } from 'vue-router'

// Store
import { useNotificationStore } from '@/stores/notification'

// ----- START ----- //

// Generals
const notificationStore = useNotificationStore()
const router = useRouter()

// Computeds
const newPage = computed(() => notificationStore.newPage)

// Functions

watch(newPage, () => {
  if (newPage.value) {
    router.push({ name: newPage.value })
  }
})
</script>

<template>
  <RouterView />
  <div id="liveAlertPlaceholder"></div>
</template>

<style lang="scss">
@import '@fortawesome/fontawesome-free/css/all.min.css';
</style>
