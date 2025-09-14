<template>
  <div class="max-w-2xl mx-auto p-4 bg-white shadow rounded">
    <h2 class="text-2xl font-bold mb-4">Créer une Catégorie</h2>

    <form @submit.prevent="submitForm" enctype="multipart/form-data">
      <div class="mb-4">
        <label class="block text-sm font-medium">Nom *</label>
        <input v-model="form.name" type="text" class="w-full border rounded p-2" required />
      </div>

      <div class="mb-4">
        <label class="block text-sm font-medium">Montant</label>
        <input
            v-model="form.amount"
            type="number"
            step="0.01"
            min="0"
            class="w-full border rounded p-2"
            placeholder="Ex : 100.00"
            required
        />
        </div>


      <div class="mb-4">
        <label class="block text-sm font-medium">Description</label>
        <textarea v-model="form.description" class="w-full border rounded p-2"></textarea>
      </div>

      <div class="mb-4">
        <label class="block text-sm font-medium">Bannière</label>
        <input type="file" @change="handleFileUpload" />
      </div>

      <div class="mb-4">
        <label class="block text-sm font-medium">Date de début</label>
        <input v-model="form.start_date" type="date" class="w-full border rounded p-2" />
      </div>

      <div class="mb-4">
        <label class="block text-sm font-medium">Date de fin</label>
        <input v-model="form.end_date" type="date" class="w-full border rounded p-2" />
      </div>

      <div class="mb-4">
        <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded">
          Créer
        </button>
      </div>

      <p v-if="error" class="text-red-500">{{ error }}</p>
      <p v-if="success" class="text-green-500">Catégorie créée avec succès !</p>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from '../axios'

const form = ref({
  name: '',
  description: '',
  banner: null,
  start_date: '',
  end_date: '',
  amount: '',
})

const error = ref('')
const success = ref(false)

function handleFileUpload(event) {
  form.value.banner = event.target.files[0]
}

async function submitForm() {
  error.value = ''
  success.value = false

  const formData = new FormData()
  formData.append('name', form.value.name)
  formData.append('description', form.value.description || '')
  formData.append('amount', form.value.amount || '')

  if (form.value.banner) {
    formData.append('banner', form.value.banner)
  }
  formData.append('start_date', form.value.start_date || '')
  formData.append('end_date', form.value.end_date || '')

  try {
    await axios.post('/categories', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    success.value = true
    // reset form
    form.value = {
      name: '',
      description: '',
      banner: null,
      start_date: '',
      end_date: '',
    }
  } catch (e) {
    error.value = e.response?.data?.message || 'Erreur lors de la création.'
  }
}
</script>

<style scoped>
/* Optionnel : Ajoutez votre propre style */

</style>
