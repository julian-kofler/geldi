<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { signin } from "@/components/backendHandler";

const router = useRouter();

const email = ref("");
const password = ref("");

const submit = async () => {
  await signin(email.value, password.value);
  router.push("/groups");
};
</script>

<template>
  <div>
    <h1>Ausgabenverwaltung</h1>
    <p>Ausgaben besser aufteilen!</p>
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
        />
      </div>
      <button class="btn-primary" type="submit" @click="submit">
        Einloggen
      </button>
    </div>
    <router-link to="/signup"
      >Noch keinen Account? Hier registrieren!</router-link
    >
  </div>
</template>
