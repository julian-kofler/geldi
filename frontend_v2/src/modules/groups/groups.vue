<script setup lang="ts">
import { onMounted, ref } from "vue";
import { getBackend } from "@/components/backendHandler";
import groupCard from "./components/groupCard.vue";
import { useRouter } from "vue-router";
import NavigationBar from "@/components/NavigationBar.vue";

const router = useRouter();

const groups = ref([]);

const fetchGroups = async () => {
  const response = await getBackend("/groups");
  groups.value = response.result;
};
onMounted(() => {
  fetchGroups();
});
</script>

<template>
  <h1>Meine Gruppen</h1>
  <button @click="router.push('/groups/new')" class="btn-primary floating-button">
    + Neue Gruppe
  </button>
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
        :completed="group.completed != 0"
      />
    </router-link>
  </div>
  <NavigationBar></NavigationBar>
</template>
