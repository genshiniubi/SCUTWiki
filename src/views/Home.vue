<script setup>
import { useRouter } from 'vue-router'
import Title from '../components/Title.vue'

const router = useRouter()

function intomain_page() {
  router.push('/')
}
function intomore() {
  router.push('/more')
}
</script>

<template>
  <Title />
  <p class="more-link" @click="intomore">look more</p>
</template>

<style scoped>
h1 {
  cursor: pointer;
}

.more-link {
  cursor: pointer;
  color: hsla(160, 100%, 37%, 1);
}
</style>
