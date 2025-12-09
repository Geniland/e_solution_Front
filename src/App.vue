<template>
  <div class="app-container">
    <header class="navbar">
      <div class="logo">
        <img src="/src/assets/logo.png" alt="logo">
      </div>

      <!-- BOUTON MENU BURGER -->
      <button class="burger" @click="isMenuOpen = !isMenuOpen">
        <span></span><span></span><span></span>
      </button>

      <!-- NAVIGATION -->
      <nav :class="['nav-links', { open: isMenuOpen }]">
        <router-link to="/" exact-active-class="active" @click="closeMenu">Accueil</router-link>
        <router-link to="/my-votes" exact-active-class="active" @click="closeMenu">Mes Votes</router-link>

        <!-- ADMIN -->
        <template v-if="isAdmin">
          <router-link to="/Create-Categories" exact-active-class="active" @click="closeMenu">Catégories</router-link>
          <router-link to="/candidates/create" exact-active-class="active" @click="closeMenu">Candidats</router-link>
        </template>

        <router-link to="/register" exact-active-class="active" @click="closeMenu">Enregistrement</router-link>

        <!-- USER CONNECTÉ -->
        <div v-if="user" class="user-info">
          👤 <strong>{{ user.name || user.email }}</strong>
          <button class="logout-btn" @click="logout">Déconnexion</button>
        </div>

        <!-- NON CONNECTÉ -->
        <router-link v-else to="/login" exact-active-class="active" @click="closeMenu">
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
import { ref, computed, provide, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const router = useRouter()

// utilisateur
const user = ref(JSON.parse(localStorage.getItem('user')))
provide('user', user)

// admin ?
const isAdmin = computed(() => user.value && user.value.role === 'admin')

// menu burger
const isMenuOpen = ref(false)
function closeMenu() {
  isMenuOpen.value = false
}

// vérification session
onMounted(async () => {
  try {
    const { data } = await axios.get('/user', { withCredentials: true })
    user.value = data
    localStorage.setItem('user', JSON.stringify(data))
  } catch {
    user.value = null
    localStorage.removeItem('user')
  }
})

// logout
async function logout() {
  try {
    await axios.post('/logout', {}, { withCredentials: true })
  } catch {}

  user.value = null
  localStorage.clear()
  router.push('/login')
}
</script>

<style scoped>
.app-container {
  flex-direction: column;
  min-height: 100vh;
  font-family: 'Segoe UI', sans-serif;
}

/* HEADER */
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #1e3a8a;
  padding: 1rem 2rem;
  color: #fff;
}

.logo img {
  height: 55px;
}

/* NAVIGATION DESKTOP */
.nav-links {
  display: flex;
  gap: 1.5rem;
  align-items: center;
}

.nav-links a {
  color: #fff;
  text-decoration: none;
  font-weight: 500;
  transition: 0.3s;
}

.nav-links a:hover,
.nav-links a.active {
  color: #ffdd57;
  text-decoration: underline;
}

/* USER */
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
  transition: 0.3s;
}
.logout-btn:hover {
  background: white;
  color: #1e3a8a;
}

/* BUTTON BURGER */
.burger {
  display: none;
  flex-direction: column;
  width: 32px;
  height: 22px;
  justify-content: space-between;
  background: #fff;
  border:#fff;
  cursor: pointer;
}
.burger span {
  height: 4px;
  width: 100%;
  background: white;
  border-radius: 5px;
}

/* RESPONSIVE */
@media (max-width: 850px) {
  .nav-links {
    position: absolute;
    top: 80px;
    right: 0;
    background: #1e3a8a;
    flex-direction: column;
    width: 200px;
    padding: 1.5rem;
    gap: 1rem;
    box-shadow: -2px 4px 10px rgba(0,0,0,0.2);
    transform: translateX(100%);
    transition: 0.3s ease;
    height: auto;
  }

  .nav-links.open {
    transform: translateX(0);
  }

  .burger {
    display: flex;
  }
}

.footer {
  background-color: #4c4f58;
  color: #fff;
  text-align: center;
  padding: 1rem 0;
  margin-top: auto;
}
</style>


<!-- <script setup>
import { ref, computed, provide, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios' // ✅ Import de ton instance Axios configurée

const router = useRouter()

// ✅ user devient réactif
const user = ref(JSON.parse(localStorage.getItem('user')))

// ✅ rendre user accessible dans toute l’app
provide('user', user)

// ✅ Vérifier si l’utilisateur est admin
const isAdmin = computed(() => user.value && user.value.role === 'admin')

// ✅ Vérifier la session à chaque rechargement
onMounted(async () => {
  try {
    const { data } = await axios.get('/user', {
      withCredentials: true,
    })
    user.value = data
    localStorage.setItem('user', JSON.stringify(data))
  } catch {
    user.value = null
    localStorage.removeItem('user')
  }
})

// ✅ Déconnexion
async function logout() {
  try {
    await axios.post('/logout', {}, { withCredentials: true })
  } catch (e) {
    console.warn('Erreur lors de la déconnexion', e)
  }

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
</style> -->
