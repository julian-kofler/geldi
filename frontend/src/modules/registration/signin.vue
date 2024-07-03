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

const nichtImplementiert = () => {
  alert("noch nicht implementiert");
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
          placeholder=""
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
        <button class="btn-primary" type="submit">Einloggen</button>
      </div>
      <div class="login_register_box lower_box">
        <button class="btn-secondary" @click="router.push('/signup');">
          Noch keinen Account?
        </button>
      </div>
      <div class="login_register_box">
        <button class="btn-secondary" @click="nichtImplementiert">
          Passwort vergessen?
        </button>
      </div>      
    </form>
  </div>
</template>