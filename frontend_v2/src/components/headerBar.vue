<script setup lang="ts">
import { useRouter} from "vue-router";

const router = useRouter();
const goBack = () => {
  router.push(props.back_route);
};
const props = defineProps({
  back_route: {
    type: String,
    default: "/groups",
  },
});

</script>

<template>
  <div class="bar top-bar">
    <div @click="goBack" class="side-button">
      <font-awesome-icon icon="fa-solid fa-chevron-left" />
    </div>
    <div @click="$emit('headerTitleClicked')" class="header-title"><slot>top bar</slot></div>
    <div class="side-button">
      <slot name="right-side-icon"></slot>
    </div>
  </div>
</template>

<style scoped>
.side-button {
  /* margin: 20px; */
  padding: 20px;
  /* width: 16px;
  height: 16px; */
}
.header-title{
  padding:20px;
}
</style>
