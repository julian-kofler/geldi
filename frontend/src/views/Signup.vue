<template>
    <header>
      <img alt="Vue logo" class="logo" src="@/assets/geldi.svg" width="125" height="125" />
      <h1 class="title">Registrieren</h1>
    </header>
    <div class="form-group">
        <label for="nickname">Nickname:</label>
        <input type="text" id="nickname" v-model="nickname" required>
    </div>
    <div class="form-group">
        <label for="email">Email:</label>
        <input type="text" id="email" v-model="email" required>
    </div>

    <div class="form-group">
        <label for="password">Password:</label>
        <input type="password" id="password" v-model="password" required>
    </div>

    <div class="button-container">
        <!-- <button class="login-button" type="submit" @click="login">Login</button> -->
        <button class="login-button" type="submit" @click.prevent="login">Registrieren</button>
    </div>
    
    <div class="signup">
        <router-link to="/login">Schon einen Account? Hier einloggen!</router-link>
    </div>
</template>

<script>
export default {
    data() {
        return {
            email: '',
            password: '',
            nickname: '',
        };
    },
    methods: {
        async login(event) {
            event.preventDefault(); // Prevent form submission

            try {
                const response = await fetch("http://localhost:5000/api/auth/signup", {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        email: this.email,
                        password: this.password,
                        nickname: this.nickname,
                    }),
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                localStorage.setItem('jwt', data.jwt);
                localStorage.setItem('refreshToken', data.refreshToken);
            } catch (error) {
                console.error(error);
            }
        },
    },
};
</script>

<style scoped>
.logo {
  display: block;
  margin: 0 auto 2rem;
}

.title {
  color: var(--color5); 
  text-align: center; 
  font-size: 2em;
}
.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
}
.form-group input {
  width: 100%; /* Make the input fields wider */
}
.login-button {
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

.login-button:hover {
  background-color: var(--color2);
  color: black;
}
.button-container {
  display: flex;
  justify-content: center;
}
.signup {
  text-align: center;
  margin-top: 1rem;
}
</style>