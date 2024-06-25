<script setup lang="ts">
import type { GroupMember } from "@/components/types";

const props = defineProps<{
  users: GroupMember[];
  edit: boolean;
}>();

const selected = defineModel<number[]>("selected", { required: true });

const toggleSelect = (id: number) => {
  if (props.edit === false) return;
  if (!isSelected(id)) {
    selected.value.push(id);
  } else {
    selected.value = selected.value.filter((selectedId) => selectedId !== id);
  }
};
const isSelected = (id: number) => {
  return selected.value.some((user) => user === id);
};
</script>

<template>
  <div class="user-select-container">
    <ul class="user-list">
      <li
        v-for="user in props.users"
        :key="user.userId"
        @click="toggleSelect(user.userId)"
        :class="{
          'select-user': true,
          selected: isSelected(user.userId),
        }"
      >
        {{ user.nickname }}
      </li>
    </ul>
  </div>
</template>

<style scoped>
.select-user {
  padding: 12px;
  font-size: 1em;
  border-radius: 5px;
  box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.1);
  outline: none;
  width: fit-content;

  border: 1px solid #ccc;
  box-sizing: border-box;

  color: rgb(119, 119, 119);
}
.user-list {
  list-style-type: none;
  flex-wrap: wrap;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  padding: 0;
  align-content: flex-start;
}
.selected {
  border-color: var(--coloraccent);
  color: black;
}
.user-list li {
  display: inline-block;
}
</style>
