<script setup lang="ts">
const props = defineProps({
  id: Number,
  name: String,
  completed: Boolean,
});
</script>

<template>
  <div class="card">
    <div>
      <!-- TODO: Add Group picture -->
      <span>{{ props.name }}</span>
      <!-- TODO: Add sum(own expenses) -->
      <!-- TODO: Add sum(total expenses) -->
    </div>
  </div>
</template>
