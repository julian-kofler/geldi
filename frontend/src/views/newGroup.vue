<template>
  <div class="root">
    <h1 class="title">Neue Gruppe</h1>
    <TextInput v-model="groupname" name="Gruppename" />
    <secondaryButton @click="abbrechen">Abbrechen</secondaryButton>
    <PrimaryButton @click="speichern">Speichern</PrimaryButton>
  </div>
</template>

<script>
import TextInput from "../components/TextInput.vue";
import PrimaryButton from "../components/PrimaryButton.vue";
import SecondaryButton from "../components/SecondaryButton.vue";

export default {
  components: {
    TextInput,
    PrimaryButton,
    SecondaryButton,
  },
  data() {
    return {
      groupname: "",
      members: [],
    };
  },
  methods: {
    async refreshjwtToken() {
      const response = await fetch(
        "http://localhost:5000/api/auth/refreshJWT",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            refreshToken: localStorage.getItem("refreshToken"),
          }),
        }
      );
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
    },
    async speichern() {
      let response = await fetch(`http://localhost:5000/api/groups`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: this.groupname,
          members: ["1", "2", "3", "14"],
        }),
      });
      const data = await response.json();
      if (response.ok) {
        this.$router.push(`/groups`);
      } else {
        console.error(
          "Failed to fetch groups:",
          response.status,
          response.statusText
        );
        if (data.message == "Token expired") {
          const refreshed = await this.refreshjwtToken();
          if (refreshed) {
            await this.speichern();
          }
        }
      }
    },
    abbrechen() {
      this.$router.push(`/groups`);
    },
  },
};
</script>
<style scoped>
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
</style>
