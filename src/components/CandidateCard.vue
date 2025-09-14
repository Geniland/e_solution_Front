<!-- components/CandidateCard.vue -->
<template>
  <div class="card">
    <img :src="imageUrl(candidate.photo)" alt="Photo" class="photo" />
    <h3>{{ candidate.first_name }} {{ candidate.last_name }}</h3>
    <p class="bio">{{ candidate.bio }}</p>
    <p class="phone">📞 {{ candidate.phone }}</p>
    <p class="position">Position #{{ candidate.position_number }}</p>

    <div class="actions">
      <a :href="candidate.video_url" target="_blank" class="video-link">🎥 Voir la vidéo</a>
      <router-link :to="`/vote/${candidate.id}`" class="vote-btn">Voter</router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CandidateCard',
  props: {
    candidate: {
      type: Object,
      required: true
    }
  },
  methods: {
    imageUrl(path) {
      return `https://ton-api.com/storage/${path}`; // Remplace par ton domaine
    }
  }
};
</script>

<style scoped>
.card {
  border: 1px solid #ccc;
  border-radius: 12px;
  padding: 1rem;
  margin-bottom: 1.5rem;
  background-color: #fff;
  box-shadow: 0 2px 6px rgba(0,0,0,0.05);
  text-align: center;
}

.photo {
  width: 120px;
  height: 120px;
  object-fit: cover;
  border-radius: 50%;
  margin-bottom: 1rem;
}

.bio {
  margin: 0.5rem 0;
  color: #444;
}

.phone,
.position {
  font-size: 0.9rem;
  color: #666;
}

.actions {
  margin-top: 1rem;
  display: flex;
  justify-content: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.video-link,
.vote-btn {
  padding: 0.5rem 1rem;
  border-radius: 6px;
  text-decoration: none;
  font-weight: bold;
}

.video-link {
  background-color: #facc15;
  color: #000;
}

.vote-btn {
  background-color: #1d4ed8;
  color: #fff;
}
</style>
