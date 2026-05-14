<template>
  <div class="flex justify-center items-center min-h-screen bg-gray-100 p-4">
    <div class="w-full max-w-lg bg-white shadow-lg rounded-2xl p-8 text-center">
      <div v-if="loading" class="space-y-4">
        <div class="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto"></div>
        <p class="text-gray-600 text-lg">Vérification de votre vote...</p>
      </div>

      <div v-else-if="status === 'success'" class="space-y-4">
        <div class="text-6xl text-green-500 mb-4">✅</div>
        <h2 class="text-2xl font-bold text-gray-800">Félicitations !</h2>
        <p class="text-gray-600 text-lg">Votre vote a été enregistré avec succès.</p>
        <button
          @click="$router.push('/')"
          class="mt-6 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl shadow-md transition duration-200"
        >
          Retour à l'accueil
        </button>
      </div>

      <div v-else class="space-y-4">
        <div class="text-6xl text-red-500 mb-4">❌</div>
        <h2 class="text-2xl font-bold text-gray-800">Oups !</h2>
        <p class="text-gray-600 text-lg">
          {{ message || "Nous n'avons pas pu confirmer votre vote." }}
        </p>
        <button
          @click="$router.push('/')"
          class="mt-6 w-full bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 rounded-xl shadow-md transition duration-200"
        >
          Retour à l'accueil
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loading: true,
      status: null,
      message: null,
    };
  },
  mounted() {
    const urlParams = new URLSearchParams(window.location.search);
    const status = urlParams.get("status");
    const id = urlParams.get("id");

    if (status === "success") {
      this.status = "success";
      this.loading = false;
    } else if (status === "pending" || status === "error") {
      this.status = "error";
      this.message = status === "pending" 
        ? "Votre paiement est en cours de traitement." 
        : "Une erreur est survenue lors du paiement.";
      this.loading = false;
    } else {
      // Cas par défaut ou si on arrive ici sans paramètres
      this.status = "error";
      this.message = "Aucune information de transaction trouvée.";
      this.loading = false;
    }

    // Redirection automatique après 5 secondes vers l'accueil
    setTimeout(() => {
      this.$router.push("/");
    }, 3000);
  },
};
</script>
