<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

function intomain_page() {
  router.push('/')
}
function intomore() {
  router.push('/more')
}
</script>

<template>
  <h1 @click="intomain_page">SCUTWiki</h1>
  <h2>welcome, students of SCUT!</h2>
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
