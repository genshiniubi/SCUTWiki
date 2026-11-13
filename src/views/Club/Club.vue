<script setup>
import Title from '../../components/Title.vue'
import WikiLayout from '../../components/WikiLayout.vue'

const toc = [
  { id: 'xiaoji', label: '校级组织' },
  { id: 'yuanji', label: '院级组织' },
  { id: 'shetuan', label: '社团' },
]

</script>

<template>
  <Title />
  <h2>组织模块</h2>

  <WikiLayout :items="toc">
    <section id="xiaoji">
      <h2>校级组织</h2>
      <p>……</p>
    </section>

    <section id="yuanji">
      <h2>院级组织</h2>
      <p>……</p>
    </section>

    <section id="shetuan">
      <h2>社团</h2>
      <p>……</p>
    </section>
  </WikiLayout>
</template>