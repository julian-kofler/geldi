<template>
  <div class="user-select-container">
    <ul class="user-list">
      <li
        v-for="user in users"
        :key="user.userId"
        @click="selectUser(user)"
        :class="{ 'selected': isSelected(user), 'unselected': !isSelected(user) }"
      >
        {{ user.nickname || 'Loading...'}}
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, reactive, toRefs, watchEffect, provide, inject, onMounted } from "vue";
import { defineProps } from "vue";

const props = defineProps({
  users: Array,
  multiple: Boolean,
});

const selectedUsers = inject("selectedUsers") || ref([]);

const selectUser = (user) => {
  if (props.multiple) {
    const index = selectedUsers.value.findIndex((u) => u.userId === user.userId);
    if (index > -1) {
      selectedUsers.value.splice(index, 1); // Deselect if already selected
    } else {
      selectedUsers.value.push(user); // Select if not already selected
    }
  } else {
    selectedUsers.value = [user]; // Replace the selected user if not multiple
  }
};
const isSelected = (user) => {
  return selectedUsers.value.some(selectedUser => selectedUser.userId === user.userId);
};
</script>

<style scoped>
.unselected {
  background-color: #f8f9fa; /* Light grey background for unselected users */
  color: #212529; /* Dark grey text for better readability */
  padding: 10px 15px; /* Consistent padding with selected users */
  margin: 5px 0; /* Consistent margin with selected users */
  border-radius: 5px; /* Rounded corners for a modern look */
  
  transition: background-color 0.3s ease, border-color 0.3s ease; /* Smooth transition for hover */
}

.unselected:hover {
  background-color: #e2e6ea; /* Slightly darker shade on hover for interactive feedback */
  border-color: #dae0e5; /* Darker border on hover */
}

/* Existing styles for .selected and other elements */
.selected {
  background-color: #007BFF; /* A more vibrant blue */
  color: white; /* White text for better contrast */
  padding: 10px 15px; /* Increased padding for a better visual structure */
  margin: 5px 0; /* Adds space between items */
  border-radius: 5px; /* Rounded corners for a modern look */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* Subtle shadow for depth */
  transition: background-color 0.3s ease, box-shadow 0.2s ease; /* Smooth transition for hover and focus */
}

.selected:hover {
  background-color: #0056b3; /* Slightly darker shade of blue on hover for interactive feedback */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); /* Increased shadow on hover for a "lifted" effect */
}
.user-list li {
  display: inline-block; /* Allows the element's width to fit its content */
  white-space: nowrap; /* Prevents text from wrapping */
  padding: 5px 10px; /* Adjust as needed for padding around the text */
  margin: 5px; /* Space between list items */
  border: 1px solid #ccc; /* Optional: adds a border */
  border-radius: 5px; /* Optional: rounds the corners */
}

.user-list {
  list-style-type: none; /* Remove default list styling */
  padding: 0; /* Remove default padding */
  width: fit-content;
  flex-wrap: wrap;
}
.user-select-container {
  max-width: 400px; /* Adjust based on your design */
  margin: 0 auto; /* Center the list */
  flex-wrap: wrap;
}
</style>