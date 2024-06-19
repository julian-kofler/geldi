<template>
  <div class="root">
    <h1 class="title">Neue Gruppe</h1>
    <TextInput v-model="groupname" name="Gruppename" />

    <div class="add-member">
      <TextInput
        v-model="addedMember"
        name="Mitglied hinzufügen"
        hint="z.B.: max.müller@gmx.com"
      />
      <PrimaryButton @click="addMember">Hinzufügen</PrimaryButton>
    </div>
    <h2>Mitglieder:</h2>
    <ul class="member-list">
      <li v-for="member in members" :key="member.id">{{ member.nickname }}</li>
    </ul>
    <div class="buttonContainer">
      <SecondaryButton @click="abbrechen">Abbrechen</SecondaryButton>
      <PrimaryButton @click="speichern">Speichern</PrimaryButton>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import TextInput from "../components/TextInput.vue";
import PrimaryButton from "../components/PrimaryButton.vue";
import SecondaryButton from "../components/SecondaryButton.vue";

const groupname = ref("");
const members = ref([]);
const addedMember = ref("");

const router = useRouter();

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
  let response = await fetch(`http://localhost:5000/api/groups`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("jwt")}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: groupname.value,
      members: members.value.map(member => member.id),
    }),
  });
  const data = await response.json();
  if (response.ok) {
    router.push(`/groups`);
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

const fetch_user_from_email_and_add_to_members = async (email) => {
  const response = await fetch(
    `http://localhost:5000/api/user/userid/${email}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("jwt")}`,
      },
    }
  );
  const data = await response.json();
  if (response.ok) {
    // console.log("data.result", data.result);
    if (members.value.includes(data.result.id)) {
      console.log("User already in group");
    } else {
      members.value.push(data.result);
    }
  } else {
    console.error("Failed to fetch me:", response.status, response.statusText);
    if (data.message == "Token expired") {
      const refreshed = await refreshjwtToken();
      if (refreshed) {
        await fetch_and_add_me();
      }
    }
  }
};
const fetch_and_add_me = async () => {
  const response = await fetch(`http://localhost:5000/api/user/myUserId`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("jwt")}`,
    },
  });
  const data = await response.json();
  if (response.ok) {
    members.value.push({ id: data.userId, nickname: "(Ich)" });
  } else {
    console.error("Failed to fetch me:", response.status, response.statusText);
    if (data.message == "Token expired") {
      const refreshed = await refreshjwtToken();
      if (refreshed) {
        await fetch_and_add_me();
      }
    }
  }
};
const abbrechen = () => {
  router.push(`/groups`);
};
const addMember = () => {
  fetch_user_from_email_and_add_to_members(addedMember.value);
  addedMember.value = "";
};
onMounted(() => {
  fetch_and_add_me();
});
</script>
<style scoped>
.member-list {
  display: flex;
  flex-direction: column;
  padding: 0;
  margin: 20px 0;
  list-style: none;
}

.member-list li {
  background-color: #f0f0f0; /* Light grey background */
  margin: 10px 0;
  padding: 10px 20px;
  border: 1px solid #ccc; /* Light grey border */
  border-radius: 8px; /* Rounded corners */
  font-family: 'Arial', sans-serif; /* Modern, readable font */
  transition: transform 0.2s ease-in-out, background-color 0.2s ease-in-out; /* Smooth transition for hover effects */
}

.member-list li:hover {
  transform: scale(1.02); /* Slightly enlarge on hover */
  background-color: #e0e0e0; /* Slightly darker grey on hover */
}

@media (max-width: 600px) {
  .member-list {
    flex-direction: column;
  }

  .member-list li {
    margin: 5px 0; /* Smaller margin on smaller screens */
  }
}
.add-member {
  display: flex;
  gap: 10px;
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

@media (max-width: 600px) {
  .input-text {
    font-size: 1.2em;
  }
}
.buttonContainer {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}
</style>
