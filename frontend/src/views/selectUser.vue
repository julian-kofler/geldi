<template>
  <div>
    <ul>
      <li v-for="user in users" :key="user.id" @click="selectUser(user)">
        {{ nickname }}
        <span v-if="isSelected(user)"> (selected)</span>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    users: Array,
    multiple: Boolean,
  },
  data() {
    return {
      selectedUsers: [],
      nickname: "", // New data property for storing the fetched nickname
    };
  },
  methods: {
    async fetchNickname(userId) {
      try {
        const response = await fetch(
          `http://localhost:5000/api/user/nickname/${userId}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch nickname");
        }
        const data = await response.json();
        this.nickname = data.nickname; // Assuming the response contains a field 'nickname'
      } catch (error) {
        console.error("Error fetching nickname:", error);
        this.nickname = "Error fetching nickname";
      }
    },
    selectUser(user) {
      if (this.multiple) {
        const index = this.selectedUsers.findIndex((u) => u.id === user.id);
        if (index > -1) {
          this.selectedUsers.splice(index, 1); // Deselect if already selected
        } else {
          this.selectedUsers.push(user); // Select
        }
      } else {
        this.selectedUsers = [user]; // Replace the selection
        this.fetchNickname(user.id); // Fetch the nickname when a user is selected
      }
      this.$emit("update:selectedUsers", this.selectedUsers);
    },
    isSelected(user) {
      return this.selectedUsers.some((u) => u.id === user.id);
    },
  },
};
</script>

<style>
li {
  cursor: pointer;
}
li:hover {
  background-color: #f0f0f0;
}
</style>
