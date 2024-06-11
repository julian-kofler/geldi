<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import '@/colors.css' // Import colors.css

</script>
<template>
  <div class="app">
    <RouterView />
  </div>
</template>

<style scoped>
header {
  line-height: 1.5;
  max-height: 100vh;
}
.app {
  /* background-color: var(--color3); */
}
</style>