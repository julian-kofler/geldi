<template>
  <div class="bottom-bar">
    <div class="cost-section">
      <div class="cost-label">Meine Kosten</div>
      <div class="cost-value">00,00€</div>
    </div>
    <div class="cost-section">
      <div class="cost-label">Mein Saldo</div>
      <div class="cost-value">00,00€</div>
    </div>
    <div class="cost-section">
      <div class="cost-label">Gesamte Kosten</div>
      <div class="cost-value">00,00€</div>
    </div>
  </div>
</template>

<style scoped>
.bottom-bar {
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 10px;
  box-sizing: border-box;
  background-color: whitesmoke;
  position: fixed;
  bottom: 0;
  width: 100%;
}

.cost-section {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.cost-label {
  font-size: 14px;
  color: #333;
}

.cost-value {
  font-size: 18px;
  color: #333;
  font-weight: bold;
}
</style>
