<template>
  <div class="app-container">
    <header class="navbar">
      <div class="logo">🗳️ E-Vote</div>

      <nav class="nav-links">
        <router-link to="/" exact-active-class="active">Accueil</router-link>
        <router-link to="/my-votes" exact-active-class="active">Mes Votes</router-link>

        <!-- 👇 Liens visibles uniquement pour les admin -->
        <template v-if="isAdmin">
          <router-link to="/Create-Categories" exact-active-class="active">Catégories</router-link>
          <router-link to="/candidates/create" exact-active-class="active">Candidats</router-link>
        </template>

        <router-link to="/register" exact-active-class="active">Enregistrement</router-link>

        <!-- ✅ Si utilisateur connecté -->
        <div v-if="user" class="user-info">
          👤 <strong>{{ user.name || user.email }}</strong>
          <button class="logout-btn" @click="logout">Déconnexion</button>
        </div>

        <!-- ✅ Si non connecté -->
        <router-link v-else to="/login" exact-active-class="active">
          Connexion
        </router-link>
      </nav>
    </header>

    <main class="main-content">
      <router-view />
    </main>

    <footer class="footer">
      <p>&copy; 2025 Plateforme de Vote Sécurisée | Tous droits réservés</p>
    </footer>
  </div>
</template>

<script setup>
import { ref, computed, provide } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// ✅ user devient réactif
const user = ref(JSON.parse(localStorage.getItem('user')))

// ✅ rendre user accessible dans toute l’app
provide('user', user)

const isAdmin = computed(() => user.value && user.value.role === 'admin')

function logout() {
  user.value = null
  localStorage.removeItem('user')
  localStorage.removeItem('token')
  router.push('/login')
}
</script>

<style scoped>
.app-container {
  flex-direction: column;
  min-height: 100vh;
  font-family: 'Segoe UI', sans-serif;
}
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #1e3a8a;
  padding: 1rem 2rem;
  color: #fff;
}
.nav-links {
  display: flex;
  gap: 1.5rem;
  align-items: center;
}
.nav-links a {
  color: #fff;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s ease;
}
.nav-links a:hover,
.nav-links a.active {
  color: #ffdd57;
  text-decoration: underline;
}
.user-info {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  color: #ffdd57;
}
.logout-btn {
  background: transparent;
  border: 1px solid white;
  color: white;
  cursor: pointer;
  padding: 0.3rem 0.8rem;
  border-radius: 4px;
  font-size: 0.9rem;
  transition: 0.3s;
}
.logout-btn:hover {
  background: white;
  color: #1e3a8a;
}
.footer {
  background-color: #4c4f58;
  color: #fff;
  text-align: center;
  padding: 1rem 0;
  font-size: 0.9rem;
  margin-top: auto;
}
</style>
