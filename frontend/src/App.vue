<script setup lang="ts">
import { RouterLink, RouterView } from "vue-router";
import "@/colors.css"; // Import colors.css
import { onMounted } from "vue";
onMounted(() => {
  document.title = "Geldi";
  let link =
    document.querySelector("link[rel*='icon']") ||
    document.createElement("link");
  link.type = "image/svg+xml";
  link.rel = "shortcut icon";
  link.href = "/src/assets/geldi.svg";
  document.getElementsByTagName("head")[0].appendChild(link);
});
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
