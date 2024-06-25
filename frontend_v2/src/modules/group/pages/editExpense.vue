<script setup lang="ts">
import { onMounted, ref } from "vue";
import type { Expense, ExpenseParams } from "../components/types";
import { useRoute, useRouter } from "vue-router";
import {
  backend_url,
  getBackend,
  postBackend,
  getMyUserID,
} from "@/components/backendHandler";
import selectUser from "../components/selectUser.vue";
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
  title: "",
  amount: 0.0,
  timestamp: new Date().toISOString().split('T')[0],
  payedBy: getMyUserID(),
  payedFor: [],
});
const group_members = ref([]);

const isEdit = ref(props.mode === "view" ? false : true);

const fetchExpense = async () => {
  console.log("fetch expense aufgerufen");
  const url = `/expenses/expense?expenseId=${route.params.expenseID}&groupId=${route.params.groupID}`;
  const data = await getBackend(url);
  data.result.timestamp = data.result.timestamp.split('T')[0];
  expense.value = data.result;
  original_expense.value = JSON.parse(JSON.stringify(data.result));//deep copy
};
const fetchGroupMembers = async () => {
  const res = await getBackend("/groups");
  group_members.value = res.result
    .find((group) => group.id === parseInt(route.params.groupID))
    .members.map((member) => ({
      id: member.userId,
      nickname: member.nickname,
    }));
  if (props.mode === "new") {
    expense.value.payedFor = group_members.value.map((member) => member.id);
  }
  console.log("expense: ", expense.value);
};
const postExpense = async () => {
  const body = {
    groupId: route.params.groupID,
    title: expense.value.title,
    amount: expense.value.amount,
    timestamp: expense.value.timestamp,
    payedBy: expense.value.payedBy,
    payedFor: expense.value.payedFor,
  };
  try {
    const res = postBackend("/expenses", JSON.stringify(body));
    backToGroups();
  } catch (error) {
    alert("Error: "+ error)
  }
  
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
  // router.go(0);
  expense.value = JSON.parse(JSON.stringify(original_expense.value));//deep copy
};
const saveExpense = async () => {
  isEdit.value = false;
  if (props.mode == "new") {
    postExpense();
  } else if( props.mode == "view"){
    updateExpense();
  }
};
onMounted(() => {
  console.log("edit expense aufgerufen");
  fetchGroupMembers();
  if (props.mode == "view") {
    fetchExpense();
  }
});

</script>

<template>
  <TopBar :back_route="`/groups/${route.params.groupID}`">
    <template #default
      >{{ props.mode === "view" ? expense.title : "Neue Ausgabe" }}
    </template>
    <template #right-side-icon>
      <div v-if="isEdit == false" @click="isEdit = true">
        <font-awesome-icon icon="fa-solid fa-pen-to-square" />
      </div>
    </template>
  </TopBar>
  <div class="content-container with-top-bar">
    <div></div>
    <div>
      <div class="input-field">
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
      <div class="input-field">
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
      <div class="input-field">
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
      <div class="input-field">
        <label for="payedby">Bezahlt von</label>
        <select
          v-model="expense.payedBy"
          class="like-input"
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
        <selectUser
          v-model:selected="expense.payedFor"
          :edit="isEdit"
          :users="group_members"
        ></selectUser>
      </div>
    </div>
    <div v-if="isEdit == true">
      <abort_save_buttons
        @abort="abort()"
        @save="saveExpense()"
      ></abort_save_buttons>
    </div>
  </div>
</template>
