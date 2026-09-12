/**
 * 復興610 - 主應用程式核心 (App Core Router & UI Controller)
 */

const App = {
  currentView: 'portal',
  activeNewsCategory: '全部',

  init() {
    this.initTheme();
    this.bindGlobalEvents();
    this.handleRoute();

    // 監聽網址 Hash 變更
    window.addEventListener('hashchange', () => this.handleRoute());

    // 初始化各子模組
    ReaderManager.init();
    AdminManager.init();

    // 載入初始資料
    this.loadPortalData();
    this.loadNews();
    this.loadNovels();
    this.loadDiaries();
  },

  // 主題切換 (深色 / 淺色)
  initTheme() {
    const savedTheme = localStorage.getItem('fuxing610_theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    this.updateThemeIcon(savedTheme);

    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    if (themeToggleBtn) {
      themeToggleBtn.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('data-theme') || 'dark';
        const nextTheme = current === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', nextTheme);
        localStorage.setItem('fuxing610_theme', nextTheme);
        this.updateThemeIcon(nextTheme);
        this.showToast(`已切換為${nextTheme === 'dark' ? '極致深色' : '清新明亮'}模式`, 'info');
      });
    }
  },

  updateThemeIcon(theme) {
    const icon = document.getElementById('theme-toggle-icon');
    if (icon) {
      icon.textContent = (theme === 'dark') ? '🌙' : '☀️';
    }
  },

  // 綁定全站互動事件
  bindGlobalEvents() {
    // 手機端選單開關
    const mobileToggle = document.getElementById('mobile-menu-btn');
    const navMenu = document.getElementById('nav-menu');
    if (mobileToggle && navMenu) {
      mobileToggle.addEventListener('click', () => {
        navMenu.classList.toggle('open');
      });

      // 點擊連結後自動關閉選單
      navMenu.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => navMenu.classList.remove('open'));
      });
    }

    // 彈窗背景點擊關閉
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
          overlay.classList.remove('active');
        }
      });
    });

    // 彈窗關閉按鈕
    document.querySelectorAll('.modal-close').forEach(btn => {
      btn.addEventListener('click', () => {
        const modal = btn.closest('.modal-overlay');
        if (modal) modal.classList.remove('active');
      });
    });
  },

  // 路由分發
  handleRoute() {
    const hash = window.location.hash.replace('#', '') || 'portal';
    const [viewName, param] = hash.split('/');

    this.currentView = viewName;
    document.querySelectorAll('.view-container').forEach(view => {
      view.style.display = 'none';
    });

    // 更新導航列 Active 狀態
    document.querySelectorAll('.nav-link').forEach(link => {
      const linkHash = link.getAttribute('href') ? link.getAttribute('href').replace('#', '') : '';
      link.classList.toggle('active', linkHash === viewName);
    });

    // 顯示目標視圖
    const targetViewEl = document.getElementById(`view-${viewName}`);
    if (targetViewEl) {
      targetViewEl.style.display = 'block';
      window.scrollTo(0, 0);
    } else {
      const portalEl = document.getElementById('view-portal');
      if (portalEl) portalEl.style.display = 'block';
    }

    // 針對特殊路由加載數據
    if (viewName === 'novels' && param) {
      this.loadNovelDetail(param);
    } else if (viewName === 'portal') {
      this.loadPortalData();
    }
  },

  navigateTo(hash) {
    window.location.hash = hash;
  },

  // ================= 1. 首頁數據加載 =================
  async loadPortalData() {
    const posts = await DataStore.getPosts();
    const newsList = posts.filter(p => p.type === 'news');
    const diaryList = posts.filter(p => p.type === 'diary');
    const novels = await DataStore.getNovels();

    // 更新統計數字
    const totalNewsEl = document.getElementById('stat-total-news');
    const totalNovelsEl = document.getElementById('stat-total-novels');
    const totalDiariesEl = document.getElementById('stat-total-diaries');
    const totalViewsEl = document.getElementById('stat-total-views');

    if (totalNewsEl) totalNewsEl.textContent = newsList.length;
    if (totalNovelsEl) totalNovelsEl.textContent = novels.length;
    if (totalDiariesEl) totalDiariesEl.textContent = diaryList.length;

    let totalViews = 0;
    posts.forEach(p => totalViews += (p.views || 0));
    novels.forEach(n => totalViews += (n.views || 0));
    if (totalViewsEl) totalViewsEl.textContent = totalViews > 1000 ? (totalViews / 1000).toFixed(1) + 'k' : totalViews;

    // 首頁三大板塊快捷列表
    const portalNewsList = document.getElementById('portal-news-list');
    if (portalNewsList) {
      portalNewsList.innerHTML = newsList.slice(0, 3).map(n => `
        <li>
          <a class="pillar-item-link" onclick="App.openNewsDetail('${n.id}')">
            <span>${n.is_pinned ? '📌 ' : ''}${n.title}</span>
            <span class="pillar-item-date">${new Date(n.created_at).toLocaleDateString('zh-TW')}</span>
          </a>
        </li>
      `).join('');
    }

    const portalNovelsList = document.getElementById('portal-novels-list');
    if (portalNovelsList) {
      portalNovelsList.innerHTML = novels.slice(0, 3).map(n => `
        <li>
          <a class="pillar-item-link" href="#novels/${n.id}">
            <span>📖 ${n.title}</span>
            <span class="pillar-item-date">${n.status}</span>
          </a>
        </li>
      `).join('');
    }

    const portalDiariesList = document.getElementById('portal-diaries-list');
    if (portalDiariesList) {
      portalDiariesList.innerHTML = diaryList.slice(0, 3).map(d => `
        <li>
          <a class="pillar-item-link" href="#diaries">
            <span>✍️ ${d.title}</span>
            <span class="pillar-item-date">${new Date(d.created_at).toLocaleDateString('zh-TW')}</span>
          </a>
        </li>
      `).join('');
    }
  },

  // ================= 2. 新聞公告專區 =================
  async loadNews(category = '全部', keyword = '') {
    this.activeNewsCategory = category;
    const posts = await DataStore.getPosts('news');
    const container = document.getElementById('news-list-container');
    if (!container) return;

    let filtered = posts;
    if (category !== '全部') {
      filtered = filtered.filter(p => p.category === category);
    }
    if (keyword.trim()) {
      const q = keyword.trim().toLowerCase();
      filtered = filtered.filter(p => p.title.toLowerCase().includes(q) || p.content.toLowerCase().includes(q));
    }

    if (filtered.length === 0) {
      container.innerHTML = `<div class="glass-card" style="padding: 2.5rem; text-align: center; color: var(--text-muted);">
        暫無符合條件的新聞或公告
      </div>`;
      return;
    }

    container.innerHTML = filtered.map(news => `
      <div class="glass-card news-card ${news.is_pinned ? 'pinned' : ''}">
        <div class="news-top-meta">
          ${news.is_pinned ? '<span class="badge-pinned">📌 置頂公告</span>' : ''}
          <span class="news-category-badge">${news.category || '一般'}</span>
          <span class="news-date">發布於 ${new Date(news.created_at).toLocaleDateString('zh-TW')}</span>
          <span style="color: var(--text-muted);">· 作者: ${news.author_name || '610小編'}</span>
        </div>
        <h3 class="news-card-title" onclick="App.openNewsDetail('${news.id}')">${news.title}</h3>
        <p class="news-card-excerpt">${news.excerpt || news.content.substring(0, 120)}</p>
        <div class="news-bottom-meta">
          <div class="news-stats-group">
            <span class="stat-tag">👁️ ${news.views || 0} 次瀏覽</span>
            <button class="btn-like" onclick="App.handleLikePost('${news.id}', this)">
              ❤️ <span>${news.likes || 0}</span>
            </button>
          </div>
          <button class="btn btn-secondary btn-sm" onclick="App.openNewsDetail('${news.id}')">閱讀完整內容 →</button>
        </div>
      </div>
    `).join('');
  },

  filterNewsCategory(cat, el) {
    document.querySelectorAll('.category-chip').forEach(c => c.classList.remove('active'));
    if (el) el.classList.add('active');
    const searchVal = document.getElementById('news-search-input')?.value || '';
    this.loadNews(cat, searchVal);
  },

  searchNews(val) {
    this.loadNews(this.activeNewsCategory, val);
  },

  async openNewsDetail(id) {
    const post = await DataStore.getPostById(id);
    if (!post) return;

    document.getElementById('news-modal-title').textContent = post.title;
    document.getElementById('news-modal-meta').innerHTML = `
      <span>🏷️ ${post.category || '公告'}</span>
      <span>✍️ 作者：${post.author_name || '復興610 小編'}</span>
      <span>📅 發布時間：${new Date(post.created_at).toLocaleDateString('zh-TW')}</span>
      <span>👁️ ${post.views || 0} 次點閱</span>
    `;
    document.getElementById('news-modal-body').textContent = post.content;

    this.openModal('modal-news-detail');
  },

  // ================= 3. 小說專區 =================
  async loadNovels() {
    const novels = await DataStore.getNovels();
    const container = document.getElementById('novel-bookshelf-grid');
    if (!container) return;

    if (novels.length === 0) {
      container.innerHTML = `<div class="glass-card" style="padding: 2.5rem; grid-column: 1/-1; text-align: center; color: var(--text-muted);">
        書架上暫無作品，歡迎至後台發布第一部創作！
      </div>`;
      return;
    }

    container.innerHTML = novels.map(novel => `
      <div class="glass-card novel-card">
        <div class="novel-cover-wrap">
          <img src="${novel.cover_image || 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800'}" alt="${novel.title}" class="novel-cover-img" />
          <span class="novel-badge-status">${novel.status}</span>
        </div>
        <div class="novel-body">
          <h3 class="novel-title">${novel.title}</h3>
          <div class="novel-meta">
            <span>✍️ ${novel.author}</span>
            <span>🏷️ ${novel.category}</span>
          </div>
          <p class="novel-desc">${novel.description || '暫無簡介'}</p>
          <div class="novel-footer">
            <span style="font-size: 0.85rem; color: var(--text-muted);">❤️ ${novel.likes || 0} 推薦</span>
            <a href="#novels/${novel.id}" class="btn btn-primary btn-sm">查看目錄 →</a>
          </div>
        </div>
      </div>
    `).join('');
  },

  async loadNovelDetail(novelId) {
    const novel = await DataStore.getNovelById(novelId);
    if (!novel) return;

    const chapters = await DataStore.getChapters(novelId);
    
    // 渲染小說詳情介面
    const detailView = document.getElementById('view-novel-detail');
    if (!detailView) return;

    detailView.innerHTML = `
      <div class="container">
        <div style="margin-bottom: 1.5rem;">
          <a href="#novels" class="btn btn-secondary btn-sm">← 返回書架</a>
        </div>
        <div class="glass-panel novel-detail-header">
          <img src="${novel.cover_image || 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800'}" class="novel-detail-cover" alt="${novel.title}">
          <div class="novel-detail-info">
            <div style="margin-bottom: 0.75rem;">
              <span class="news-category-badge">${novel.category}</span>
              <span class="novel-badge-status" style="position: static; margin-left: 0.5rem;">${novel.status}</span>
            </div>
            <h1 style="font-size: 2.2rem; margin-bottom: 0.75rem;">${novel.title}</h1>
            <p style="color: var(--text-secondary); margin-bottom: 1rem;">作者：<strong>${novel.author}</strong> · 連載章節：<strong>${chapters.length}</strong> 章</p>
            <p style="color: var(--text-secondary); line-height: 1.7; margin-bottom: 1.5rem;">${novel.description || ''}</p>
            <div>
              ${chapters.length > 0 ? `
                <button class="btn btn-primary" onclick="ReaderManager.openChapter('${novel.id}', 1)">📖 開始閱讀第一章</button>
              ` : `
                <button class="btn btn-secondary" disabled>尚無章節連載</button>
              `}
            </div>
          </div>
        </div>

        <div class="glass-panel" style="padding: 2rem;">
          <h2 style="font-size: 1.35rem; margin-bottom: 1rem; border-bottom: 1px solid var(--border-glass); padding-bottom: 0.75rem;">
            📑 章節目錄 (${chapters.length})
          </h2>
          <div class="chapter-list">
            ${chapters.length > 0 ? chapters.map(ch => `
              <div class="chapter-card" onclick="ReaderManager.openChapter('${novel.id}', ${ch.chapter_number})">
                <span class="chapter-num">第 ${ch.chapter_number} 章</span>
                <span class="chapter-card-title">${ch.title}</span>
              </div>
            `).join('') : '<p style="color: var(--text-muted);">作者正在努力碼字中，敬請期待！</p>'}
          </div>
        </div>
      </div>
    `;

    document.querySelectorAll('.view-container').forEach(v => v.style.display = 'none');
    detailView.style.display = 'block';
    window.scrollTo(0, 0);
  },

  // ================= 4. 日記專區 =================
  async loadDiaries() {
    const diaries = await DataStore.getPosts('diary');
    const container = document.getElementById('diary-timeline-container');
    if (!container) return;

    if (diaries.length === 0) {
      container.innerHTML = `<div class="glass-card" style="padding: 2.5rem; text-align: center; color: var(--text-muted);">
        目前尚無日記紀錄，快來記下今天的點滴吧！
      </div>`;
      return;
    }

    const moodMap = {
      happy: '😊 開心愉悅',
      calm: '🌿 平靜祥和',
      inspired: '💡 靈感滿滿',
      tired: '😴 有點疲憊',
      excited: '🔥 熱血沸騰'
    };

    const weatherMap = {
      sunny: '☀️ 晴空萬里',
      cloudy: '⛅ 多雲微陰',
      rainy: '🌧️ 綿綿細雨',
      windy: '🍃 微風徐徐'
    };

    container.innerHTML = diaries.map(item => {
      const d = new Date(item.created_at);
      const day = d.getDate();
      const monthYear = `${d.getFullYear()}.${d.getMonth() + 1}`;

      return `
        <div class="diary-entry">
          <div class="diary-dot">✍️</div>
          <div class="diary-card">
            <div class="diary-header">
              <div class="diary-date-badge">
                <span class="diary-day">${day < 10 ? '0' + day : day}</span>
                <span class="diary-month-year">${monthYear}</span>
              </div>
              <div class="diary-badges-wrap">
                ${item.mood ? `<span class="mood-badge ${item.mood}">${moodMap[item.mood] || item.mood}</span>` : ''}
                ${item.weather ? `<span class="weather-badge">${weatherMap[item.weather] || item.weather}</span>` : ''}
              </div>
            </div>
            <h3 class="diary-title">${item.title}</h3>
            <p class="diary-body">${item.content}</p>
            <div class="diary-footer">
              <span>✍️ 記錄者：${item.author_name || '同學'}</span>
              <button class="btn-like" onclick="App.handleLikePost('${item.id}', this)">
                ❤️ <span>${item.likes || 0}</span> 溫暖點讚
              </button>
            </div>
          </div>
        </div>
      `;
    }).join('');
  },

  // ================= 互動輔助 (讚 / 彈窗 / 提示) =================
  async handleLikePost(id, btnEl) {
    const count = await DataStore.likePost(id);
    const span = btnEl.querySelector('span');
    if (span) span.textContent = count;
    btnEl.classList.add('liked');
    this.showToast('❤️ 感謝您的溫暖點讚與支持！', 'success');
  },

  openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.add('active');
  },

  closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.remove('active');
  },

  showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    let icon = 'ℹ️';
    if (type === 'success') icon = '✅';
    if (type === 'error') icon = '❌';

    toast.innerHTML = `<span>${icon}</span> <span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(-10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }
};

window.App = App;

// DOM 載入後啟動
document.addEventListener('DOMContentLoaded', () => {
  App.init();
});
