<template>
  <div class="max-w-xl mx-auto mt-10 p-6 bg-white rounded-xl shadow">
    <h2 class="text-2xl font-semibold mb-4">Créer un Candidat</h2>

    <form @submit.prevent="submitForm" enctype="multipart/form-data">
      <div class="mb-4">
        <label class="block mb-1">Catégorie</label>
        <select v-model="form.category_id" class="w-full border p-2 rounded" required>
          <option value="">-- Choisir une catégorie --</option>
          <option v-for="cat in categories" :key="cat.id" :value="cat.id">
            {{ cat.name }}
          </option>
        </select>
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block mb-1">Prénom</label>
          <input v-model="form.first_name" type="text" class="w-full border p-2 rounded" required />
        </div>
        <div>
          <label class="block mb-1">Nom</label>
          <input v-model="form.last_name" type="text" class="w-full border p-2 rounded" required />
        </div>
      </div>

      <div class="mt-4">
        <label class="block mb-1">Téléphone</label>
        <input v-model="form.phone" type="text" class="w-full border p-2 rounded" required />
      </div>

      <div class="mt-4">
        <label class="block mb-1">Bio</label>
        <textarea v-model="form.bio" class="w-full border p-2 rounded" rows="3"></textarea>
      </div>

      <div class="mt-4">
        <label class="block mb-1">Photo</label>
        <input type="file" @change="handlePhoto" accept="image/*" />
      </div>

      <div class="mt-4">
        <label class="block mb-1">Vidéo (URL)</label>
        <input v-model="form.video_url" type="url" class="w-full border p-2 rounded" />
      </div>

      <button
        type="submit"
        class="mt-6 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        :disabled="loading"
      >
        {{ loading ? 'Envoi...' : 'Enregistrer' }}
      </button>

      <p v-if="successMessage" class="text-green-600 mt-3">{{ successMessage }}</p>
      <p v-if="errorMessage" class="text-red-600 mt-3">{{ errorMessage }}</p>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from '../axios'

const API_URL = import.meta.env.VITE_API_URL

const categories = ref([])
const form = ref({
  category_id: '',
  first_name: '',
  last_name: '',
  phone: '',
  bio: '',
  video_url: '',
  photo: null,
})
const loading = ref(false)
const successMessage = ref('')
const errorMessage = ref('')

const handlePhoto = (e) => {
  form.value.photo = e.target.files[0]
}

const getCategories = async () => {
  try {
    const res = await axios.get("/categories")
    categories.value = res.data
  } catch (err) {
    console.error('Erreur de chargement des catégories', err)
  }
}

const submitForm = async () => {
  loading.value = true
  successMessage.value = ''
  errorMessage.value = ''

  const formData = new FormData()
  Object.keys(form.value).forEach((key) => {
    if (form.value[key]) {
      formData.append(key, form.value[key])
    }
  })

  try {
    const token = localStorage.getItem('token') // récupère le token d'auth
    const res = await axios.post("/candidates", formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    })

    successMessage.value = 'Candidat créé avec succès !'
    form.value = { category_id: '', first_name: '', last_name: '', phone: '', bio: '', video_url: '', photo: null }
  } catch (err) {
    errorMessage.value = err.response?.data?.message || 'Erreur lors de la création'
  } finally {
    loading.value = false
  }
}

onMounted(getCategories)
</script>

<style scoped>
input, textarea, select {
  border: 1px solid #ddd;
}
</style>
