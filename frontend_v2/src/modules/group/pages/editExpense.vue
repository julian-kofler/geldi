<script setup lang="ts">
import { onMounted, ref } from "vue";
import type { Expense, ExpenseParams } from "../components/types";
import { useRoute, useRouter } from "vue-router";
import { getBackend } from "@/components/backendHandler";
import selectUser from "../components/selectUser.vue"
import abort_save_buttons from "@/components/abort_save_buttons.vue";
import TopBar from "@/components/headerBar.vue";

const route = useRoute();
const router = useRouter();

const props = defineProps({
  mode: String, // view || new
});
const original_expense = ref<ExpenseParams>();
const expense = ref<ExpenseParams>({
  id: 0,
  title: "Loading...",
  amount: 0.0,
  timestamp: new Date(),
  payedBy: 0,
  payedFor: [],
});
const group_members = ref([]);

const isEdit = ref(props.mode === "view" ? false : true);

const fetchExpense = () => {};
const fetchPayedfor = () => {};
const fetchGroupMembers = async () => {
  const res = await getBackend("/groups");
  group_members.value = res.result
    .find((group) => group.id === parseInt(route.params.groupID))
    .members.map((member) => ({
      id: member.userId,
      nickname: member.nickname,
    }));
  if (props.mode === "new") {
    expense.value.payedFor = group_members.value.map((member) => (member.id)); 
  }
  console.log("expense: ", expense.value);
};
const postExpense = async () => {
  backToGroups();
};
const updateExpense = async () => {
  backToGroups();
};
const backToGroups = () => {
  router.push(`/groups/${route.params.groupID}`);
};
const abort = () => {
  isEdit.value = false;
  if (props.mode === "new") {
    backToGroups();
  }
};
const saveExpense = async () => {
  isEdit.value = false;
  if (props.mode === "new") {
    postExpense();
  } else {
    //mode === "view" ==> edited existing expense
    updateExpense();
  }
};
onMounted(() => {
  console.log("edit expense aufgerufen");
  fetchGroupMembers();
  //TODO: fetch expense
  //TODO: fetch payedfor
});
</script>

<template>
  <TopBar>{{ props.mode === "view" ? expense.title : "Neue Ausgabe" }}</TopBar>
  <div class="content-container with-top-bar">
    <!-- <h1>Ausgabe:</h1> -->
    <div>
      <button @click="backToGroups" class="btn-primary">< zurück</button>
      <button
        @click="isEdit = true"
        class="btn-secondary"
        v-if="isEdit == false"
      >
        Bearbeiten
      </button>
    </div>
    <div>
      <div>
        <label for="title">Titel</label>
        <input
          v-model="expense.title"
          type="text"
          name="title"
          id="title"
          required
          :disabled="!isEdit"
          autofocus
        />
      </div>
      <div>
        <label for="amount">Preis</label>
        <input
          v-model="expense.amount"
          type="number"
          name="amount"
          id="amount"
          required
          :disabled="!isEdit"
        />
      </div>
      <div>
        <label for="date">Datum</label>
        <input
          v-model="expense.timestamp"
          type="date"
          name="date"
          id="date"
          required
          :disabled="!isEdit"
        />
      </div>
      <div>
        <label for="payedby">Bezahlt von</label>
        <select
          v-model="expense.payedBy"
          class="styled-select"
          :disabled="!isEdit"
        >
          <option disabled value="0">Please select one</option>
          <option
            v-for="member in group_members"
            :key="member.id"
            :value="member.id"
          >
            {{ member.nickname }}
          </option>
        </select>
      </div>
      <div>
        <label for="payedfor">Bezahlt für</label>
        <selectUser v-model:selected="expense.payedFor" :edit="isEdit" :users="group_members"></selectUser>
      </div>
    </div>
    <div v-if="isEdit == true">
      <abort_save_buttons @abort="abort()" @save="saveExpense()"></abort_save_buttons>
    </div>
  </div>
</template>
