<script setup lang="ts">
import { useRoute, useRouter } from "vue-router";
import { onMounted, ref } from "vue";
import { postBackend } from "@/components/backendHandler";
import abortSaveButtons from "@/components/abort_save_buttons.vue";
import TopBar from "@/components/headerBar.vue";

const route = useRoute();
const router = useRouter();

const props = defineProps({
  mode: String, // view || new
});
const isEdit = ref(props.mode === "view" ? false : true);

const name = ref<string>("");
const member_emails = ref<string[]>([]);
const member_to_add = ref<string>("");

const add_member_to_list = () => {
  const regex_email = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!regex_email.test(member_to_add.value)) {
    alert("Invalid Email");
    return;
  }
  if (member_emails.value.includes(member_to_add.value)) {
    alert("Email is already in the list");
    return;
  }
  member_emails.value.push(member_to_add.value);
  member_to_add.value = "";
};

const fetchGroupDetails = async () => {};
const postGroup = async () => {
  try {
    const body = {
      name: name.value,
      memberEmails: member_emails.value,
    };
    postBackend("/groups", JSON.stringify(body));
  } catch {
    alert("Konnte Gruppe nicht erstellen");
  }
};

onMounted(() => {
  if (props.mode === "view") {
    fetchGroupDetails();
  }
});
</script>

<template>
  <!-- <TopBar>{{ props.mode === "view" ? name : "Neue Gruppe" }}</TopBar> -->
  <TopBar>
    <template #default>{{ props.mode === "view" ? name : "Neue Gruppe" }} </template>
    <template #right-side-icon>
      <div v-if="isEdit == false" @click="isEdit = true">
        <font-awesome-icon icon="fa-solid fa-pen-to-square" />
      </div>
    </template>
  </TopBar>
  <div class="content-container with-top-bar">
    <h1>
      {{ props.mode === "view" ? name.value || "Loading..." : "Neue Gruppe" }}
    </h1>
    <div class="input-field">
      <label for="name">Gruppenname</label>
      <input v-model="name" type="text" name="name" id="name" autofocus :disabled="!isEdit"/>
    </div>
    <div v-if="isEdit == true" class="input-field">
      <label for="add-member">Mitglied hinzufügen</label>
      <div class="input-and-button">
        <input
          v-model="member_to_add"
          type="email"
          name="add-member"
          id="add-member"
          placeholder="moritz.müller@abc.de"
          @keyup.enter="add_member_to_list()"
          :disabled="!isEdit"
        />
        <button @click="add_member_to_list()" class="btn-primary" type="submit" :disabled="!isEdit">Hinzufügen</button>
      </div>
    </div>
    <label for="add-member">Mitglieder:</label>
    <div v-for="email in member_emails" class="input-and-button">
      <!-- <p v-for="email in member_emails" class="card">{{ email }}</p> -->
      <div class="like-input">{{ email }}</div>
      <!-- <button class="btn-secondary">entfernen</button> -->
      <button v-if="isEdit == true" class="btn-secondary"><font-awesome-icon icon="fa-solid fa-trash" /></button>
      <!-- <font-awesome-icon icon="fa-solid fa-circle-minus" /> -->
    </div>
    <abortSaveButtons v-if="isEdit == true" @save="postGroup()" @abort="isEdit=false"></abortSaveButtons>
  </div>
</template>

<style scoped>
.input-and-button{
  display: flex;
  gap: 10px;
  justify-content: center;
}
.icon-button{
  padding:10px;
}
</style>