<template>
  <div class="root">
    <h1 class="title">Neue Ausgabe</h1>
    <TextInput v-model="title" name="Titel" required />
    <TextInput v-model="amount" name="Preis" hint="€€.cc" required />
    <TextInput v-model="date" name="Datum" type="date" required />
    <div class="select-container">
      <label>Bezahlt von:</label>
      <select v-model="payedBy" class="styled-select">
        <option disabled value="">Please select one</option>
        <option
          v-for="member in group_members"
          :key="member.userId"
          :value="member.userId"
        >
          {{ member.nickname }}
        </option>
      </select>
    </div>

    <p />
    <label>Bezahlt für:</label>
    <SelectUser :users="group_members" :multiple="true"></SelectUser>

    <div class="buttonContainer">
      <SecondaryButton @click="abbrechen">Abbrechen</SecondaryButton>
      <PrimaryButton @click="speichern">Speichern</PrimaryButton>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, toRef, watchEffect, provide, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import TextInput from "../components/TextInput.vue";
import PrimaryButton from "../components/PrimaryButton.vue";
import SecondaryButton from "../components/SecondaryButton.vue";
import SelectUser from "../views/selectUser.vue";

const route = useRoute();
const router = useRouter();

const payedBy = ref(-1);

const group_members = ref([]);
const selectedUsers = ref([]);
const title = ref("");
const amount = ref("");
const date = ref(new Date().toISOString());

provide("selectedUsers", selectedUsers);

const refreshjwtToken = async () => {
  const response = await fetch("http://localhost:5000/api/auth/refreshJWT", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      refreshToken: localStorage.getItem("refreshToken"),
    }),
  });
  if (response.ok) {
    const data = await response.json();
    localStorage.setItem("jwt", data.jwt);
    return true;
  } else {
    console.error(
      "Failed to refresh token:",
      response.status,
      response.statusText
    );
    return false;
  }
};

const speichern = async () => {
  let groupId = route.params.groupId;
  console.log("selected users:", selectedUsers.value);
  let response = await fetch(
    `http://localhost:5000/api/groups/${groupId}/expenses`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        groupId: groupId,
        title: title.value,
        amount: amount.value,
        date: date.value,
        payedBy: payedBy.value,
        payedFor:
          selectedUsers.value.length === 0
            ? group_members.value.map((member) => member.userId)
            : selectedUsers.value.map((member) => member.userId),
      }),
    }
  );
  const data = await response.json();
  if (response.ok) {
    router.push(`/groups/${groupId}`);
  } else {
    console.error(
      "Failed to fetch groups:",
      response.status,
      response.statusText
    );
    if (data.message == "Token expired") {
      const refreshed = await refreshjwtToken();
      if (refreshed) {
        await speichern();
      }
    }
  }
};
const loadGroupMembers = async () => {
  let groupId = route.params.groupId;
  let response = await fetch(
    `http://localhost:5000/api/groups/${groupId}/members`,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("jwt")}`,
      },
    }
  );
  const data = await response.json();
  if (response.ok) {
    group_members.value = data.result;
    for (const user of data.result) {
      selectedUsers.value.push(user);
    }
  } else {
    console.error(
      "Failed to fetch groups:",
      response.status,
      response.statusText
    );
    if (data.message == "Token expired") {
      const refreshed = await refreshjwtToken();
      if (refreshed) {
        await loadGroupMembers();
      }
    }
  }
};
const abbrechen = () => {
  router.push(`/groups/${route.params.groupId}`);
};
const loadMyUserId = async () => {
  await loadGroupMembers();
  let response = await fetch("http://localhost:5000/api/user/myUserId", {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("jwt")}`,
    },
  });
  const data = await response.json();
  if (response.ok) {
    payedBy.value = data.userId;

  } else {
    console.error(
      "Failed to fetch groups:",
      response.status,
      response.statusText
    );
    if (data.message == "Token expired") {
      const refreshed = await refreshjwtToken();
      if (refreshed) {
        await loadMyUserId();
      }
    }
  }
};

onMounted(() => {
  loadMyUserId();
  console.log("payedby:", payedBy.value);
  console.log("payedfor:", selectedUsers.value);
});
</script>
<style scoped>
.styled-select {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: white;
  font-size: 16px;
  color: #444;
}

.styled-select:hover {
  border-color: #888;
}

.styled-select:focus {
  outline: none;
  border-color: #555;
}
.select-container {
  width: 100%;
  max-width: 400px; /* Adjust based on your design */
  position: relative;
  border: 1px solid #ccc;
  border-radius: 4px;
  overflow: hidden;
}

.modern-select {
  width: 100%;
  padding: 10px;
  background-color: #fff;
  border: none;
  box-shadow: none;
  appearance: none; /* Remove default styling */
  -moz-appearance: none;
  -webkit-appearance: none;
  cursor: pointer;
}

.modern-select:focus {
  outline: none;
  border-color: #007bff; /* Focus color */
}

.modern-option {
  padding: 10px;
  background-color: #f8f9fa; /* Light background */
}

/* Optional: Style for custom dropdown arrow */
.select-container::after {
  content: "\25BC"; /* Down arrow */
  position: absolute;
  top: 50%;
  right: 15px;
  transform: translateY(-50%);
  pointer-events: none; /* Makes it unclickable */
  color: #007bff; /* Arrow color */
}
.root {
  padding: 2rem;
}

.input-field {
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
}

.input-label {
  font-size: 1em;
  color: #555;
  margin-bottom: 10px;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.input-text {
  padding: 12px;
  font-size: 1em;
  border: none;
  border-radius: 5px;
  box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.1);
  outline: none;
}

.title {
  color: var(--color5);
  text-align: center;
  font-size: 2em;
}

.input-text::placeholder {
  color: #888;
  opacity: 0.5;
}
.buttonContainer {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}
@media (max-width: 600px) {
  .input-text {
    font-size: 1.2em;
  }
}
</style>
