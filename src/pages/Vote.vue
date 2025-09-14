<template>
  <div>
    <h2>Voter pour le candidat #{{ $route.params.candidateId }}</h2>
    <VoteForm :candidateId="$route.params.candidateId" />
  </div>
</template>

<script>
import VoteForm from '../components/VoteForm.vue';

export default {
  components: { VoteForm },
};
</script>
