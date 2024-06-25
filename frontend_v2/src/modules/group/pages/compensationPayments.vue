<script setup lang="ts">
import TopBar from "@/components/headerBar.vue";
import { useRoute, useRouter } from "vue-router";
import { getBackend } from "@/components/backendHandler";

const route = useRoute();
const router = useRouter();
</script>

<template>
  <TopBar :back_route="`/groups/${route.params.groupID}`"
    >Ausgleichszahlungen
  </TopBar>
  <div class="content-container with-top-bar">to be fetched</div>
</template>
