<template>
  <div class="padding">
    <header>
      <img alt="Vue logo" class="logo" src="@/assets/geldi.svg" width="125" height="125" />
      <h1 class="title">Ausgabeverwaltung</h1>
    </header>

    <TextInput name="Email" v-model="email" hint="max.mustermann@abc.de" />
    <TextInput name="Passwort" v-model="password" type="password" hint="Nutze ein Passwort nie zweimal!" />

    <div class="button-container">
      <PrimaryButton @click.prevent="login">Login</PrimaryButton>
    </div>
    <div class="signup">
      <router-link to="/signup">Noch keinen Account? Hier registrieren!</router-link>
    </div>
  </div>
</template>

<script>
import PrimaryButton from '../components/PrimaryButton.vue'
import TextInput from '../components/TextInput.vue'
import { useRouter } from 'vue-router';
export default {
  name: 'Login',
  components: {
    PrimaryButton,
    TextInput
  },
  setup() {
    const router = useRouter();

    return {
      router,
    };
  },
  data() {
    return {
      email: '',
      password: '',
    };
  },
  methods: {
    async login(event) {
      event.preventDefault(); // Prevent form submission

      try {
        const response = await fetch("http://localhost:5000/api/auth/login", {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: this.email,
            password: this.password,
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        localStorage.setItem('jwt', data.jwt);
        localStorage.setItem('refreshToken', data.refreshToken);

        this.router.push('/groups');
      } catch (error) {
        console.error(error);
      }
    },
  },
};
</script>

<style scoped>
.padding {
  padding: 2rem;
}
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
  width: 100%;
  /* Make the input fields wider */
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