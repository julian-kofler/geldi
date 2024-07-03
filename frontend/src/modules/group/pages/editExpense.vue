<script setup lang="ts">
import { onMounted, ref, computed } from "vue";
import type {
  ExpenseParams,
  GroupMember,
  GroupResponse,
} from "@/components/types";
import { useRoute, useRouter } from "vue-router";
import {
  getBackend,
  postBackend,
  putBackend,
  getMyUserID,
  deleteBackend,
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
  groupId: parseInt(route.params.groupID as string),
  title: "",
  amount: 0.0,
  timestamp: new Date().toISOString(),
  payedBy: getMyUserID(),
  payedFor: [],
});
const date = computed({
  get() {
    return expense.value.timestamp.split('T')[0];
  },
  set(date: string) {
    expense.value.timestamp = date;
  }
})

const groupInfo = ref<GroupResponse>();
const fetchGroupInfo = async () => {
  try {
    const res = await getBackend(`/groups/group?groupId=${route.params.groupID}`);
    groupInfo.value = res.result;
    expense.value.payedFor = res.result.members.map((member:GroupMember) => member.userId);
  } catch (error) {
    alert("Konnte Gruppeninfo nicht laden!");
  }
};

const isEdit = ref(props.mode === "view" ? false : true);

const fetchExpense = async () => {
  try {
    const url = `/expenses/expense?expenseId=${route.params.expenseID}&groupId=${route.params.groupID}`;
    const data = await getBackend(url);
    data.result.timestamp = data.result.timestamp;
    expense.value = data.result;
    original_expense.value = JSON.parse(JSON.stringify(data.result)); //deep copy
  } catch (error) {
    alert("Konnte Ausgabe nicht laden!");
  }
};
const postExpense = async () => {
  try {
    const res = await postBackend("/expenses", JSON.stringify(expense.value));
    isEdit.value = false;
    backToGroups();
  } catch (error) {
    alert("Error: " + error);
  }
};
const updateExpense = async () => {
  try {
    const res = await putBackend("/expenses", JSON.stringify(expense.value));
    isEdit.value = false;
    backToGroups();
  } catch (error) {
    alert("Error: " + error);
  }
};
const backToGroups = () => {
  router.push(`/groups/${route.params.groupID}`);
};
const abort = () => {
  isEdit.value = false;
  if (props.mode === "new") {
    backToGroups();
  }
  expense.value = JSON.parse(JSON.stringify(original_expense.value)); //deep copy
};
const saveExpense = async () => {
  if (props.mode == "new") {
    await postExpense();
  } else if (props.mode == "view") {
    await updateExpense();
  }
};

const isDelete = ref<boolean>(false);
const deleteExpense = async () => {
  try {
    const res = await deleteBackend(`/expenses/group/${route.params.groupID}/expense/${expense.value.id}`);
    router.push(`/groups/${route.params.groupID}`);
  } catch (error) {
    alert("Konnte Gruppe nicht löschen");
  }
}
onMounted( async () => {
  await fetchGroupInfo();
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
      <div v-if="isEdit == true && isDelete == false && props.mode == 'view'" @click="isDelete = true">
        <font-awesome-icon icon="fa-solid fa-trash-can" />
      </div>
    </template>
  </TopBar>
  <form
    @submit.prevent="saveExpense()"
    v-if="!isDelete"
    class="content-container with-top-bar"
  >
    <div class="input-field">
      <label for="title">Titel</label>
      <input
        v-model="expense.title"
        type="text"
        name="title"
        id="title"
        required
        pattern="^[a-zA-Z0-9_%+-]+$"
        maxlength="128"
        title="bitte Titel eingeben"
        :disabled="!isEdit"
        autofocus
      />
    </div>
    <div class="input-field">
      <label for="amount">Preis</label>
      <input
        v-model="expense.amount"
        type="number"
        step="0.01"
        min="0.01"
        max="1000000"
        name="amount"
        id="amount"
        required
        :disabled="!isEdit"
      />
    </div>
    <div class="input-field">
      <label for="date">Datum</label>
      <input
        v-model="date"
        type="date"
        name="date"
        id="date"
        required
        :disabled="!isEdit"
      />
    </div>
    <div class="input-field">
      <label for="payedby">Bezahlt von</label>
      <select v-model="expense.payedBy" class="like-input" :disabled="!isEdit">
        <option disabled value="0">Bitte jemand auswählen</option>
        <option
          v-for="member in groupInfo?.members"
          :key="member.userId"
          :value="member.userId"
        >
          {{ member.userId === getMyUserID() ? 'Dir' : member.nickname }}
        </option>
      </select>
    </div>
    <div>
      <label for="payedfor">Bezahlt für</label>
      <selectUser
        v-model:selected="expense.payedFor"
        :edit="isEdit"
        :users="groupInfo?.members as GroupMember[]"
      ></selectUser>
      <i v-if="expense.payedFor.length < 1" class="validation-error">muss für min. eine Person bezahlt sein</i>
    </div>
    <abort_save_buttons
      v-if="isEdit == true"
      @abort="abort()"
    ></abort_save_buttons>
  </form>
  <div v-if="isDelete" class="content-container with-top-bar">
    <h1>Ausgabe löschen ?</h1>
    <abort_save_buttons
      v-if="isEdit == true"
      @abort="isDelete = false"
      @save="deleteExpense"
      :primaryButtonText="'Löschen'"
      :bigger="'secondary'"
    ></abort_save_buttons>
  </div>
</template>

<style scoped>
.button-abort-save {
  display: flex;
  justify-content: space-around;
  margin-top: 20px;
  gap: 12px;
}
.biggerButton {
  flex-grow: 2;
}
</style>
