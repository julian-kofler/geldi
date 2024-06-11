<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
// import NavigationBar from './components/NavigationBar.vue' // Import NavigationBar
import '@/colors.css' // Import colors.css

</script>
<template>
  <div class="app"> <!-- Add a root div with class "app" -->
    <RouterView />
    <!-- <navigationBar /> -->
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