<template>
  <button class="primary-button" @click="onClick"><slot></slot></button>
</template>

<script>
export default {
  name: "PrimaryButton",
  props: {
    onClick: {
      type: Function,
      required: true,
    },
  },
};
</script>

<style scoped>
.primary-button {
  background-color: var(--color5);
  color: white;
  border: none;
  padding: 10px 20px;
  cursor: pointer;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 4px 2px;
  transition-duration: 0.4s;
  border-radius: 5px;
}

.primary-button:hover {
  background-color: var(--color2);
  color: black;
}
</style>
