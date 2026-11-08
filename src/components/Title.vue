<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

function intomain_page() {
  router.push('/')
}
</script>

<template>
  <h1 @click="intomain_page">SCUTWiki</h1>
  <h2>welcome, students of SCUT!</h2>
</template>

<style scoped>
h1 {
  cursor: pointer;
}  
</style>