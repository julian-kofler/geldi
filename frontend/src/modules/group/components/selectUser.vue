<script setup lang="ts">
import type { GroupMember } from "@/components/types";
import {getMyUserID} from "@/components/backendHandler.js"

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
      <div
        v-for="user in props.users"
        :key="user.userId"
        @click="toggleSelect(user.userId)"
        :class="{
          'select-user': true,
          selected: isSelected(user.userId),
        }"
      >
        <i v-if="user.userId === getMyUserID()">Dich</i>
        <span v-else>{{ user.nickname }}</span>
      </div>
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

  border: 2px solid #ccc;
  box-sizing: border-box;

  color: rgb(157, 157, 157);
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
  background-color: rgba(255, 255, 255, 0);
  box-shadow: 3px 3px 7px rgba(0, 0, 0, 0.452)
}
.user-list li {
  display: inline-block;
}
</style>
