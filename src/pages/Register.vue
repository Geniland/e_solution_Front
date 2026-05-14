<template>
  <div class="auth-container">
    <div class="auth-card">
      <h2>Créer un compte</h2>

      <form @submit.prevent="register" novalidate>
        <!-- NOM -->
        <label>Nom</label>
        <input
          v-model.trim="form.name"
          type="text"
          placeholder="Votre nom"
          required
        />

        <!-- EMAIL -->
        <label>Email</label>
        <input
          v-model.trim="form.email"
          type="email"
          placeholder="email@exemple.com"
          required
        />

        <!-- PASSWORD -->
        <label>Mot de passe</label>
        <input
          v-model="form.password"
          type="password"
          placeholder="********"
          required
        />

        <!-- CONFIRMATION -->
        <label>Confirmation du mot de passe</label>
        <input
          v-model="form.password_confirmation"
          type="password"
          placeholder="********"
          required
        />

        <!-- BOUTON -->
        <button type="submit" :disabled="loading">
          <span v-if="loading">Inscription en cours...</span>
          <span v-else>S'inscrire</span>
        </button>

        <!-- ERREUR -->
        <p v-if="error" class="error">
          {{ error }}
        </p>

        <!-- SUCCÈS -->
        <p v-if="success" class="success">
          ✅ Inscription réussie. Redirection…
        </p>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, inject } from 'vue'
import { useRouter } from 'vue-router'
import axios from '../axios'

const router = useRouter()
const user = inject('user', null) // optionnel si partagé dans App.vue

const loading = ref(false)
const error = ref('')
const success = ref(false)

const form = ref({
  name: '',
  email: '',
  password: '',
  password_confirmation: '',
  role: 'user', // conforme à ton backend
})

/* -------------------------------
   INSCRIPTION
--------------------------------*/
const register = async () => {
  error.value = ''
  success.value = false

  // 🔎 Validation frontend minimale
  if (form.value.password !== form.value.password_confirmation) {
    error.value = 'Les mots de passe ne correspondent pas.'
    return
  }

  loading.value = true

  try {
    // 🔥 Appel API (comme Postman)
    const res = await axios.post('/register', form.value)

    const { token, user: apiUser } = res.data

    // 🔐 Stockage
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(apiUser))

    // 🧠 Injecter token globalement
    axios.defaults.headers.common.Authorization = `Bearer ${token}`

    // 🧩 Mise à jour user global si présent
    if (user) {
      user.value = apiUser
    }

    success.value = true

    // ⏳ Petite pause UX
    setTimeout(() => {
      router.push('/')
    }, 800)

  } catch (err) {
    console.error('Erreur register:', err)

    // 🧠 Gestion propre des erreurs Laravel
    if (!err.response) {
      error.value = 'Impossible de contacter le serveur. Vérifiez votre connexion.'
    }
    else if (err.response.status === 422) {
      error.value = Object.values(err.response.data.errors || {})
        .flat()
        .join('\n')
    }
    else if (err.response.status === 401) {
      error.value = 'Non autorisé.'
    }
    else if (err.response.status === 500) {
      error.value = 'Erreur serveur. Réessayez plus tard.'
    }
    else {
      error.value = err.response.data?.message || 'Erreur lors de l’inscription.'
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
  min-height: 100vh;
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
}

button {
  width: 100%;
  padding: 0.75rem;
  margin-top: 1.2rem;
  background-color: #10b981;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

button:hover:not(:disabled) {
  background-color: #059669;
}

.error {
  color: #dc2626;
  margin-top: 1rem;
  text-align: center;
  white-space: pre-wrap;
}

.success {
  color: #059669;
  margin-top: 1rem;
  text-align: center;
  font-weight: 600;
}
</style>
