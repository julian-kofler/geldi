<template>
  <div>
    <h1>Settings</h1>

    <PrimaryButton @click="logout">Logout</PrimaryButton>
    <NavigationBar />
  </div>
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
        this.$router.push('/login');
    }
  }
}
</script>

<style scoped>
/* Add your styles here */
</style>