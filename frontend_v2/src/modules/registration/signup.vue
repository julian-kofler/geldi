<script setup lang="ts">
import { ref } from "vue";
import { signup } from "@/components/backendHandler";
import { useRouter } from "vue-router";

const router = useRouter();

const email = ref("");
const password = ref("");
const nickname = ref("");

const submit = async () => {
  try {
    await signup(email.value, password.value, nickname.value);
    router.push("/groups");
  } catch (error) {
    alert("Registrierung fehlgeschlagen!");
  }
};

const signin = async() => {
  router.push("/signin/");
}
</script>

<template>
  <div class="content-container">
    <h1>Account erstellen</h1>
    <form @submit.prevent="submit">
      <div class="input-field">
        <label for="email">Email</label>
        <input
          type="email"
          name="email"
          id="email"
          v-model="email"
          placeholder=""
          required
        />
      </div>
      <div class="input-field">
        <label for="password">Passwort</label>
        <input
          type="password"
          name="password"
          id="password"
          v-model="password"
          placeholder=""
          required
        />
      </div>
      <div class="input-field">
        <label for="nickname">Nickname</label>
        <input
          type="text"
          name="nickname"
          id="nickname"
          v-model="nickname"
          placeholder=""
          required
          pattern="[\w]+"
        />
      </div>
      <div class="login_register_box">
        <button class="btn-primary" type="submit">
          Registrieren
        </button>
      </div>
      <div class="login_register_box lower_box">
        <button class="btn-secondary" @click="router.push('/signin/')">
          Schon einen Account?
        </button>
      </div>
    </form>
  </div>
</template>
