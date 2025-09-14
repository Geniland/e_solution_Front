<template>
  <div class="category-card">
    <img
      v-if="category.image_url"
      :src="category.image_url"
      :alt="category.name"
      class="category-image"
    />
    <h3>{{ category.name }}</h3>
      <p><strong>Description :</strong> {{ category.description }}</p>
      <p><strong>Date de début :</strong> {{ category.start_date}}</p>
      <p><strong>Date de fin :</strong> {{ category.end_date }}</p>
      <p><strong>Statut :</strong> {{ category.is_closed ? 'Fermée' : 'Ouverte' }}</p>
      <p><strong>Montant :</strong> {{ category.amount }} FCFA</p>
    <button @click="goToCandidates">
      Voir les candidats
    </button>
  </div>
</template>

<script>
export default {
  props: {
    category: {
      type: Object,
      required: true
    }
  },
  methods: {
    goToCandidates() {
      this.$router.push(`/categories/${this.category.id}/candidates`);
    }
  }
};
</script>

<style scoped>
.category-card {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 1rem;
  text-align: center;
  margin: 1rem;
  width: 200px;
}
.category-image {
  width: 100%;
  height: 120px;
  object-fit: cover;
  border-radius: 8px;
}
button {
  margin-top: 10px;
  padding: 8px 12px;
  background-color: #42b983;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
button:hover {
  background-color: #368c6b;
}
</style>
