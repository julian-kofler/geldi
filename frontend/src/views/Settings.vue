<template>
  <div class="root">
    <h1 class="title">Einstellungen</h1>

    <PrimaryButton @click="logout">Logout</PrimaryButton>
    <PrimaryButton @click="change_password">Passwort ändern</PrimaryButton>
    <PrimaryButton @click="impressum">Impressum</PrimaryButton>
  </div>
  <NavigationBar />
</template>

<script>
import PrimaryButton from "../components/SecondaryButton.vue";
import NavigationBar from "../components/NavigationBar.vue";
export default {
  name: "SettingsScreen",
  components: {
    PrimaryButton,
    NavigationBar,
  },
  methods: {
    logout() {
      localStorage.removeItem("jwt");
      localStorage.removeItem("refreshToken");
      this.$router.push("/login");
    },
    change_password() {
      this.$router.push("/change-password");
    },
    impressum() {
      this.$router.push("/impressum");
    },
  },
};
</script>

<style scoped>
.root {
  padding: 2rem;
}
.title {
  color: var(--color5);
  text-align: center;
  font-size: 2em;
}
.secondary-button {
  width: 100%;
}
</style>
