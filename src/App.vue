<template>
  <div class="app-container">
    <!-- Barre de navigation -->
    <header class="navbar">
      <div class="logo">🗳️ E-Vote</div>
      <nav class="nav-links">
        <router-link to="/" exact-active-class="active">Accueil</router-link>
        <router-link to="/my-votes" exact-active-class="active">Mes Votes</router-link>
        <router-link to="/login" exact-active-class="active">Connexion</router-link>
      </nav>
    </header>

    <!-- Contenu des pages -->
    <main class="main-content">
      <router-view />
    </main>

    <!-- Pied de page -->
    <footer class="footer">
      <p>&copy; 2025 Plateforme de Vote Sécurisée | Tous droits réservés</p>
    </footer>
  </div>
</template>

<style scoped>
.app-container {
  /* display: flex; */
  flex-direction: column;
  min-height: 100vh;
  /* background-color: #f5f7fa; */
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

.logo {
  font-size: 1.5rem;
  font-weight: bold;
}

.nav-links {
  display: flex;
  gap: 1.5rem;
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

.main-content {
  flex-grow: 1;
  
  max-width: 1000px;
  margin: 0 auto;
  background-color: #ffffff;
  /* box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05); */
  border-radius: 8px;
  margin-top: 2rem;
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
