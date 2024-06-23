<script setup lang="ts">
import { useRoute, useRouter } from "vue-router";
import { onMounted, ref } from "vue";
import { postBackend } from "@/components/backendHandler";
import abortSaveButtons from "@/components/abort_save_buttons.vue"

const route = useRoute();
const router = useRouter();

const props = defineProps({
  mode: String, // view || new
});

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
  <h1>
    {{ props.mode === "view" ? name.value || "Loading..." : "Neue Gruppe" }}
  </h1>
  <div>
    <label for="name">Gruppenname</label>
    <input v-model="name" type="text" name="name" id="name" autofocus/>
  </div>
  <div>
    <label for="add-member">Mitglied hinzufügen</label>
    <input
      v-model="member_to_add"
      type="email"
      name="add-member"
      id="add-member"
      placeholder="moritz.müller@abc.de"
      @keyup.enter="add_member_to_list()"
    />
    <button @click="add_member_to_list()" type="submit">Hinzufügen</button>
  </div>
  <div>
    <p v-for="email in member_emails" class="card">{{ email }}</p>
  </div>
  <abortSaveButtons @save="postGroup()"></abortSaveButtons>
</template>
