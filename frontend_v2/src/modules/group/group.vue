<script setup lang="ts">
import { onMounted, ref } from "vue";
import { getBackend } from "@/components/backendHandler";
import { useRoute, useRouter } from "vue-router";
import expenseCard from "./components/expenseCard.vue";
import type { Expense } from "./components/types";
import BottomBar from "./components/bottomBar.vue";
import TopBar from "@/components/headerBar.vue";

const route = useRoute();
const router = useRouter();

const groupDetails = ref(null);
const expenses = ref<Expense[]>([]);

const fetchGroupDetails = async () => {
  const res = await getBackend("/groups");
  const groups = res.result;
  const groupId: Number = parseInt(route.params.groupID);
  const group = groups.find((group) => group.id === groupId);
  groupDetails.value = group ? group : "error loading";
};

const fetchExpenses = async () => {
  const url = `/expenses?groupId=${route.params.groupID}`;
  const res = await getBackend(url);
  expenses.value = res.result
    .map((expense) => ({
      ...expense,
      date: expense.timestamp.split("T")[0],
    }))
    .sort((a: Expense, b: Expense) => {
      return new Date(b.timestamp) - new Date(a.timestamp);
    });
};

const newExpense = () => {
  router.push(`/groups/${groupDetails.value.id}/expense/new`);
};
const viewExpense = (expID: number) => {
  router.push(`/groups/${groupDetails.value.id}/expense/${expID}`);
};
onMounted(() => {
  fetchGroupDetails();
  fetchExpenses();
});
</script>

<template>
  <div>
    <TopBar v-if="!groupDetails">Loading...</TopBar>
    <TopBar v-else>{{ groupDetails.name  }}</TopBar>
    <div class="content-container with-top-bar with-bottom-bar">
      <!-- <h1 class="loading" v-if="!groupDetails">Loading...</h1>
      <h1 v-else>{{ groupDetails.name }}</h1> -->
      <div>
        <button @click="newExpense" class="btn-primary floating-button">+ Neue Ausgabe</button>
        <expenseCard
          v-for="expense in expenses"
          :key="expense.id"
          :expense="expense"
          @editExpense="viewExpense"
        ></expenseCard>
      </div>
    </div>
    <BottomBar></BottomBar>
  </div>
</template>
