<script setup lang="ts">
import { onMounted, ref } from "vue";
import { getBackend } from "@/components/backendHandler";
import { useRoute, useRouter } from "vue-router";
import expenseCard from "./components/expenseCard.vue";
import BottomBar from "./components/bottomBar.vue";
import TopBar from "@/components/headerBar.vue";
import type { GroupResponse, ExpenseParams } from "@/components/types.ts";

const route = useRoute();
const router = useRouter();

const groupInfo = ref<GroupResponse>();

const expenses = ref<ExpenseParams[]>();

const fetchGroupDetails = async () => {
  try {
    const res = await getBackend(`/groups/group?groupId=${route.params.groupID}`);
    groupInfo.value = res.result;
  } catch (error) {
    alert("Konnte Gruppeninfo nicht laden!");
  }
};

const fetchExpenses = async () => {
  try {
    const url = `/expenses?groupId=${route.params.groupID}`;
    const res = await getBackend(url);
    expenses.value = res.result;
    expenses.value?.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  } catch (error) {
    alert("Konnte Ausgaben nicht laden!");
  }
};

const newExpense = () => {
  router.push(`/groups/${route.params.groupID}/expense/new`);
};
const viewExpense = (expID: number) => {
  router.push(`/groups/${route.params.groupID}/expense/${expID}`);
};
const headerTitleClicked = () => {
  router.push(`/groups/${route.params.groupID}/manage`);
};
const toCompensationPayments = () => {
  router.push(`/groups/${route.params.groupID}/compensation-payments`);
};
const nickname = (userID: number): string => {
  return (
    groupInfo.value?.members.find((member) => member.userId == userID)
      ?.nickname ?? "userID=" + userID
  );
};
const dateISOtoDMYY = (date: string): string => {
  const newDate = new Date(date);
  const day = newDate.getDate().toString();
  const month = (newDate.getMonth() + 1).toString();
  const year = newDate.getFullYear().toString().substring(2);
  return `${day}.${month}.${year}`;
};
onMounted(() => {
  fetchGroupDetails();
  fetchExpenses();
});
</script>

<template>
  <div>
    <TopBar @headerTitleClicked="headerTitleClicked">{{
      groupInfo?.name ?? "Loading..."
    }}</TopBar>
    <div class="content-container with-top-bar with-bottom-bar">
      <button @click="toCompensationPayments" class="btn-secondary">
        Ausgleichszahlungen
      </button>
      <div>
        <button @click="newExpense" class="btn-primary floating-button">
          + Neue Ausgabe
        </button>
        <expenseCard
          v-for="expense in expenses"
          :key="expense.id"
          @editExpense="viewExpense"
          :id="expense.id as number"
          :title="expense.title"
          :amount="expense.amount"
          :payedby="nickname(expense.payedBy)"
          :date="dateISOtoDMYY(expense.timestamp)"
        ></expenseCard>
      </div>
    </div>
    <BottomBar></BottomBar>
  </div>
</template>
