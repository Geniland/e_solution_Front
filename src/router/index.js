import { createRouter, createWebHistory } from 'vue-router';
import Login from '../pages/Login.vue';
import Home from '../pages/Home.vue';
import Candidates from '../pages/Candidates.vue';
import Vote from '../pages/Vote.vue';
import VoteSuccess from '../pages/VoteSuccess.vue';
import MyVotes from '../pages/MyVotes.vue';
import CreateCategories from '../pages/CreateCategories.vue';
import Register from '../pages/Register.vue';
import CandidateForm from '../components/CandidateForm.vue'

const routes = [
  { path: '/login', component: Login },
  { path: '/', component: Home },
  { path: '/categories/:id/candidates', component: Candidates },
  { path: '/vote/:candidateId', component: Vote },
  { path: '/vote-success', component: VoteSuccess },
  { path: '/my-votes', component: MyVotes },
  { path: '/Create-Categories', component: CreateCategories },
  { path: '/Register', component: Register },
  { path: '/candidates/create', component: CandidateForm },
];






export default createRouter({
  history: createWebHistory(),
  routes,
});
