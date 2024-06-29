<script setup lang="ts">
import NavigationBar from "@/components/NavigationBar.vue";
import { backend_url } from "@/components/backendHandler";
import { useRouter } from "vue-router";

const router = useRouter();

const logout = async () => {
  try {
    const response = await fetch(backend_url + "/auth/logout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        refreshToken: localStorage.getItem("refreshToken"),
      }),
    });

    if (!response.ok) {
      alert("Backend Side Logout failed");
      //   return;
    }
    localStorage.clear();
    router.push("/signin");
  } catch (error) {
    console.error("Logout error:", error);
    alert("Logout fehlgeschlagen");
  }
};
const nichtImplementiert = () => {
  alert("noch nicht implementiert");
};
</script>

<template>
  <div class="content-container with-bottom-bar">
    <h1>Einstellungen</h1>
    <button @click="logout()" class="btn-secondary">Logout</button>
    <button @click="nichtImplementiert" class="btn-secondary">
      Passwort ändern
    </button>
    <button @click="nichtImplementiert" class="btn-secondary">
      Nickname ändern
    </button>
    <button @click="nichtImplementiert" class="btn-primary">
      Account löschen
    </button>
  </div>
  <NavigationBar></NavigationBar>
</template>
