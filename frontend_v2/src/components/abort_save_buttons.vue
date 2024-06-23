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