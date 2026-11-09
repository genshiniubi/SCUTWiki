<script setup>
import Title from '../../components/Title.vue'
import WikiLayout from '../../components/WikiLayout.vue'

const toc = [
  { id: 'two-hands', label: '二手交易' },
  { id: 'maxims', label: '箴言' },
]
</script>

<template>
  <Title />
  <h2>其他模块</h2>
  
  <p>杂文、群分享、兴趣爱好、箴言等等，内容建设中。</p>
  <WikiLayout :items="toc">
    <h1>其他模块</h1>

    <section id="two-hands">
      <h2>二手交易</h2>
      <p>……</p>
    </section>

    <section id="maxims">
      <h2>箴言</h2>
      <p>……</p>
    </section>
  </WikiLayout>
</template>
