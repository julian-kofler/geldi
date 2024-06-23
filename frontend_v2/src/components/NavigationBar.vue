<template>
  <div class="bar bottom-bar">
    <router-link to="/groups" class="bottom-bar-item" active-class="active">
      <font-awesome-icon icon="fa-solid fa-user-group" />
      <span>Gruppen</span>
    </router-link>
    <!-- <router-link to="/balance" class="bottom-bar-item" active-class="active">
      <font-awesome-icon icon="fa-solid fa-scale-unbalanced-flip" />
      <span>Saldo</span>
    </router-link> -->
    <router-link to="/settings" class="bottom-bar-item" active-class="active">
      <font-awesome-icon icon="fa-solid fa-gear" />
      <span>Einstellungen</span>
    </router-link>
  </div>
</template>


<style scoped>
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
