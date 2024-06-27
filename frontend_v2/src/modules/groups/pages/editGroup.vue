<script setup lang="ts">
import { useRoute, useRouter } from "vue-router";
import { onMounted, ref } from "vue";
import { deleteBackend, getBackend, postBackend } from "@/components/backendHandler";
import abortSaveButtons from "@/components/abort_save_buttons.vue";
import TopBar from "@/components/headerBar.vue";
import type { GroupResponse } from "@/components/types";

const route = useRoute();
const router = useRouter();

const props = defineProps({
  mode: String, // view || new
});
const isEdit = ref(props.mode === "view" ? false : true);

const groupInfo = ref<GroupResponse>();

const new_group_name = ref<string>("");
const new_member_emails = ref<string[]>([]);
const member_to_add = ref<string>("");

const add_member_to_list = () => {
  const regex_email = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!regex_email.test(member_to_add.value)) {
    alert("Invalid Email");
    return;
  }
  if (new_member_emails.value.includes(member_to_add.value)) {
    alert("Email is already in the list");
    return;
  }
  new_member_emails.value.push(member_to_add.value);
  member_to_add.value = "";
};
const removeFromNewMemberEmails = (email:string) => {
  new_member_emails.value = new_member_emails.value.filter((mail) => mail != email);
};

const fetchGroupInfo = async () => {
  const res = await getBackend(`/groups/group?groupId=${route.params.groupID}`);
  groupInfo.value = res.result;
  if (props.mode == "view") {
    new_group_name.value = res.result.name;
  }
};
const postGroup = async () => {
  try {
    const body = {
      name: new_group_name.value,
      memberEmails: new_member_emails.value,
    };
    await postBackend("/groups", JSON.stringify(body));
    router.push(`/groups`);
  } catch {
    alert("Konnte Gruppe nicht erstellen");
  }
};
const deleteGroup = async () => {
  try {
    const res = await deleteBackend(`/groups/group/${route.params.groupID}`);
    router.push(`/groups`);
  } catch (error) {
    alert("Konnte Gruppe nicht löschen");
  }
}
const abort = () => {
  if (props.mode == "new") {
    router.push("/groups");
    return;
  }
  isEdit.value = false;
  isDelete.value = false;
  new_group_name.value = groupInfo.value?.name ?? "";
  new_member_emails.value = [];
  member_to_add.value = "";
};
const isDelete = ref<boolean>(false);
onMounted(() => {
  if (props.mode === "view") {
    fetchGroupInfo();
  }
});
</script>

<template>
  <TopBar :back_route="`/groups/${route.params.groupID}`">
    <template #default
      >{{
        props.mode === "view" ? groupInfo?.name || "Loading..." : "Neue Gruppe"
      }}
    </template>
    <template #right-side-icon>
      <div v-if="isEdit == false" @click="isEdit = true">
        <font-awesome-icon icon="fa-solid fa-pen-to-square" />
      </div>
      <div v-if="isEdit == true && isDelete == false" @click="isDelete = true">
        <font-awesome-icon icon="fa-solid fa-trash-can" />
      </div>
    </template>
  </TopBar>
  <div v-if="!isDelete" class="content-container with-top-bar">
    <div class="input-field">
      <label for="name">Gruppenname</label>
      <input
        v-model="new_group_name"
        type="text"
        name="name"
        id="name"
        autofocus
        :disabled="!isEdit"
      />
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
        <button
          @click="add_member_to_list()"
          class="btn-primary"
          type="submit"
          :disabled="!isEdit"
        >
          Hinzufügen
        </button>
      </div>
    </div>
    <div>
      <div v-if="new_member_emails.length > 0">
        <label for="members">eingeladene Mitglieder:</label>
        <div v-for="email in new_member_emails" class="input-and-button">
          <div class="like-input">{{ email }}</div>
          <div @click="removeFromNewMemberEmails(email)" v-if="isEdit == true" class="icon-button">
            <font-awesome-icon icon="fa-solid fa-trash-can" />
          </div>
        </div>
      </div>
    </div>
    <div v-if="props.mode == 'view'">
      <label for="members">Mitglieder:</label>
      <div v-for="member in groupInfo?.members" class="input-and-button">
        <div class="like-input">{{ member.nickname }}</div>
      </div>
    </div>
    <abortSaveButtons
      v-if="isEdit == true"
      @save="postGroup()"
      @abort="abort"
    ></abortSaveButtons>
  </div>
  <div v-if="isDelete" class="content-container with-top-bar">
    <h1>Gruppe löschen ?</h1>
    <div class="button-abort-save">
      <button @click="abort" class="btn-secondary biggerButton" type="submit">
        abbrechen
      </button>
      <button @click="deleteGroup" class="btn-primary" type="submit">
        Löschen
      </button>
    </div>
  </div>
</template>

<style scoped>
.input-and-button {
  display: flex;
  gap: 10px;
  justify-content: center;
  margin-bottom: 10px;
}
.icon-button {
  padding: 10px;
}

.button-abort-save {
  display: flex;
  justify-content: space-around;
  margin-top: 20px;
  gap: 12px;
}
.biggerButton{
  flex-grow: 2;
}
</style>
