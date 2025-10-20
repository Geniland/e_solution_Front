<template>
  <div class="login-page">
    <h2>Connexion</h2>
    <input v-model="email" placeholder="Email" />
    <input v-model="password" type="password" placeholder="Mot de passe" />
    <button @click="login">Se connecter</button>
  </div>
</template>

<script setup>
import { ref, inject } from 'vue'
import { useRouter } from 'vue-router'
import axios from '../axios'

const router = useRouter()
const user = inject('user') // ✅ récupère la variable partagée de App.vue

const email = ref('')
const password = ref('')

async function login() {
  try {
    const res = await axios.post('/login', {
      email: email.value,
      password: password.value
    })

    const token = res.data.access_token || res.data.token
    localStorage.setItem('token', token)
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + token

    user.value = res.data.user // ✅ réactif — met à jour immédiatement le menu
    localStorage.setItem('user', JSON.stringify(res.data.user))

    router.push('/')
  } catch (err) {
    alert(err.response?.data?.message || 'Erreur de connexion')
  }
}
</script>

<style scoped>
.login-page {
  display: flex;
  flex-direction: column;
  max-width: 400px;
  margin: 3rem auto;
  gap: 1rem;
}
button {
  background-color: #1e3a8a;
  color: white;
  border: none;
  padding: 0.7rem;
  cursor: pointer;
  border-radius: 6px;
  transition: 0.3s;
}
button:hover {
  background-color: #3048c7;
}
</style>
