<template>
  <div class="app-container">
    <header class="navbar">
      <div class="logo">
        <img src="/src/assets/logo.png" alt="logo">
      </div>

      <!-- BOUTON MENU BURGER -->
      <!-- <button class="burger" @click="isMenuOpen = !isMenuOpen">
        <span></span><span></span><span></span>
      </button> -->

      <button
        class="burger"
        :class="{ active: isMenuOpen }"
        @click="isMenuOpen = !isMenuOpen"
        aria-label="Menu"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>


      <!-- NAVIGATION -->
      <nav :class="['nav-links', { open: isMenuOpen }]">
        <router-link to="/" exact-active-class="active" @click="closeMenu">Accueil</router-link>
        <!-- <router-link to="/my-votes" exact-active-class="active" @click="closeMenu">Mes Votes</router-link> -->

        <!-- ADMIN -->
        <template v-if="isAdmin">
          <router-link to="/Create-Categories" exact-active-class="active" @click="closeMenu">Catégories</router-link>
          <router-link to="/candidates/create" exact-active-class="active" @click="closeMenu">Candidats</router-link>
        </template>

        <router-link
        v-if="!user"
        to="/register"
        exact-active-class="active"
        @click="closeMenu"
      >
        Enregistrement
      </router-link>


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
import axios from './axios' // ⚠️ ton axios configuré

const router = useRouter()

// 🔐 token = source de vérité
const token = ref(localStorage.getItem('token'))

// 👤 utilisateur (null par défaut)
const user = ref(null)
provide('user', user)

// 🛡 admin
const isAdmin = computed(() => user.value?.role === 'admin')

// 🍔 menu burger
const isMenuOpen = ref(false)
const closeMenu = () => (isMenuOpen.value = false)

// 🔄 au chargement
onMounted(async () => {
  if (!token.value) {
    user.value = null
    return
  }

  try {
    // injecter token
    axios.defaults.headers.common['Authorization'] = `Bearer ${token.value}`

    // 🔥 route protégée token (ex: /me)
    const { data } = await axios.get('/me')
    user.value = data
    localStorage.setItem('user', JSON.stringify(data))
  } catch (e) {
    // token invalide
    logout()
  }
})

// 🚪 logout
function logout() {
  user.value = null
  token.value = null

  localStorage.removeItem('token')
  localStorage.removeItem('user')

  delete axios.defaults.headers.common['Authorization']

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
/* HEADER */
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #1e3a8a;
  padding: 0 2rem;       /* padding horizontal uniquement */
  height: 80px;          /* hauteur fixe du menu */
  color: #fff;
  position: relative;    /* pour le menu burger en responsive */
}

/* LOGO */
.logo {
  height: 130%;           /* s'adapte à la hauteur de la navbar */
  display: flex;
  align-items: center;    /* centrer verticalement */
}

.logo img {
  max-height: 130%;       /* s’adapte à la hauteur de la navbar sans la dépasser */
  width: auto;            /* garde les proportions */
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
/* BURGER BUTTON */
.burger {
  display: none;
  position: relative;
  width: 32px;
  height: 22px;
  background: transparent;
  border: none;
  cursor: pointer;
}

/* traits */
.burger span {
  position: absolute;
  left: 0;
  width: 100%;
  height: 4px;
  background-color: #fff;
  border-radius: 4px;
  transition: 0.3s ease;
}

/* positions initiales */
.burger span:nth-child(1) {
  top: 0;
}

.burger span:nth-child(2) {
  top: 9px;
}

.burger span:nth-child(3) {
  top: 18px;
}

/* ÉTAT ACTIF (✖) */
.burger.active span:nth-child(1) {
  transform: rotate(45deg);
  top: 9px;
}

.burger.active span:nth-child(2) {
  opacity: 0;
}

.burger.active span:nth-child(3) {
  transform: rotate(-45deg);
  top: 9px;
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


