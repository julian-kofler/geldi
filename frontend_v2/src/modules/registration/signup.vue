<script setup lang="ts">
import { ref } from "vue";
import { signup } from "@/components/backendHandler";

const email = ref("");
const password = ref("");
const nickname = ref("");

const submit = () => {
  signup(email.value, password.value, nickname.value);
};
</script>

<template>
  <div>
    <h1>Account erstellen</h1>
    <div>
      <div class="input-field">
        <label for="email">Email</label>
        <input
          type="email"
          name="email"
          id="email"
          v-model="email"
          placeholder="max.mustermann@abc.de"
        />
      </div>
      <div class="input-field">
        <label for="password">Passwort</label>
        <input
          type="password"
          name="password"
          id="password"
          v-model="password"
          placeholder="erstell ein sicheres Passwort"
        />
      </div>
      <div class="input-field">
        <label for="nickname">Nickname</label>
        <input
          type="text"
          name="nickname"
          id="nickname"
          v-model="nickname"
          placeholder="so wirst du angezeit werden"
        />
      </div>
      <button class="btn-primary" type="submit" @click="submit">
        Registrieren
      </button>
    </div>
    <router-link to="/signin">Schon einen Account? Hier einloggen!</router-link>
  </div>
</template>
