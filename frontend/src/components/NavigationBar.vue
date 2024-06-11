<template>
  <div class="navbar">
    <router-link to="/groups" class="navbar-item" active-class="active">Groups</router-link>
    <router-link to="/balance" class="navbar-item" active-class="active">Balance</router-link>
    <router-link to="/settings" class="navbar-item" active-class="active">Settings</router-link>
  </div>
</template>

<script>
import '../colors.css' // Import colors.css
export default {
  name: 'NavigationBar',
}
</script>

<style scoped>
.navbar {
  display: flex;
  justify-content: space-around;
  position: fixed;
  bottom: 0;
  width: 80%;
  background-color: var(--color3);
  padding: 10px 0;
}

.navbar-item {
  text-decoration: none;
  color: #444;
}

.active {
  color: #007bff;
}
</style>