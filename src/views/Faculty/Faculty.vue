<template>
  <div class="college-module">
    
    <!-- ================= 第一页：常春藤名校风封面 ================= -->
    <transition name="fade-slow" mode="out-in">
      <div v-if="currentPage === 'cover'" class="cover-page" key="cover">
        <div class="paper-texture"></div>

        <div class="top-brand">
          <div class="brand-line"></div>
          <span>SCUT · 2026</span>
        </div>

        <div class="cover-content">
          <h1 class="main-title">
            <span>学院</span>
            <span class="title-en">Directory</span>
          </h1>
          <p class="sub-title">探索华南理工大学学术殿堂</p >
          
          <button class="enter-btn" @click="currentPage = 'directory'">
            <span class="btn-text">进入图鉴</span>
            <span class="btn-line"></span>
          </button>
        </div>

        <div class="footer-info">
          <span>Est. 1952</span>
          <span>Guangzhou, China</span>
        </div>
      </div>

      <!-- ================= 第二页：极简学院卡片列表 ================= -->
      <div v-else-if="currentPage === 'directory'" class="content-page" key="directory">
        <header class="page-header">
          <div class="back-btn" @click="currentPage = 'cover'">← 返回封面</div>
          <h2>学院图鉴</h2>
          <p>探索华工顶尖学术殿堂</p >
        </header>

        <div class="card-grid">
          <div 
            v-for="(college, index) in colleges" 
            :key="index"
            class="college-card"
            @click="goToCollege(college.path)"
          >
            <div class="card-corner"></div>
            <div class="card-icon">{{ college.icon }}</div>
            <h2>{{ college.name }}</h2>
            <p>{{ college.slogan }}</p >
          </div>
        </div>
        
        <div class="to-end-page">
          <button class="enter-btn" @click="currentPage = 'end'">
            <span class="btn-text">阅读卷末</span>
            <span class="btn-line"></span>
          </button>
        </div>
      </div>

      <!-- ================= 第三页：极限留白卷末页 ================= -->
      <div v-else-if="currentPage === 'end'" class="end-page" key="end">
        <div class="paper-texture"></div>
        
        <!-- 右上角卷末标识 -->
        <div class="corner-text-end">卷 末</div>

        <!-- 极简的居中文字区 -->
        <div class="end-content">
          <p class="philosophy-text">
            “ 慢慢走，<br>欣赏啊！ ”
          </p >
          <div class="short-line"></div>
        </div>

        <!-- 右下角重新开始 -->
        <div class="restart-area">
          <button class="enter-btn" @click="currentPage = 'cover'">
            <span class="btn-text">回到最初</span>
            <span class="btn-line"></span>
          </button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const currentPage = ref('cover')

const colleges = ref([
  { name: "计算机学院", icon: "💻", slogan: "Code is Law · 编织未来", path: "/college/cs" },
  { name: "机械与汽车", icon: "⚙️", slogan: "Precision & Power · 驱动世界", path: "/college/mech" },
  { name: "建筑学院", icon: "🏛️", slogan: "Form Follows Function · 构筑空间", path: "/college/arch" },
  { name: "电子与信息", icon: "⚡", slogan: "Connecting the World · 敏捷触达", path: "/college/ee" },
  { name: "化学与化工", icon: "⚗️", slogan: "Transmutation of Matter · 探索本质", path: "/college/chem" },
  { name: "外国语学院", icon: "🌍", slogan: "Language Connects · 沟通无界", path: "/college/fl" }
])

const goToCollege = (path) => {
  // router.push(path) // 如果路由没配好，先注释掉这行
  console.log("跳转到:", path)
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;1,400&family=Noto+Serif+SC:wght@400;600&display=swap');

/* ================= 全局设定 ================= */
.college-module {
  width: 100vw; height: 100vh; overflow: hidden;
  background-color: #f7f6f2; color: #1a1a1a;
  font-family: 'Playfair Display', 'Noto Serif SC', serif;
}
.paper-texture {
  position: absolute; top: 0; left: 0; width: 100%; height: 100%;
  opacity: 0.04; pointer-events: none;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
  z-index: 1;
}

/* ================= 通用极简按钮 ================= */
.enter-btn {
  background: transparent; border: none; font-family: inherit;
  font-size: 18px; letter-spacing: 4px; cursor: pointer;
  position: relative; padding: 10px 20px; color: #1a1a1a;
}
.btn-line {
  position: absolute; bottom: 0; left: 50%; transform: translateX(-50%);
  width: 0; height: 1px; background: #1a1a1a; transition: width 0.4s ease;
}
.enter-btn:hover .btn-line { width: 100%; }

/* ================= 第一页 ================= */
.cover-page {
  position: absolute; width: 100%; height: 100%;
  display: flex; flex-direction: column; justify-content: space-between;
  padding: 60px; box-sizing: border-box; z-index: 10;
}
.top-brand {
  display: flex; align-items: center; gap: 16px;
  font-family: sans-serif; font-size: 12px; letter-spacing: 2px;
  font-weight: 600; color: #666; position: relative; z-index: 2;
}
.brand-line { width: 40px; height: 1px; background: #1a1a1a; }
.cover-content { text-align: center; max-width: 800px; margin: 0 auto; position: relative; z-index: 2; }
.main-title { margin: 0; display: flex; flex-direction: column; align-items: center; gap: 10px; }
.main-title span { font-size: 80px; letter-spacing: 20px; font-weight: 600; }
.title-en { font-size: 24px !important; letter-spacing: 8px !important; font-style: italic; font-weight: 400 !important; color: #666; }
.sub-title { margin-top: 30px; font-size: 16px; letter-spacing: 4px; color: #555; }
.footer-info {
  display: flex; justify-content: space-between;
  font-family: sans-serif; font-size: 12px; letter-spacing: 1px; color: #888;
  position: relative; z-index: 2;
}

/* ================= 第二页：卡片列表 ================= */
.content-page {
  width: 100%; height: 100%; padding: 60px 10%;
  box-sizing: border-box; overflow-y: auto; position: relative; z-index: 2;
}
.page-header { text-align: center; margin-bottom: 50px; position: relative; }
.back-btn {
  position: absolute; left: 0; top: 10px; font-family: sans-serif;
  font-size: 14px; color: #666; cursor: pointer; transition: color 0.3s;
}
.back-btn:hover { color: #1a1a1a; }
.page-header h2 { font-size: 40px; letter-spacing: 8px; margin-bottom: 10px; font-weight: 400; }
.page-header p { font-size: 14px; letter-spacing: 4px; color: #666; }

.card-grid {
  display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 30px;
}
.college-card {
  background: #ffffff; padding: 50px 30px; text-align: center;
  cursor: pointer; position: relative; border: 1px solid #e5e5e5;
  transition: all 0.4s ease;
}
.card-corner {
  position: absolute; top: 0; left: 0; width: 20px; height: 20px;
  border-top: 1px solid #1a1a1a; border-left: 1px solid #1a1a1a;
  opacity: 0; transition: opacity 0.4s ease, transform 0.4s ease; transform: translate(-5px, -5px);
}
.college-card:hover { background: #fafafa; box-shadow: 0 20px 40px rgba(0,0,0,0.03); transform: translateY(-4px); }
.college-card:hover .card-corner { opacity: 1; transform: translate(0, 0); }
.card-icon {
  font-size: 36px; margin-bottom: 20px; filter: grayscale(100%) opacity(0.8);
  transition: filter 0.4s ease, transform 0.4s ease;
}
.college-card:hover .card-icon { filter: grayscale(0%) opacity(1); transform: scale(1.1); }
.college-card h2 { font-size: 22px; font-weight: 600; margin-bottom: 12px; letter-spacing: 2px; }
.college-card p { font-size: 13px; color: #666; font-family: sans-serif; letter-spacing: 1px; }

.to-end-page { text-align: center; margin-top: 60px; padding-bottom: 40px; }

/* ================= 第三页：极限留白卷末页 ================= */
.end-page {
  position: absolute; width: 100%; height: 100%;
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  z-index: 10; padding: 80px 60px; box-sizing: border-box;
}
.corner-text-end {
  position: absolute; top: 50px; right: 60px;
  font-size: 20px; letter-spacing: 6px; font-weight: 600; color: #4a6356;
  z-index: 2;
}
.end-content {
  text-align: center; position: relative; z-index: 2;
  max-width: 800px; 
}
.philosophy-text {
  /* 字号极大，字间距拉大，极具视觉冲击力 */
  font-size: clamp(40px, 6vw, 64px); 
  line-height: 1.8; 
  letter-spacing: 12px;
  color: #1a1a1a;
  font-weight: 600;
  margin: 0;
}
.short-line {
  width: 30px; height: 1px; background: #ccc; margin: 50px auto;
}
.restart-area {
  position: absolute; bottom: 50px; right: 60px; z-index: 2;
}

/* ================= 过渡动画 ================= */
.fade-slow-leave-active { transition: opacity 0.8s ease; }
.fade-slow-leave-to { opacity: 0; }
.fade-enter-active { transition: opacity 0.8s ease; }
.fade-enter-from { opacity: 0; }
</style>
