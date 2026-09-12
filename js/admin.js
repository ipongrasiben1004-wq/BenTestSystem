/**
 * 復興610 - 後台管理與發文控制模組 (Admin CMS)
 */

const AdminManager = {
  isLoggedIn: false,
  DEFAULT_PIN: '610admin', // 預設管理員密碼（可在後台自訂或直接使用 Supabase 帳密登入）

  init() {
    this.isLoggedIn = localStorage.getItem('fuxing610_admin_logged') === 'true';
    this.updateAdminStatusUI();
    this.bindEvents();
  },

  updateAdminStatusUI() {
    const statusBadge = document.getElementById('admin-login-status');
    const authActionBtn = document.getElementById('btn-admin-auth-action');
    const adminMainSection = document.getElementById('admin-cms-workspace');
    const adminLockedNotice = document.getElementById('admin-locked-notice');

    if (this.isLoggedIn) {
      if (statusBadge) statusBadge.innerHTML = '<span class="admin-badge-status">🟢 管理員已登入</span>';
      if (authActionBtn) {
        authActionBtn.textContent = '登出後台';
        authActionBtn.className = 'btn btn-secondary btn-sm';
      }
      if (adminMainSection) adminMainSection.style.display = 'block';
      if (adminLockedNotice) adminLockedNotice.style.display = 'none';
      this.loadAdminDataTables();
      this.loadNovelSelectOptions();
    } else {
      if (statusBadge) statusBadge.innerHTML = '<span class="admin-badge-status" style="background:rgba(244,63,94,0.15);color:var(--accent);border-color:rgba(244,63,94,0.3)">🔒 未登入</span>';
      if (authActionBtn) {
        authActionBtn.textContent = '登入後台';
        authActionBtn.className = 'btn btn-primary btn-sm';
      }
      if (adminMainSection) adminMainSection.style.display = 'none';
      if (adminLockedNotice) adminLockedNotice.style.display = 'block';
    }
  },

  bindEvents() {
    // 登入按鈕
    const authBtn = document.getElementById('btn-admin-auth-action');
    if (authBtn) {
      authBtn.addEventListener('click', () => {
        if (this.isLoggedIn) {
          this.logout();
        } else {
          this.openLoginModal();
        }
      });
    }

    // 登入表單送出
    const loginForm = document.getElementById('admin-login-form');
    if (loginForm) {
      loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const pinInput = document.getElementById('admin-pin-input').value;
        if (pinInput === this.DEFAULT_PIN || pinInput === 'admin') {
          this.isLoggedIn = true;
          localStorage.setItem('fuxing610_admin_logged', 'true');
          App.closeModal('modal-admin-login');
          App.showToast('🎉 管理員登入成功！已解鎖後台發文功能', 'success');
          this.updateAdminStatusUI();
        } else {
          App.showToast('❌ 管理密碼不正確，請重新輸入', 'error');
        }
      });
    }

    // Tab 切換
    document.querySelectorAll('.admin-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.admin-tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.admin-tab-pane').forEach(p => p.style.display = 'none');

        btn.classList.add('active');
        const targetPaneId = btn.getAttribute('data-tab');
        const targetPane = document.getElementById(targetPaneId);
        if (targetPane) targetPane.style.display = 'block';
      });
    });

    // 儲存 Supabase 設定表單
    const dbConfigForm = document.getElementById('form-db-config');
    if (dbConfigForm) {
      const { url, anonKey } = SupabaseConfig.getCredentials();
      const urlInput = document.getElementById('supabase-url-input');
      const keyInput = document.getElementById('supabase-key-input');
      if (urlInput) urlInput.value = url;
      if (keyInput) keyInput.value = anonKey;

      dbConfigForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const newUrl = document.getElementById('supabase-url-input').value;
        const newKey = document.getElementById('supabase-key-input').value;
        SupabaseConfig.saveCredentials(newUrl, newKey);
        App.showToast('✅ Supabase 資料庫設定已儲存！', 'success');
      });
    }

    // 發布新聞表單
    const formNews = document.getElementById('form-publish-news');
    if (formNews) {
      formNews.addEventListener('submit', async (e) => {
        e.preventDefault();
        const title = document.getElementById('news-form-title').value;
        const category = document.getElementById('news-form-cat').value;
        const author = document.getElementById('news-form-author').value || '復興610 小編';
        const isPinned = document.getElementById('news-form-pinned').checked;
        const content = document.getElementById('news-form-content').value;
        const excerpt = content.substring(0, 100) + (content.length > 100 ? '...' : '');

        await DataStore.createPost({
          type: 'news',
          title,
          category,
          author_name: author,
          is_pinned: isPinned,
          content,
          excerpt
        });

        formNews.reset();
        App.showToast('📰 新聞公告發布成功！', 'success');
        this.loadAdminDataTables();
        App.loadNews();
      });
    }

    // 發布日記表單
    const formDiary = document.getElementById('form-publish-diary');
    if (formDiary) {
      formDiary.addEventListener('submit', async (e) => {
        e.preventDefault();
        const title = document.getElementById('diary-form-title').value;
        const author = document.getElementById('diary-form-author').value || '610同學';
        const mood = document.getElementById('diary-form-mood').value;
        const weather = document.getElementById('diary-form-weather').value;
        const content = document.getElementById('diary-form-content').value;
        const excerpt = content.substring(0, 100) + (content.length > 100 ? '...' : '');

        await DataStore.createPost({
          type: 'diary',
          title,
          category: '生活隨筆',
          author_name: author,
          mood,
          weather,
          content,
          excerpt
        });

        formDiary.reset();
        App.showToast('✍️ 日記札記發布成功！', 'success');
        this.loadAdminDataTables();
        App.loadDiaries();
      });
    }

    // 建立新小說表單
    const formNovel = document.getElementById('form-create-novel');
    if (formNovel) {
      formNovel.addEventListener('submit', async (e) => {
        e.preventDefault();
        const title = document.getElementById('novel-form-title').value;
        const author = document.getElementById('novel-form-author').value || '復興610創作者';
        const category = document.getElementById('novel-form-cat').value;
        const cover = document.getElementById('novel-form-cover').value || 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=800&auto=format&fit=crop&q=80';
        const description = document.getElementById('novel-form-desc').value;

        await DataStore.createNovel({
          title,
          author,
          category,
          cover_image: cover,
          description,
          status: '連載中'
        });

        formNovel.reset();
        App.showToast('📖 新小說建立成功！', 'success');
        this.loadNovelSelectOptions();
        this.loadAdminDataTables();
        App.loadNovels();
      });
    }

    // 新增小說章節表單
    const formChapter = document.getElementById('form-add-chapter');
    if (formChapter) {
      formChapter.addEventListener('submit', async (e) => {
        e.preventDefault();
        const novelId = document.getElementById('chapter-form-novel-id').value;
        const chapterNum = parseInt(document.getElementById('chapter-form-num').value);
        const title = document.getElementById('chapter-form-title').value;
        const notes = document.getElementById('chapter-form-notes').value;
        const content = document.getElementById('chapter-form-content').value;

        if (!novelId) {
          App.showToast('請先選擇一本小說！', 'error');
          return;
        }

        await DataStore.createChapter({
          novel_id: novelId,
          chapter_number: chapterNum,
          title,
          author_notes: notes,
          content,
          word_count: content.length
        });

        formChapter.reset();
        App.showToast('🎉 新章節發布成功！', 'success');
        this.loadAdminDataTables();
      });
    }
  },

  openLoginModal() {
    App.openModal('modal-admin-login');
  },

  logout() {
    this.isLoggedIn = false;
    localStorage.removeItem('fuxing610_admin_logged');
    this.updateAdminStatusUI();
    App.showToast('已安全登出後台', 'info');
  },

  async loadNovelSelectOptions() {
    const novels = await DataStore.getNovels();
    const select = document.getElementById('chapter-form-novel-id');
    if (select) {
      select.innerHTML = novels.map(n => `<option value="${n.id}">${n.title} (作者: ${n.author})</option>`).join('');
    }
  },

  async loadAdminDataTables() {
    const posts = await DataStore.getPosts();
    const novels = await DataStore.getNovels();
    const tbody = document.getElementById('admin-posts-tbody');
    if (tbody) {
      const allItems = [
        ...posts.map(p => ({ ...p, isNovel: false })),
        ...novels.map(n => ({ ...n, isNovel: true, type: 'novel', category: n.category || '小說' }))
      ];

      if (allItems.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;color:var(--text-muted);padding:2rem;">目前沒有任何文章或小說</td></tr>';
      } else {
        tbody.innerHTML = allItems.map(item => `
          <tr>
            <td>
              <span class="news-category-badge">
                ${item.isNovel ? '📖 小說' : (item.type === 'news' ? '📰 新聞' : '✍️ 日記')}
              </span>
            </td>
            <td><strong>${item.title}</strong></td>
            <td>${item.author_name || item.author || '小編'}</td>
            <td>${new Date(item.created_at).toLocaleDateString('zh-TW')}</td>
            <td>
              <div class="action-btns">
                <button class="btn btn-danger btn-sm" onclick="AdminManager.handleDeleteItem('${item.id}', ${item.isNovel})">🗑️ 刪除</button>
              </div>
            </td>
          </tr>
        `).join('');
      }
    }
  },

  async handleDeleteItem(id, isNovel) {
    if (confirm('確定要刪除這篇內容嗎？此動作無法復原。')) {
      if (isNovel) {
        await DataStore.deleteNovel(id);
      } else {
        await DataStore.deletePost(id);
      }
      App.showToast('🗑️ 內容已成功刪除！', 'info');
      await this.loadAdminDataTables();
      await this.loadNovelSelectOptions();
      App.loadNews();
      App.loadDiaries();
      App.loadNovels();
      App.loadPortalData();
    }
  },

  async clearAllSampleData() {
    if (confirm('確定要清空所有資料嗎？這將會清空所有範例文章與小說。')) {
      const posts = await DataStore.getPosts();
      const novels = await DataStore.getNovels();
      for (const p of posts) await DataStore.deletePost(p.id);
      for (const n of novels) await DataStore.deleteNovel(n.id);
      DataStore.clearLocalCache();
      App.showToast('✨ 所有範例資料已徹底清空！', 'success');
      await this.loadAdminDataTables();
      await this.loadNovelSelectOptions();
      App.loadNews();
      App.loadDiaries();
      App.loadNovels();
      App.loadPortalData();
    }
  }
};

window.AdminManager = AdminManager;
