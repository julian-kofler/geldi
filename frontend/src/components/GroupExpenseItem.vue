<template>
  <div class="expense-item">
    <div class="left-section">
      <div class="title">{{ title }}</div>
      <div class="paidby">Bezahlt von:{{ paidby }}</div>
    </div>
    <div class="right-section">
      <div class="amount">{{ amount }}€</div>
      <div class="date"> {{ date }}</div>
    </div>
  </div>
</template>

<script>
import { useRouter } from 'vue-router';
export default {
  props: {
    title: {
      type: String,
      required: true
    },
    amount: {
      type: String,
      required: true
    },
    date: {
      type: String,
      required: true
    },
    paidby: {
      type: String,
      required: true
    }
  },
}
</script>

<style scoped>
.expense-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  box-sizing: border-box;
  border-bottom: 1px solid #eee;

  margin-bottom: 10px;
  border-radius: 5px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
}
.left-section, .right-section {
  display: flex;
  flex-direction: column;
}

.title, .amount {
  font-size: 18px;
  font-weight: bold;
}

.paidby, .date {
  font-size: 14px;
  color: #888;
}
</style>