<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

function intomain_page() {
  router.push('/')
}
</script>

<template>
   <header class="hero">
    <h1 class="brand" @click="intomain_page">
      <img class="logo" src="../assets/logo.svg" alt="" />
      <span>SCUT<span class="accent">Wiki</span></span>
    </h1>
    <p class="tagline">welcome, students of SCUT!</p>
  </header>
</template>

<style scoped>
.hero {
  padding: 3rem 0 2.5rem;
}

.brand {
  display: inline-flex;
  align-items: center;
  gap: 0.55rem;
  font-size: clamp(2rem, 6vw, 3.2rem);
  font-weight: 800;
  letter-spacing: -0.02em;
  line-height: 1.1;
  color: var(--color-heading);
  cursor: pointer;
}

.accent {
  color: hsla(160, 100%, 37%, 1);
}

.tagline {
  margin-top: 0.75rem;
  font-size: 1.05rem;
  color: var(--color-text);
  opacity: 0.7;
}

.logo {
  width: 0.85em;      /* 跟着标题字号缩放 */
  height: 0.85em;
  flex-shrink: 0;     /* 窄屏时不被压扁 */
  display: block;
}

</style>