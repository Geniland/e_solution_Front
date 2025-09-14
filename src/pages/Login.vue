<template>
  <div>
    <h2>Connexion</h2>
    <input v-model="email" placeholder="Email" />
    <input v-model="password" type="password" placeholder="Mot de passe" />
    <button @click="login">Se connecter</button>
  </div>
</template>

<script>
import axios from '../axios';

export default {
  data() {
    return {
      email: '',
      password: ''
    };
  },
  methods: {
    async login() {
      try {
        const res = await axios.post('/login', {
          email: this.email,
          password: this.password
        });
        const token = res.data.token;
        localStorage.setItem('token', token);
        axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;
        this.$router.push('/Create-Categories');
      } catch (err) {
        alert(err.response?.data?.message || 'Erreur de connexion');
      }
    }
  }
};
</script>
