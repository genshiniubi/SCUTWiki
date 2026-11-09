<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'

const props = defineProps({
  // [{ id: 'course', label: '选课', children: [{ id: 'pre', label: '预选' }] }]
  // id 必须和正文里 <section id="..."> 一致
  items: { type: Array, required: true },
  label: { type: String, default: '本页目录' },
  // scroll：点左边滚到右边对应段落（默认）
  // switch：点左边只显示右边对应段落
  mode: {
    type: String,
    default: 'scroll',
    validator: (value) => ['scroll', 'switch'].includes(value),
  },
})

const open = ref(false)
const contentRef = ref(null)

// 把两级目录拍平，滚动高亮和显隐都按平铺顺序处理
const flatItems = computed(() =>
  props.items.flatMap((item) => [item, ...(item.children ?? [])]),
)

const activeId = ref(flatItems.value[0]?.id ?? '')

const isActive = (item) => item.id === activeId.value
const hasActiveChild = (item) =>
  item.children?.some((child) => child.id === activeId.value) ?? false

/* ---------------- scroll 模式：滚动高亮 ---------------- */

let ticking = false
let lockUntil = 0

function updateActive() {
  ticking = false

  // 刚点过目录：以点击结果为准，别让滚动高亮立刻把它改掉
  if (Date.now() < lockUntil) return

  // 滚到底部时直接高亮最后一条，避免短页面永远停在中间章节
  const doc = document.documentElement
  if (window.innerHeight + window.scrollY >= doc.scrollHeight - 4) {
    activeId.value = flatItems.value[flatItems.value.length - 1]?.id ?? activeId.value
    return
  }

  const marker = window.scrollY + 100
  let current = flatItems.value[0]?.id ?? ''

  for (const item of flatItems.value) {
    const el = document.getElementById(item.id)
    if (!el) continue
    if (el.getBoundingClientRect().top + window.scrollY <= marker) {
      current = item.id
    }
  }

  activeId.value = current
}

function onScroll() {
  if (ticking) return
  ticking = true
  requestAnimationFrame(updateActive)
}

/* ---------------- switch 模式：只显示当前段落 ---------------- */

function syncSwitch() {
  for (const item of flatItems.value) {
    const el = document.getElementById(item.id)
    if (el) el.classList.toggle('is-active', item.id === activeId.value)
  }
}

watch(activeId, () => {
  if (props.mode === 'switch') syncSwitch()
})

/* ---------------- 初始化 / 销毁 ---------------- */

onMounted(() => {
  // 支持直接访问 /college#gpa 这类带锚点的链接
  const hash = decodeURIComponent(window.location.hash.slice(1))
  if (hash && flatItems.value.some((item) => item.id === hash)) {
    activeId.value = hash
  }

  if (props.mode === 'switch') {
    syncSwitch()
    return
  }

  updateActive()
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('resize', onScroll, { passive: true })

  if (hash) {
    requestAnimationFrame(() => document.getElementById(hash)?.scrollIntoView())
  }
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('resize', onScroll)
})

function go(id) {
  activeId.value = id
  lockUntil = Date.now() + 800
  open.value = false // 手机端点完自动收起

  if (props.mode !== 'switch') return

  // 切换后如果页面已经滚到下方，把正文顶部拉回视口
  requestAnimationFrame(() => {
    const el = contentRef.value
    if (!el) return
    const top = el.getBoundingClientRect().top + window.scrollY
    if (window.scrollY > top) {
      window.scrollTo({ top: top - 16, behavior: 'smooth' })
    }
  })
}
</script>

<template>
  <div class="wiki">
    <aside class="side">
      <button
        class="toc-toggle"
        type="button"
        :aria-expanded="open"
        @click="open = !open"
      >
        <span>{{ label }}</span>
        <span class="chev" :class="{ up: open }" aria-hidden="true">▾</span>
      </button>

      <nav class="toc" :class="{ open }" :aria-label="label">
        <template v-for="item in items" :key="item.id">
          <component
            :is="mode === 'switch' ? 'button' : 'a'"
            :href="mode === 'switch' ? undefined : `#${item.id}`"
            :type="mode === 'switch' ? 'button' : undefined"
            class="toc-link"
            :class="{
              active: isActive(item),
              parent: !!item.children,
              'child-active': hasActiveChild(item),
            }"
            :aria-current="isActive(item) ? 'true' : undefined"
            @click="go(item.id)"
          >
            {{ item.label }}
          </component>

          <component
            :is="mode === 'switch' ? 'button' : 'a'"
            v-for="child in item.children ?? []"
            :key="child.id"
            :href="mode === 'switch' ? undefined : `#${child.id}`"
            :type="mode === 'switch' ? 'button' : undefined"
            class="toc-link sub"
            :class="{ active: isActive(child) }"
            :aria-current="isActive(child) ? 'true' : undefined"
            @click="go(child.id)"
          >
            {{ child.label }}
          </component>
        </template>
      </nav>
    </aside>

    <main ref="contentRef" class="content" :class="{ switch: mode === 'switch' }">
      <slot />
    </main>
  </div>
</template>

<style scoped>
.wiki {
  display: grid;
  grid-template-columns: 220px minmax(0, 1fr);
  gap: 2.5rem;
  align-items: start;
  margin-top: 1.5rem;
}

/* ---------- 左侧目录（桌面：常驻 + 跟随滚动） ---------- */
.side {
  position: sticky;
  top: 1.5rem;
  align-self: start;
  max-height: calc(100vh - 3rem);
  overflow-y: auto;
  padding-right: 0.75rem;
  border-right: 1px solid var(--color-border);
}

.toc {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
}

.toc-link {
  display: block;
  width: 100%;
  padding: 0.45rem 0.7rem;
  border: 0;
  border-left: 2px solid transparent;
  border-radius: 6px;
  background: none;
  font: inherit;
  font-size: 0.9rem;
  line-height: 1.5;
  text-align: left;
  color: var(--color-text);
  opacity: 0.85;
  cursor: pointer;
  transition: background 0.2s, color 0.2s, border-color 0.2s, opacity 0.2s;
}

.toc-link:hover {
  background: var(--color-background-mute);
  color: var(--color-heading);
  opacity: 1;
}

.toc-link.active {
  color: hsla(160, 100%, 37%, 1);
  background: var(--color-background-mute);
  border-left-color: hsla(160, 100%, 37%, 1);
  opacity: 1;
  font-weight: 600;
}

/* 父项：字号略大，表示这是一个分组 */
.toc-link.parent {
  font-weight: 600;
  font-size: 0.93rem;
}

/* 父项下有子项被选中时，给父项一点弱高亮 */
.toc-link.child-active {
  color: var(--color-heading);
  opacity: 1;
}

/* 子项：缩进 */
.toc-link.sub {
  padding-left: 1.6rem;
  font-size: 0.85rem;
}

.toc-toggle {
  display: none;
}

/* ---------- 右侧正文排版 ---------- */
.content :deep(section) {
  scroll-margin-top: 1.5rem;
}

/* switch 模式：只显示当前 section */
.content.switch :deep(section) {
  display: none;
}

.content.switch :deep(section.is-active) {
  display: block;
}

.content :deep(h2) {
  margin: 2rem 0 0.75rem;
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--color-heading);
}

.content :deep(h3) {
  margin: 1.5rem 0 0.5rem;
  font-size: 1.05rem;
  font-weight: 600;
  color: var(--color-heading);
}

.content :deep(p) {
  margin: 0.6rem 0;
  line-height: 1.85;
  color: var(--color-text);
}

.content :deep(ul) {
  margin: 0.6rem 0;
  padding-left: 1.25rem;
  line-height: 1.85;
}

/* ---------- 手机 / 窄屏：单列 + 折叠目录 ---------- */
@media (max-width: 860px) {
  .wiki {
    grid-template-columns: 1fr;
    gap: 1rem;
    margin-top: 1rem;
  }

  .side {
    position: static;
    max-height: none;
    overflow: visible;
    padding: 0;
    border-right: none;
    border-bottom: 1px solid var(--color-border);
  }

  .toc-toggle {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    padding: 0.7rem 0.9rem;
    font-size: 0.95rem;
    color: var(--color-heading);
    background: var(--color-background-soft);
    border: 1px solid var(--color-border);
    border-radius: 8px;
    cursor: pointer;
  }

  .chev {
    transition: transform 0.2s;
  }

  .chev.up {
    transform: rotate(180deg);
  }

  .toc {
    display: none;
    margin-top: 0.5rem;
    padding-bottom: 0.75rem;
  }

  .toc.open {
    display: flex;
  }
}
</style>
