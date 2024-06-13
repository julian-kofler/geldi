<template>
  <div>
    <TextInput v-model="title" placeholder="Title" />
    <TextInput v-model="amount" placeholder="Amount" />
    <TextInput v-model="date" placeholder="Date" />
    <PrimaryButton @click="createExpense">Create Expense</PrimaryButton>
  </div>
</template>

<script>
import TextInput from './TextInput.vue';
import PrimaryButton from './PrimaryButton.vue';

export default {
  components: {
    TextInput,
    PrimaryButton
  },
  data() {
    return {
      title: '',
      amount: '',
      date: new Date().toISOString().substr(0, 10),
    };
  },
  methods: {
    createExpense() {
      // Handle the creation of the new expense here
      console.log(this.title, this.amount, this.date);
    },
  },
};
</script>