<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { signin } from "@/components/backendHandler";

const router = useRouter();

const email = ref("");
const password = ref("");

const submit = async () => {
  try {
    await signin(email.value, password.value);
    router.push("/groups");
  } catch (error) {
    alert("Einloggen fehlgeschlagen!");
  }
};

const signup = async () => {
  router.push("/signup");
};

const pwReset = async () => {
  router.push("/passwordReset");
};
</script>

<template>
  <div class="content-container">
    <div class="centered-content">
      <img src="@/assets/geldi.svg" alt="Geldi" width="125" height="125" />
      <h1>Geldi</h1>
      <div>Ausgaben besser aufteilen!</div>
      <br />
      <br />
    </div>
    <form @submit.prevent="submit">
      <div class="input-field">
        <label for="email">Email</label>
        <input
          type="email"
          name="email"
          id="email"
          v-model="email"
          placeholder="max.mustermann@abc.de"
          required
          pattern="[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}"
        />
      </div>
      <div class="input-field">
        <label for="password">Passwort</label>
        <input
          type="password"
          name="password"
          id="password"
          v-model="password"
          required
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
      <div class="centered-content">
        <button class="btn-primary" type="submit">Einloggen</button>
        <router-link to="/signup"
          >Noch keinen Account? Hier registrieren!</router-link
        >
      </div>
    </form>
  </div>
</template>