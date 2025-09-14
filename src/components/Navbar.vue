<template>
  <nav>
    <router-link to="/">Accueil</router-link>
    <router-link to="/my-votes">Mes Votes</router-link>
    <router-link v-if="!isAuth" to="/login">Connexion</router-link>
    <button v-else @click="logout">Déconnexion</button>
  </nav>
</template>

<script>
import axios from '../axios';

export default {
  computed: {
    isAuth() {
      return !!localStorage.getItem('token');
    }
  },
  methods: {
    logout() {
      localStorage.removeItem('token');
      delete axios.defaults.headers.common['Authorization'];
      this.$router.push('/login');
    }
  }
};
</script>
