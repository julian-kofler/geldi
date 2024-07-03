<script setup lang="ts">
const props = defineProps<{
  primaryButtonText?: string
  bigger?: "secondary"
}>();
</script>

<template>
    <div class="button-abort-save">
      <button @click="$emit('abort')" :class="{'btn-secondary': true, 'bigger': props.bigger === 'secondary'}">
        Abbrechen
      </button>
      <button @click="$emit('save')" :class="{'btn-primary': true, 'bigger': props.bigger !== 'secondary'}" type="submit">
        {{props.primaryButtonText ?? 'Speichern'}}
      </button>
    </div>
</template>

<style scoped>
.button-abort-save {
  display: flex;
  justify-content: space-around;
  margin-top: 20px;
  gap: 12px;
}
button{
  width: auto;
}
.bigger{
  flex-grow: 2;
}
</style>