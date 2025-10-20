<!-- pages/CategoryCandidates.vue -->
<template>
  <div class="category-candidates-page" v-if="category">
    <div class="category-header">
      <img v-if="category.banner" :src="imageUrl(category.banner)" class="category-banner" />
      <h1>{{ category.name }}</h1>
      <p>{{ category.description }}</p>
      <p>🕒 Du {{ formatDate(category.start_date) }} au {{ formatDate(category.end_date) }}</p>
      <p><strong>Statut :</strong> {{ category.is_closed ? 'Fermée' : 'Ouverte' }}</p>
      <p><strong>Montant :</strong> {{ category.amount }} FCFA</p>
    </div>

    <h2>Candidats</h2>

    <div class="candidates-grid">
      <div
        v-for="candidate in category.candidates"
        :key="candidate.id"
        class="candidate-card"
      >
        <img :src="imageUrl(candidate.photo)" class="candidate-photo" />
        <h3>{{ candidate.first_name }} {{ candidate.last_name }}</h3>
        <p>{{ candidate.bio }}</p>

        <!-- Affichage du nombre de votes -->
        <div class="votes-badge">
          🗳️ {{ candidate.votes_count }} vote<span v-if="candidate.votes_count > 1">s</span>
        </div>

        <router-link :to="`/vote/${candidate.id}`" class="vote-button">Voter</router-link>
      </div>
    </div>
  </div>

  <div v-else>
    <p>Chargement...</p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      category: null,
    };
  },
  mounted() {
    this.fetchCategory();
  },
  methods: {
    async fetchCategory() {
      const id = this.$route.params.id;
      try {
        const response = await fetch(`http://localhost:8000/api/categories/${id}`);
        if (!response.ok) {
          throw new Error(`Erreur HTTP: ${response.status}`);
        }
        const data = await response.json();
        this.category = data;
      } catch (err) {
        console.error('Erreur lors du chargement :', err);
      }
    },

    imageUrl(path) {
      return `http://localhost:8080/storage/${path}`;
    },
    formatDate(dateStr) {
      return new Date(dateStr).toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    },
  },
};
</script>

<style scoped>
.category-candidates-page {
  padding: 2rem;
  max-width: 1000px;
  margin: auto;
}
.category-header {
  background-color: #f9fafb;
  padding: 1rem;
  border-radius: 10px;
  margin-bottom: 2rem;
  text-align: center;
}
.category-banner {
  max-width: 100%;
  border-radius: 12px;
  margin-bottom: 1rem;
}
.candidates-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}
.candidate-card {
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 10px;
  padding: 1rem;
  text-align: center;
  box-shadow: 0 2px 6px rgba(0,0,0,0.05);
  position: relative;
}
.candidate-photo {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 1rem;
}
.vote-button {
  display: inline-block;
  margin-top: 1rem;
  padding: 8px 16px;
  background-color: #1e3a8a;
  color: white;
  text-decoration: none;
  border-radius: 5px;
}
.vote-button:hover {
  background-color: #3b82f6;
}
.votes-badge {
  margin-top: 0.5rem;
  font-weight: bold;
  background: #e0f2fe;
  color: #0369a1;
  padding: 6px 12px;
  border-radius: 20px;
  display: inline-block;
}
</style>
