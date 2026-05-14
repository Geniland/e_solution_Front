<template>
  <div class="login-page">
    <h2>Connexion</h2>

    <div v-if="errorMessage" class="error-box">
      {{ errorMessage }}
    </div>

    <input v-model="email" placeholder="Email" />
    <input v-model="password" type="password" placeholder="Mot de passe" />

    <button :disabled="loading" @click="login">
      {{ loading ? 'Connexion...' : 'Se connecter' }}
    </button>
  </div>
</template>


<script setup>
import { ref, inject } from 'vue'
import { useRouter } from 'vue-router'
import axios from '../axios'

const router = useRouter()
const user = inject('user')

const email = ref('')
const password = ref('')
const errorMessage = ref('')
const loading = ref(false)

async function login() {
  errorMessage.value = ''
  loading.value = true

  try {
    const res = await axios.post('https://api.digitalareas.com/api/login', {
      email: email.value,
      password: password.value
    })

    const token = res.data.access_token
    localStorage.setItem('token', token)
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + token

    user.value = res.data.user
    localStorage.setItem('user', JSON.stringify(res.data.user))

    router.push('/')
  } catch (err) {
    if (!err.response) {
      errorMessage.value = 'Impossible de contacter le serveur.'
    } else {
      const status = err.response.status
      const data = err.response.data

      if (status === 401) {
        errorMessage.value = data.message || 'Identifiants incorrects'
      } else if (status === 422) {
        errorMessage.value = 'Veuillez remplir tous les champs correctement.'
      } else if (status === 500) {
        errorMessage.value = 'Erreur serveur. Réessayez plus tard.'
      } else {
        errorMessage.value = 'Une erreur inattendue est survenue.'
      }
    }
  } finally {
    loading.value = false
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

.error-box {
  background: #fee2e2;
  color: #991b1b;
  padding: 0.7rem;
  border-radius: 6px;
  font-size: 0.9rem;
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

button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

button:hover:not(:disabled) {
  background-color: #3048c7;
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
