<template>
  <div class="flex justify-center items-center min-h-screen bg-gray-100 p-4">
    <div class="w-full max-w-lg bg-white shadow-lg rounded-2xl p-6">
      <!-- Titre -->
      <h2 class="text-2xl font-bold text-center text-indigo-600 mb-6">
        Paiement de vos votes
      </h2>

      <!-- Réseau -->
      <div class="mb-4">
        <label class="block text-gray-700 font-medium mb-1">Choisir le réseau</label>
        <select
          v-model="network"
          class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500"
        >
          <option value="FLOOZ">FLOOZ</option>
          <option value="TMONEY">TMONEY</option>
        </select>
      </div>

      <!-- Téléphone -->
      <div class="mb-4">
        <label class="block text-gray-700 font-medium mb-1">Numéro de téléphone</label>
        <input
          v-model="phone"
          type="tel"
          placeholder="Ex: 90000000"
          class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <!-- Nombre de votes -->
      <div class="mb-4">
        <label class="block text-gray-700 font-medium mb-1">Nombre de votes</label>
        <input
          type="number"
          v-model.number="votes"
          min="1"
          class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <!-- Montant total -->
      <div v-if="amountPerVote" class="bg-gray-50 p-4 rounded-lg border text-center mb-4">
        <p class="text-gray-600">1 vote = {{ amountPerVote }} FCFA</p>
        <p class="text-lg font-semibold text-indigo-600 mt-2">
          {{ votes }} vote(s) = <b>{{ totalAmount }} FCFA</b>
        </p>
      </div>

      <!-- Bouton -->
      <button
        @click="initiatePayment"
        class="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl shadow-md transition duration-200"
      >
        Payer et voter
      </button>

      <!-- Iframe FedaPay -->
      <div v-if="paymentUrl" class="mt-6 relative border rounded-xl shadow-lg overflow-hidden">
        <button
          @click="paymentUrl = null"
          class="absolute top-2 right-2 bg-red-500 text-white text-sm px-2 py-1 rounded-lg hover:bg-red-600"
        >
          Fermer
        </button>
        <iframe
          :src="paymentUrl"
          width="100%"
          height="600"
          frameborder="0"
          class="rounded-b-xl"
        ></iframe>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "../axios";

export default {
  props: ["candidateId"],
  data() {
    return {
      phone: "",
      network: "FLOOZ",
      votes: 1,
      amountPerVote: null,
      totalAmount: null,
      paymentUrl: null,
    };
  },
  methods: {
    async initiatePayment() {
      const visitorToken = localStorage.getItem("visitor_token");
      try {
        const response = await axios.post("/vote-payments/initiate", {
          candidate_id: this.candidateId,
          network: this.network,
          phone_number: this.phone,
          visitor_token: visitorToken,
          votes: this.votes,
        });

        // Backend renvoie ces valeurs
        this.amountPerVote = response.data.amount_per_vote;
        this.totalAmount = response.data.total_amount;

        this.paymentUrl = response.data.payment_url;
      } catch (err) {
        alert(err.response?.data?.message || "Erreur lors du paiement");
      }
    },
  },
};
</script>
