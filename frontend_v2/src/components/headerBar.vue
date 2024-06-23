<script setup lang="ts">
import {useRouter} from "vue-router"

const router = useRouter();
const goBack = () => {
    router.back();
}
</script>

<template>
  <div class="bar top-bar">
    <div @click="goBack">
      <font-awesome-icon icon="fa-solid fa-chevron-left" />
    </div>
    <p><slot>top bar</slot></p>
  </div>
</template>
