<template>
    <div>
        <form @submit.prevent="login">
            <label for="username">Username:</label>
            <input type="text" id="username" v-model="username" required>

            <label for="password">Password:</label>
            <input type="password" id="password" v-model="password" required>

            <button type="submit">Login</button>
        </form>
    </div>
</template>

<script>
export default {
    data() {
        return {
            username: '',
            password: '',
        };
    },
    methods: {
        login() {
            // Handle login here
            console.log(`Logging in with username: ${this.username} and password: ${this.password}`);
        },
    },
};
</script>

<style scoped>
/* Add your styles here */
</style>