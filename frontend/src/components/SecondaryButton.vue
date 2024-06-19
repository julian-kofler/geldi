<template>
  <button class="secondary-button" @click="onClick"><slot></slot></button>
</template>

<script>
export default {
  name: "SecondaryButton",
  props: {
    onClick: {
      type: Function,
      required: true,
    },
  },
};
</script>

<style scoped>
.secondary-button {
  box-sizing: border-box; /* Add this line */
  background-color: white;
  color: black;
  border: 2px solid var(--color5);
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

.secondary-button:hover {
  background-color: var(--color2);
  color: black;
}
</style>
