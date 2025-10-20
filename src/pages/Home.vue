<template>
  <div class="bg-gray-50 text-gray-800">
    <header class="bg-gradient-to-r from-purple-700 to-yellow-500 p-6 text-white text-center">
      <h1 class="text-3xl font-bold">E_SOLUTION - Système de Vote & Vente de ticket</h1>
      <p class="mt-2 text-sm">Votez pour vos talents préférés dans chaque catégorie !</p>
    </header>

    <main class="container mx-auto py-10 px-4 space-y-16">
      <section 
        v-for="category in categories" 
        :key="category.id"
        class="bg-white shadow rounded-lg overflow-hidden"
      >
        <!-- Bannière -->
        <img 
          v-if="category.banner" 
          :src="imageUrl(category.banner)" 
          :alt="category.name" 
          class="w-full h-48 object-cover"
        >

        <div class="p-6">
          <h2 class="text-2xl font-bold text-purple-700">{{ category.name }}</h2>
          <p class="text-gray-600 mt-2">{{ category.description }}</p>
          <p class="text-gray-600 mt-2">Prix du Vote : {{ category.amount }} fcfa</p>
          <p class="text-sm text-gray-500 mt-1">
            Du {{ formatDate(category.start_date) }} au {{ formatDate(category.end_date) }}
          </p>

          <!-- Bouton pour afficher/masquer les candidats -->
          <button
            class="mt-4 mb-6 px-4 py-2 bg-purple-700 text-white rounded hover:bg-purple-800"
            @click="toggleCandidates(category.id)"
          >
            {{ showCandidates[category.id] ? 'Masquer les candidats' : 'Voir les candidats' }}
          </button>

          <!-- Liste des candidats -->
          <div 
            v-show="showCandidates[category.id]" 
            class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <div
              v-for="candidate in category.candidates"
              :key="candidate.id"
              class="border rounded-lg p-4 shadow hover:shadow-lg transition"
            >
              <!-- Photo -->
              <img 
                :src="imageUrl(candidate.photo)" 
                :alt="candidate.first_name + ' ' + candidate.last_name" 
                class="w-full h-56 object-cover rounded-md"
              >

              <!-- Infos -->
              <h3 class="text-lg font-semibold mt-3">
                {{ candidate.first_name }} {{ candidate.last_name }}
              </h3>
              <p class="text-gray-600 text-sm mt-2">{{ candidate.bio }}</p>
              <p class="text-sm text-gray-500">📞 {{ candidate.phone }}</p>
              <p class="text-sm text-gray-500">Position #{{ candidate.position_number }}</p>


              <!-- Affichage du nombre de votes -->
              <div class="votes-badge">
                🗳️ {{ candidate.votes_count }} vote<span v-if="candidate.votes_count > 1">s</span>
              </div>

              <!-- Actions -->
              <div class="flex justify-between items-center mt-4">
                <a 
                  v-if="candidate.video_url" 
                  :href="candidate.video_url" 
                  target="_blank" 
                  class="text-blue-600 hover:underline text-sm"
                >
                  🎥 Voir la vidéo
                </a>
                <router-link 
                  :to="`/vote/${candidate.id}`" 
                  class="bg-purple-700 text-white px-4 py-2 rounded hover:bg-purple-800 text-sm"
                >
                  Voter
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import axios from '../axios'

const categories = ref([])
const showCandidates = reactive({})

// Toggle affichage des candidats
const toggleCandidates = (categoryId) => {
  showCandidates[categoryId] = !showCandidates[categoryId]
}

// Formatage des dates
const formatDate = (date) => {
  if (!date) return 'N/A'
  const d = new Date(date)
  return d.toLocaleDateString('fr-FR', { 
    day: '2-digit', 
    month: 'long', 
    year: 'numeric', 
    hour: '2-digit', 
    minute: '2-digit' 
  })
}

// Construire l'URL image
const imageUrl = (path) => {
  if (!path) return 'https://via.placeholder.com/300x200?text=Pas+d%27image'
  return `http://localhost:8000/storage/${path}`
}

// Récupération des catégories depuis l'API
const fetchCategories = async () => {
  try {
    const res = await axios.get('/categories') // ✅ ajout du /
    categories.value = res.data
    res.data.forEach(cat => (showCandidates[cat.id] = false))
  } catch (error) {
    console.error('Erreur API /categories:', error)
    alert('Erreur lors du chargement des catégories')
  }
}

onMounted(() => {
  fetchCategories()
})
</script>

<style scoped>

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
