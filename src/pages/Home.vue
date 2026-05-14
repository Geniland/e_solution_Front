<template>
  <div class="bg-gray-50 text-gray-800 min-h-screen">
    <!-- HEADER -->
    <header class="bg-gradient-to-r from-purple-700 to-yellow-500 p-6 text-white text-center">
      <h1 class="text-3xl font-bold">DigitalAreas - Système de Vote & Vente de ticket</h1>
      <p class="mt-2 text-sm">Votez pour vos talents préférés dans chaque catégorie</p>
    </header>

    <main class="container mx-auto py-10 px-4 space-y-16">

      <!-- 🔄 LOADING -->
      <div v-if="loading" class="space-y-6">
        <div v-for="i in 3" :key="i" class="animate-pulse bg-white p-6 rounded shadow">
          <div class="h-40 bg-gray-200 rounded mb-4"></div>
          <div class="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
          <div class="h-3 bg-gray-200 rounded w-3/4"></div>
        </div>
      </div>

      <!-- ❌ ERREUR -->
      <div
        v-if="errorMessage"
        class="bg-red-100 border border-red-300 text-red-700 p-6 rounded text-center"
      >
        <p class="font-semibold mb-3">{{ errorMessage }}</p>
        <button
          @click="fetchCategories"
          class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          🔄 Réessayer
        </button>
      </div>

      <!-- ✅ CONTENU -->
      <section
        v-for="category in categories"
        :key="category.id"
        class="bg-white shadow rounded-lg overflow-hidden"
      >
        <!-- Bannière -->
        <img
          :src="getImage(category.banner)"
          @error="onImageError"
          class="w-full h-48 object-cover"
        >

        <div class="p-6">
          <h2 class="text-2xl font-bold text-purple-700">{{ category.name }}</h2>
          <p class="text-gray-600 mt-2">{{ category.description }}</p>

          <div class="mt-3 text-sm text-gray-600 space-y-1">
            <p>💰 Prix du vote : <strong>{{ category.amount }} FCFA</strong></p>
            <p>
              📅 Du {{ formatDate(category.start_date) }}
              au {{ formatDate(category.end_date) }}
            </p>
            <p v-if="category.is_closed" class="text-red-600 font-semibold">
              ⛔ Catégorie clôturée
            </p>
          </div>

          <!-- Toggle candidats -->
          <button
            class="mt-4 mb-6 px-4 py-2 bg-purple-700 text-white rounded hover:bg-purple-800"
            @click="toggleCandidates(category.id)"
          >
            {{ showCandidates[category.id] ? 'Masquer les candidats' : 'Voir les candidats' }}
          </button>

          <!-- CANDIDATS -->
          <div
            v-show="showCandidates[category.id]"
            class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <div
              v-for="candidate in category.candidates"
              :key="candidate.id"
              class="border rounded-lg p-4 shadow hover:shadow-lg transition"
            >
              <img
                :src="getImage(candidate.photo)"
                @error="onImageError"
                class="w-full h-56 object-cover rounded"
              >

              <h3 class="text-lg font-semibold mt-3">
                {{ candidate.first_name }} {{ candidate.last_name }}
              </h3>

              <p class="text-gray-600 text-sm mt-2">{{ candidate.bio }}</p>
              <p class="text-sm text-gray-500">📞 {{ candidate.phone }}</p>
              <p class="text-sm text-gray-500">Position #{{ candidate.position_number }}</p>

              <!-- Votes -->
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
                  🎥 Vidéo
                </a>

                <router-link
                  v-if="!category.is_closed"
                  :to="`/vote/${candidate.id}`"
                  class="bg-purple-700 text-white px-4 py-2 rounded hover:bg-purple-800 text-sm"
                >
                  Voter
                </router-link>

                <span
                  v-else
                  class="text-gray-400 text-sm italic"
                >
                  Vote fermé
                </span>
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
const loading = ref(false)
const errorMessage = ref('')

/* ---------- Utils ---------- */

const formatDate = (date) => {
  if (!date) return 'N/A'
  return new Date(date).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const getImage = (path) => {
  if (!path) return fallbackImage
  return `${import.meta.env.VITE_ASSET_URL}/storage/${path}`
}

const fallbackImage = 'https://via.placeholder.com/400x300?text=Image+indisponible'

const onImageError = (e) => {
  e.target.src = fallbackImage
}

const toggleCandidates = (id) => {
  showCandidates[id] = !showCandidates[id]
}

/* ---------- API ---------- */

const fetchCategories = async () => {
  loading.value = true
  errorMessage.value = ''

  try {
    const cached = localStorage.getItem('categories_cache')
    if (cached) {
      categories.value = JSON.parse(cached)
      cachedSetup()
    }

    const res = await axios.get('/categories')
    categories.value = res.data
    localStorage.setItem('categories_cache', JSON.stringify(res.data))
    cachedSetup()

  } catch (err) {
    console.error(err)

    if (!err.response) {
      errorMessage.value = 'Impossible de contacter le serveur (verifie ton réseau).'
    } else if (err.response.status === 500) {
      errorMessage.value = 'Erreur serveur. Réessayez plus tard.'
    } else {
      errorMessage.value = 'Erreur lors du chargement des catégories.'
    }
  } finally {
    loading.value = false
  }
}

const cachedSetup = () => {
  categories.value.forEach(cat => {
    if (!(cat.id in showCandidates)) {
      showCandidates[cat.id] = false
    }
  })
}

onMounted(fetchCategories)
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
