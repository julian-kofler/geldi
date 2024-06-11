<template>
  <div class="input-field">
    <label :for="name" class="input-label">{{ name }}</label>
    <input :id="name" :name="name" :type="type" v-model="inputValue" class="input-text" />
  </div>
</template>

<script>
export default {
  name: 'TextInput',
  props: {
    name: {
      type: String,
      required: true
    },
    type: {
      type: String,
      default: 'text'
    },
    modelValue: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      inputValue: this.modelValue
    };
  },
  watch: {
    modelValue(newVal) {
      this.inputValue = newVal;
    },
    inputValue(newVal) {
      this.$emit('update:modelValue', newVal);
    }
  }
};
</script>
  
  <style scoped>
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
  
  @media (max-width: 600px) {
    .input-text {
      font-size: 1.2em;
    }
  }
  </style>