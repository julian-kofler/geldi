<script setup lang="ts">
const props = defineProps<{
  id: number;
  title: string;
  amount: number;
  payedby: string;
  date: string;
}>();
</script>

<template>
  <div @click="$emit('editExpense', props.id)" class="card">
    <div class="title-and-amount">
      <span>{{ props.title }}</span>
      <span>{{ props.amount }}€</span>
    </div>
    <!-- <div class="payedby-and-date">
      <p>Bezahlt von: {{ props.payedby }}</p>
      <p>{{ props.date }}</p>
    </div> -->
  </div>
</template>

