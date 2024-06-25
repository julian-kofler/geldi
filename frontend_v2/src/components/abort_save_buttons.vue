<template>
    <div class="button-abort-save">
      <button @click="$emit('abort')" class="btn-secondary" type="submit">
        abbrechen
      </button>
      <button @click="$emit('save')" class="btn-primary" type="submit">
        Speichern
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
.btn-secondary{
  flex-grow: 0;
}
.btn-primary{
  flex-grow: 2;
}
</style>