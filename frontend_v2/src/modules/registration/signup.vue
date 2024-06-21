<script setup lang="ts">
import { ref } from "vue";

const email = ref("");
const password = ref("");
</script>

<template>
  <h1>Account erstellen</h1>
  <p>Ausgaben besser aufteilen!</p>
  <div>
    <div>
      <label for="email">Email</label>
      <input type="email" name="email" id="email" v-model="email" placeholder="max.mustermann@abc.de"/>
    </div>
    <div>
      <label for="password">Passwort</label>
      <input type="password" name="password" id="password" v-model="password" placeholder="erstell ein sicheres Passwort"/>
    </div>
  </div>
</template>
