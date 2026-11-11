<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'

const props = defineProps({
  // [{ id: 'course', label: '选课', mode: 'switch', children: [...] }]
  // id 必须和正文里 <section id="..."> 一致
  items: { type: Array, required: true },
  label: { type: String, default: '本页目录' },
  // 整页默认模式，单个条目可以用 item.mode 或 section 上的 mode 属性覆盖
  // scroll：点左边滚到右边对应段落
  // switch：点左边只显示右边对应段落
  mode: {
    type: String,
    default: 'scroll',
    validator: (value) => ['scroll', 'switch'].includes(value),
  },
  // 单选显示：点击任意条目都只显示它自己，其他块全部隐藏
  // 关掉（false）则恢复“文档模式”——scroll 的块会全部常驻显示
  single: {
    type: Boolean,
    default: true,
  },
})

const open = ref(false)
const contentRef = ref(null)

// 把两级目录拍平，滚动高亮和显隐都按平铺顺序处理
const flatItems = computed(() =>
  props.items.flatMap((item) => [item, ...(item.children ?? [])]),
)

// 子项 -> 父项，用来做模式继承
const parentOf = computed(() => {
  const map = new Map()
  for (const item of props.items) {
    for (const child of item.children ?? []) map.set(child.id, item)
  }
  return map
})

const activeId = ref(flatItems.value[0]?.id ?? '')
// 当前是否处于“只显示某一段”的状态
const isolated = ref(props.mode === 'switch')
// 隔离的是“组”：有子项时隔离父项，整个组一起显示
const isolateId = ref('')

// 找到条目所属的组（有父项就返回父项）
function groupOf(item) {
  return parentOf.value.get(item.id) ?? item
}

const isActive = (item) => item.id === activeId.value
const hasActiveChild = (item) =>
  item.children?.some((child) => child.id === activeId.value) ?? false

/**
 * 单个条目的模式，优先级：
 * 1. 目录数组里的 item.mode
 * 2. 对应 <section mode="switch"> 或 <section data-mode="switch">
 * 3. 组件上的 mode prop
 */
function modeOf(item) {
  if (item.mode) return item.mode

  const el = document.getElementById(item.id)
  const attr = el?.getAttribute('data-mode') ?? el?.getAttribute('mode')
  if (attr === 'switch' || attr === 'scroll') return attr

  // 子项没写就用父项的设置：父项是 switch，子项也按 switch 处理
  const parent = parentOf.value.get(item.id)
  if (parent) return modeOf(parent)

  return props.mode
}

/* ---------------- 滚动高亮（非 isolated 时才生效） ---------------- */

let ticking = false
let lockUntil = 0

function updateActive() {
  ticking = false

  if (isolated.value) return
  // 刚点过目录：以点击结果为准，别让滚动高亮立刻把它改掉
  if (Date.now() < lockUntil) return

  // 被隐藏的段落（switch 区块）不参与判定，否则它们的 top 是 0 会误判
  const visible = visibleItems()
  if (!visible.length) return

  // 滚到底部时直接高亮最后一条，避免短页面永远停在中间章节
  const doc = document.documentElement
  if (window.innerHeight + window.scrollY >= doc.scrollHeight - 4) {
    activeId.value = visible[visible.length - 1].id
    return
  }

  const marker = window.scrollY + 100
  let current = visible[0].id

  for (const item of visible) {
    const el = document.getElementById(item.id)
    if (!el) continue
    if (el.getBoundingClientRect().top + window.scrollY <= marker) {
      current = item.id
    }
  }

  activeId.value = current
}

function visibleItems() {
  return flatItems.value.filter((item) => {
    const el = document.getElementById(item.id)
    return !!el && el.offsetParent !== null
  })
}

function onScroll() {
  if (ticking) return
  ticking = true
  requestAnimationFrame(updateActive)
}

/* ---------------- 显隐控制（不依赖标签名） ---------------- */

/**
 * 按 id 统一控制每个块是否显示：
 * - 滚动视图（非 isolated）：switch 模式的块全部隐藏
 * - isolated：只显示当前块，以及它的祖先 / 子孙
 * 用 inline style 而不是 CSS 类，这样 <section>、<nav>、<div> 都能管。
 */
function syncVisibility() {
  const content = contentRef.value
  if (!content) return

  // isolated 时以“组根”为准：父项 + 它的全部子项一起留下
  const targetId = isolated.value ? isolateId.value || activeId.value : activeId.value
  const activeEl = document.getElementById(targetId)
  if (isolated.value && !activeEl) isolated.value = false

  const ids = new Set(flatItems.value.map((item) => item.id))

  for (const el of content.querySelectorAll('[id]')) {
    if (!ids.has(el.id)) continue

    const item = flatItems.value.find((entry) => entry.id === el.id)
    const isSwitch = item ? modeOf(item) === 'switch' : false

    const inChain =
      !!activeEl &&
      (el === activeEl || el.contains(activeEl) || activeEl.contains(el))

    const show = isolated.value ? inChain : !isSwitch
    el.style.display = show ? '' : 'none'
  }
}

watch([activeId, isolated, isolateId], async () => {
  await nextTick()
  syncVisibility()
})

/* ---------------- 初始化 / 销毁 ---------------- */

onMounted(() => {
  // 支持直接访问 /more#scams 这类带锚点的链接
  const hash = decodeURIComponent(window.location.hash.slice(1))
  const hashItem = flatItems.value.find((item) => item.id === hash)
  if (hashItem) activeId.value = hashItem.id

  if (isolated.value || (hashItem && modeOf(hashItem) === 'switch')) {
    isolated.value = true
    isolateId.value = groupOf(hashItem ?? flatItems.value[0]).id
    syncVisibility()
    return
  }

  syncVisibility()

  // 整页都是 switch 块时，滚动视图会空白，兜底显示第一个
  if (!visibleItems().length) {
    isolated.value = true
    isolateId.value = groupOf(flatItems.value[0]).id
    syncVisibility()
    return
  }

  updateActive()
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('resize', onScroll, { passive: true })

  if (hashItem) {
    requestAnimationFrame(() => document.getElementById(hashItem.id)?.scrollIntoView())
  }
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('resize', onScroll)
})

/* ---------------- 点击目录 ---------------- */

async function go(item) {
  const group = groupOf(item)
  const wasActive = item.id === activeId.value && isolated.value && isolateId.value === group.id

  activeId.value = item.id
  lockUntil = Date.now() + 800
  open.value = false // 手机端点完自动收起

  // 再点一次当前项：回到“全部普通段落”的浏览状态
  if (wasActive && props.single) {
    isolated.value = false
    isolateId.value = ''
    await nextTick()
    syncVisibility()
    lockUntil = 0
    updateActive()
    return
  }

  // single 模式下所有条目都只显示自己所在的组；否则只有 switch 条目这么做
  if (props.single || modeOf(item) === 'switch') {
    isolated.value = true
    isolateId.value = group.id
    await nextTick()
    syncVisibility()

    // 整组可见后，滚到被点的那一块（父项或子项）
    requestAnimationFrame(() => {
      document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
    return
  }

  // 文档模式：恢复所有段落，再滚过去
  isolated.value = false
  isolateId.value = ''
  await nextTick()
  syncVisibility()

  document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  history.replaceState(null, '', `#${item.id}`)
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
          <a
            :href="`#${item.id}`"
            class="toc-link"
            :class="{
              active: isActive(item),
              parent: !!item.children,
              'child-active': hasActiveChild(item),
            }"
            :aria-current="isActive(item) ? 'true' : undefined"
            @click.prevent="go(item)"
          >
            {{ item.label }}
          </a>

          <div v-if="item.children?.length" class="toc-children">
            <a
              v-for="child in item.children"
              :key="child.id"
              :href="`#${child.id}`"
              class="toc-link sub"
              :class="{ active: isActive(child) }"
              :aria-current="isActive(child) ? 'true' : undefined"
              @click.prevent="go(child)"
            >
              {{ child.label }}
            </a>
          </div>
        </template>
      </nav>
    </aside>

    <main ref="contentRef" class="content" :class="{ isolate: isolated }">
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

/* 子项：缩进交给容器，竖线把它们和父项连起来 */
.toc-link.sub {
  padding-left: 0.45rem;
  font-size: 0.85rem;
}

.toc-children {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
  margin-left: 0.85rem;
  padding-left: 0.7rem;
  border-left: 1px solid var(--color-border);
}

.toc-toggle {
  display: none;
}

/* ---------- 右侧正文排版 ---------- */
.content :deep([id]) {
  scroll-margin-top: 1.5rem;
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
