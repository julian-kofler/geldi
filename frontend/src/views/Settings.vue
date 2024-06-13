<template>
  <div class="root">
    <h1 class="title">Einstellungen</h1>

    <PrimaryButton @click="logout">Logout</PrimaryButton>
  </div>
  <NavigationBar />
</template>

<script>
import PrimaryButton from '../components/PrimaryButton.vue'
import NavigationBar from '../components/NavigationBar.vue'
export default {
  name: 'SettingsScreen',
  components: {
    PrimaryButton,
    NavigationBar
  },
  methods: {
    logout() {
        localStorage.removeItem('jwt');
        localStorage.removeItem('refreshToken');
        this.$router.push('/login');
    }
  }
}
</script>

<style scoped>
.root{
  padding: 2rem;
}
.title {
  color: var(--color5);
  text-align: center;
  font-size: 2em;
}
.primary-button {
  width: 100%;
}
</style>