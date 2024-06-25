<script setup lang="ts">
import EditExpense from "../pages/editExpense.vue";
import type { Expense } from "./types";

const props = defineProps<{
  expense: Expense,
}>()
</script>

<template>
  <div @click="$emit('editExpense', props.expense.id)" class="card">
    <div class="title-and-amount">
        <p>{{ props.expense.title }}</p>
        <p>{{ props.expense.amount }}€</p>
    </div>
    <div class="payedby-and-date">
        <p>Bezahlt von: {{ props.expense.payedby }}</p>
        <p>{{ props.expense.date }}</p>
    </div>
  </div>
</template>

<style scoped>
.title-and-amount{
    display: flex;
    justify-content: space-between;
}
.payedby-and-date{
    display: flex;
    justify-content: space-between;
}
</style>