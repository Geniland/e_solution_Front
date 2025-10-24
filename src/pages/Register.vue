<template>
  <div class="auth-container">
    <div class="auth-card">
      <h2>Créer un compte</h2>

      <form @submit.prevent="register">
        <label>Nom</label>
        <input v-model="form.name" type="text" required />

        <label>Email</label>
        <input v-model="form.email" type="email" required />

        <label>Mot de passe</label>
        <input v-model="form.password" type="password" required />

        <label>Confirmation du mot de passe</label>
        <input v-model="form.password_confirmation" type="password" required />

        <button type="submit" :disabled="loading">
          {{ loading ? "Inscription..." : "S'inscrire" }}
        </button>

        <p v-if="error" class="error">{{ error }}</p>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from '../axios';
import { useRouter } from 'vue-router'

const router = useRouter()
const form = ref({
  name: '',
  email: '',
  password: '',
  password_confirmation: ''
})
const error = ref('')
const loading = ref(false)

const register = async () => {
  error.value = ''
  loading.value = true

  try {
    // Étape 1 : Obtenir le cookie CSRF
    await axios.get('http://127.0.0.1:8000/sanctum/csrf-cookie', {
      withCredentials: true,
    })

    // Étape 2 : Envoi du formulaire
    await axios.post('/register', form.value, {
      withCredentials: true,
    })

    // Étape 3 : Récupération du user connecté
    const { data: user } = await axios.get('/user', {
      withCredentials: true,
    })

    // Étape 4 : Sauvegarde du user
    localStorage.setItem('user', JSON.stringify(user))

    // Rediriger vers l’accueil
    router.push('/login')
  } catch (e) {
    console.error(e)
    if (e.response?.data?.errors) {
      error.value = Object.values(e.response.data.errors).flat().join('\n')
    } else {
      error.value = 'Erreur lors de l’inscription.'
    }
  } finally {
    loading.value = false
  }
}

</script>

<style scoped>
.auth-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f3f4f6;
}

.auth-card {
  background: white;
  padding: 2.5rem;
  border-radius: 12px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 450px;
}

h2 {
  text-align: center;
  margin-bottom: 1.5rem;
  color: #1f2937;
}

label {
  display: block;
  margin: 1rem 0 0.25rem;
  font-weight: 600;
}

input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 1rem;
  margin-bottom: 0.5rem;
}

button {
  width: 100%;
  padding: 0.75rem;
  margin-top: 1rem;
  background-color: #10b981;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

button:hover {
  background-color: #059669;
}

.error {
  color: #dc2626;
  margin-top: 1rem;
  text-align: center;
  white-space: pre-wrap;
}
</style>
