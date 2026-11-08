<script setup>
import Title from '../components/Title.vue'
</script>

<template>
  <Title />
  <nav class="modules">
    <RouterLink class="module" to="/college" title="SCUT 通用攻略">大学主模块</RouterLink>
    <RouterLink class="module" to="/faculty" title="以各个学院分成的版块内容分享">学院模块</RouterLink>
    <RouterLink class="module" to="/club" title="部门、社团的内容介绍与交流">组织模块</RouterLink>
    <RouterLink class="module" to="/opensource" title="供全体师生使用的通用小玩意儿">开源模块</RouterLink>
    <RouterLink class="module" to="/contact" title="老师、学长或者合作者的联系方式">联系模块</RouterLink>
    <RouterLink class="module" to="/more" title="杂文、群分享、兴趣爱好、箴言等等">其他模块</RouterLink>
  </nav>
</template>

<style scoped>
.modules {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.module {
  padding: 0.6rem 1.1rem;
  border: 1px solid var(--color-border);
  border-radius: 10px;
  color: var(--color-text);
  transition: border-color 0.2s, color 0.2s;
}

.module:hover {
  border-color: hsla(160, 100%, 37%, 0.45);
  color: hsla(160, 100%, 37%, 1);
}
</style>
