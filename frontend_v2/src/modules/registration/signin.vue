<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import {signin} from "@/components/backendHandler";

const router = useRouter();

const email = ref("");
const password = ref("");

const submit = async () => {
  await signin(email.value, password.value);
  router.push("/groups");
};

const signup = async () => {
  router.push("/signup");
};

const pwReset = async () => {
  router.push("/passwordReset");
};
</script>

<template>
  <div>
    <h1>Geldi</h1>
    <p>Ausgaben besser aufteilen!</p>
    <div>
      <div class="input-field">
        <label for="email">Email</label>
        <input
          type="email"
          name="email"
          id="email"
          v-model="email"
          placeholder=""
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
      <div class="login_register_box">
        <button class="btn-primary" type="submit" @click="submit">
          Einloggen
        </button>
      </div>
      <div class="login_register_box lower_box">
        <p>Noch keinen Account?</p>
        <button class="btn-primary" @click="signup">
          Hier Registrieren
        </button>
      </div>
      <div class="login_register_box">
        <p>Passwort vergessen?</p>
        <button class="btn-primary" @click="pwReset">
          Passwort zurücksetzen
        </button>
      </div>
    </div>
  </div>
</template>