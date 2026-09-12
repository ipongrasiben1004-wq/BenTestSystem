/**
 * 復興610 - 沉浸式小說閱讀器控制模組 (Novel Reader)
 */

const ReaderManager = {
  currentNovel: null,
  currentChapters: [],
  currentChapterIndex: 0,
  fontSize: 19,
  currentTheme: 'dark', // 'dark', 'paper', 'eye', 'white'

  init() {
    this.fontSize = parseInt(localStorage.getItem('fuxing610_reader_font_size')) || 19;
    this.currentTheme = localStorage.getItem('fuxing610_reader_theme') || 'dark';
    this.applyReaderTheme(this.currentTheme);
    this.applyFontSize(this.fontSize);
  },

  async openChapter(novelId, chapterNumber) {
    const novel = await DataStore.getNovelById(novelId);
    const chapters = await DataStore.getChapters(novelId);

    if (!novel || !chapters.length) {
      if (window.App) App.showToast('無法載入該小說或章節', 'error');
      return;
    }

    this.currentNovel = novel;
    this.currentChapters = chapters;
    
    let index = chapters.findIndex(c => c.chapter_number === parseInt(chapterNumber));
    if (index === -1) index = 0;
    this.currentChapterIndex = index;

    this.renderCurrentChapter();
    
    const wrapper = document.getElementById('reader-wrapper');
    if (wrapper) {
      wrapper.classList.add('active');
      wrapper.scrollTop = 0;
      document.body.style.overflow = 'hidden';
    }

    // 儲存閱讀進度並增加點閱
    localStorage.setItem(`fuxing610_progress_${novelId}`, chapterNumber);
    DataStore.incrementNovelViews(novelId);
  },

  closeReader() {
    const wrapper = document.getElementById('reader-wrapper');
    if (wrapper) {
      wrapper.classList.remove('active');
      document.body.style.overflow = '';
    }
  },

  renderCurrentChapter() {
    const chapter = this.currentChapters[this.currentChapterIndex];
    if (!chapter) return;

    const novelTitleEl = document.getElementById('reader-nav-title');
    const novelSubTitleEl = document.getElementById('reader-novel-name');
    const chapterTitleEl = document.getElementById('reader-chapter-title');
    const metaDateEl = document.getElementById('reader-meta-date');
    const metaWordsEl = document.getElementById('reader-meta-words');
    const contentEl = document.getElementById('reader-body-content');
    const notesEl = document.getElementById('reader-author-notes-box');
    const notesTextEl = document.getElementById('reader-author-notes-text');
    
    const prevBtn = document.getElementById('reader-btn-prev');
    const nextBtn = document.getElementById('reader-btn-next');

    if (novelTitleEl) novelTitleEl.textContent = `${this.currentNovel.title} - ${chapter.title}`;
    if (novelSubTitleEl) novelSubTitleEl.textContent = `📖 ${this.currentNovel.title} · ${this.currentNovel.author}`;
    if (chapterTitleEl) chapterTitleEl.textContent = chapter.title;
    if (metaDateEl) metaDateEl.textContent = `發布時間：${new Date(chapter.created_at).toLocaleDateString('zh-TW')}`;
    if (metaWordsEl) metaWordsEl.textContent = `字數：約 ${chapter.word_count || chapter.content.length} 字`;
    
    if (contentEl) {
      // 將換行段落整理為乾淨的段落
      const paragraphs = chapter.content.split('\n\n').filter(p => p.trim().length > 0);
      contentEl.innerHTML = paragraphs.map(p => `<p>${p.trim()}</p>`).join('');
    }

    if (notesEl && notesTextEl) {
      if (chapter.author_notes) {
        notesEl.style.display = 'block';
        notesTextEl.textContent = chapter.author_notes;
      } else {
        notesEl.style.display = 'none';
      }
    }

    // 控制上一頁 / 下一頁按鈕
    if (prevBtn) {
      prevBtn.disabled = (this.currentChapterIndex === 0);
      prevBtn.style.opacity = (this.currentChapterIndex === 0) ? '0.4' : '1';
    }
    if (nextBtn) {
      nextBtn.disabled = (this.currentChapterIndex === this.currentChapters.length - 1);
      nextBtn.style.opacity = (this.currentChapterIndex === this.currentChapters.length - 1) ? '0.4' : '1';
    }
  },

  nextChapter() {
    if (this.currentChapterIndex < this.currentChapters.length - 1) {
      this.currentChapterIndex++;
      this.renderCurrentChapter();
      const wrapper = document.getElementById('reader-wrapper');
      if (wrapper) wrapper.scrollTop = 0;
    }
  },

  prevChapter() {
    if (this.currentChapterIndex > 0) {
      this.currentChapterIndex--;
      this.renderCurrentChapter();
      const wrapper = document.getElementById('reader-wrapper');
      if (wrapper) wrapper.scrollTop = 0;
    }
  },

  changeFontSize(delta) {
    this.fontSize = Math.min(28, Math.max(15, this.fontSize + delta));
    this.applyFontSize(this.fontSize);
    localStorage.setItem('fuxing610_reader_font_size', this.fontSize);
  },

  applyFontSize(size) {
    document.documentElement.style.setProperty('--reader-font-size', `${size}px`);
  },

  applyReaderTheme(theme) {
    this.currentTheme = theme;
    document.documentElement.setAttribute('data-reader-theme', theme);
    localStorage.setItem('fuxing610_reader_theme', theme);

    // Update active chip
    document.querySelectorAll('.theme-chip').forEach(chip => {
      chip.classList.toggle('active', chip.getAttribute('data-theme') === theme);
    });
  }
};

window.ReaderManager = ReaderManager;
