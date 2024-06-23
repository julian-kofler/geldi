<template>
  <div class="navbar">
    <router-link to="/groups" class="navbar-item" active-class="active">
      <font-awesome-icon icon="fa-solid fa-user-group" />
      <span>Gruppen</span>
    </router-link>
    <!-- <router-link to="/balance" class="navbar-item" active-class="active">
      <font-awesome-icon icon="fa-solid fa-scale-unbalanced-flip" />
      <span>Saldo</span>
    </router-link> -->
    <router-link to="/settings" class="navbar-item" active-class="active">
      <font-awesome-icon icon="fa-solid fa-gear" />
      <span>Einstellungen</span>
    </router-link>
  </div>
</template>


<style scoped>
.navbar {
  display: flex;
  justify-content: space-around;
  position: fixed;
  bottom: 0;
  width: 100%;
  background-color: whitesmoke;
  padding: 10px 0;
  box-sizing: border-box;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
}

.navbar-item {
  text-decoration: none;
  color: #444;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.navbar-item i {
  font-size: 1.5em;
}

.navbar-item span {
  font-size: 0.8em;
  margin-top: 5px;
}

.active {
  color: rgb(255, 0, 0);
}
</style>
