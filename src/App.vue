<script setup>
import { ref } from 'vue'

const keyword = ref('')

const nav = ['首页', '课程', '社团', '生活指南', '关于']

const sections = [
  { id: 'courses', icon: '📚', title: '课程百科', desc: '培养方案、课程评价与考试经验。', count: '0 篇' },
  { id: 'clubs', icon: '🎯', title: '社团组织', desc: '校级社团与兴趣小组的介绍与招新。', count: '0 个' },
  { id: 'campus', icon: '🏫', title: '校园生活', desc: '食堂、宿舍、交通与办事流程。', count: '0 条' },
  { id: 'guides', icon: '🧭', title: '新生指南', desc: '报到、选课、奖助学金等常见问题。', count: '0 条' },
]
</script>

<template>
  <header class="site-header">
    <a class="brand" href="/">SCUT<span>Wiki</span></a>
    <nav class="site-nav" aria-label="主导航">
      <a v-for="item in nav" :key="item" href="#">{{ item }}</a>
    </nav>
  </header>

  <main>
    <section class="hero">
      <h1>华南理工大学校园百科</h1>
      <p class="lead">由同学共同维护的课程、社团与校园生活知识库。</p>
      <form class="search" role="search" @submit.prevent>
        <input
          v-model="keyword"
          type="search"
          placeholder="搜索课程、老师或词条…"
          aria-label="搜索词条"
        />
        <button type="submit">搜索</button>
      </form>
    </section>

    <section class="grid" aria-label="词条分类">
      <article v-for="s in sections" :id="s.id" :key="s.id" class="card">
        <span class="icon" aria-hidden="true">{{ s.icon }}</span>
        <h2>{{ s.title }}</h2>
        <p>{{ s.desc }}</p>
        <footer>
          <span class="count">{{ s.count }}</span>
          <a :href="`#${s.id}`">查看</a>
        </footer>
      </article>
    </section>

    <section class="notice">
      <h2>开始共建</h2>
      <p>目前还是空框架：词条数据、搜索接口与登录功能都待接入。</p>
    </section>
  </main>

  <footer class="site-footer">
    <p>SCUTWiki · 校园知识，一起书写</p>
    <p class="muted">© 2026 SCUTWiki</p>
  </footer>
</template>

<style scoped>
.site-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.5rem;
  flex-wrap: wrap;
  padding: 1.25rem 0;
  border-bottom: 1px solid var(--color-border);
}

.brand {
  font-size: 1.3rem;
  font-weight: 700;
  letter-spacing: 0.02em;
  color: var(--color-heading);
}

.brand span {
  color: hsla(160, 100%, 37%, 1);
}

.site-nav {
  display: flex;
  gap: 1.25rem;
  font-size: 0.95rem;
  color: var(--color-text);
}

.site-nav a:hover {
  color: hsla(160, 100%, 37%, 1);
}

.hero {
  padding: 3.5rem 0 2.5rem;
}

.hero h1 {
  font-size: clamp(1.6rem, 4vw, 2.4rem);
  font-weight: 700;
  color: var(--color-heading);
}

.lead {
  margin-top: 0.5rem;
  color: var(--color-text);
  opacity: 0.8;
}

.search {
  display: flex;
  gap: 0.5rem;
  margin-top: 1.75rem;
  max-width: 520px;
}

.search input {
  flex: 1;
  padding: 0.7rem 0.9rem;
  font-size: 1rem;
  color: var(--color-text);
  background: var(--color-background-soft);
  border: 1px solid var(--color-border);
  border-radius: 8px;
}

.search input:focus {
  outline: 2px solid hsla(160, 100%, 37%, 0.5);
  outline-offset: 1px;
  border-color: transparent;
}

.search button {
  padding: 0 1.2rem;
  font-size: 0.95rem;
  color: #fff;
  background: hsla(160, 100%, 32%, 1);
  border: none;
  border-radius: 8px;
  cursor: pointer;
}

.search button:hover {
  background: hsla(160, 100%, 28%, 1);
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
  gap: 1rem;
}

.card {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  padding: 1.25rem;
  background: var(--color-background-soft);
  border: 1px solid var(--color-border);
  border-radius: 12px;
}

.card .icon {
  font-size: 1.5rem;
}

.card h2 {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--color-heading);
}

.card p {
  font-size: 0.9rem;
  color: var(--color-text);
  opacity: 0.75;
}

.card footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: auto;
  padding-top: 0.75rem;
  font-size: 0.85rem;
}

.card .count {
  color: var(--color-text);
  opacity: 0.6;
}

.card a {
  color: hsla(160, 100%, 32%, 1);
  font-weight: 600;
}

.notice {
  margin-top: 2.5rem;
  padding: 1.5rem;
  border: 1px dashed var(--color-border-hover);
  border-radius: 12px;
}

.notice h2 {
  font-size: 1.05rem;
  font-weight: 600;
  color: var(--color-heading);
}

.notice p {
  margin-top: 0.4rem;
  font-size: 0.9rem;
  opacity: 0.75;
}

.site-footer {
  margin-top: 3.5rem;
  padding-top: 1.25rem;
  border-top: 1px solid var(--color-border);
  font-size: 0.85rem;
  text-align: center;
  opacity: 0.7;
}

.site-footer .muted {
  margin-top: 0.25rem;
  font-size: 0.8rem;
  opacity: 0.7;
}
</style>
