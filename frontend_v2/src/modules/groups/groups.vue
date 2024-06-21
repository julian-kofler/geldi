<script setup lang="ts">
import { onMounted, ref } from "vue";
import { getBackend } from "@/components/backendHandler";
import groupCard from "./components/groupCard.vue";

const groups = ref([]);

const fetchGroups = async () => {
  const response = await getBackend("/groups");
  if (response.message === "successful") {
    groups.value = response.result;
  } else {
    //TODO: diplay error msg
  }
};
onMounted(() => {
  fetchGroups();
});
</script>

<template>
  <h1>Meine Gruppen</h1>
  <div>
    <router-link
      v-for="group in groups"
      :key="group.id"
      :to="`/groups/${group.id}`"
      tag="div"
      class="group-link"
    >
      <groupCard
        :key="group.id"
        :id="group.id"
        :name="group.name"
        :completed="group.completed"
      />
    </router-link>
  </div>
</template>
