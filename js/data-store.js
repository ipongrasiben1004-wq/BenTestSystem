/**
 * 復興610 - 統一資料存取層 (Data Store)
 * 無縫支援：Supabase 雲端資料庫 與 本地展示模式 (LocalStorage Fallback)
 */

const INITIAL_DEMO_DATA = {
  posts: [
    {
      id: 'news-demo-1',
      type: 'news',
      title: '🎉 歡迎來到復興610 專屬綜合資訊門戶站！',
      content: `這是專屬於我們復興610的全新起點！

這裡整合了三大核心功能：
1. 📰 **最新新聞快訊**：即時掌握重要公告、班級榮譽與活動通知。
2. 📖 **原創小說連載**：隨時閱讀精彩的校園創作，提供舒適護眼排版。
3. ✍️ **班級生活日記**：記錄每一次的歡笑與回憶，溫暖每位同學的心。

未來我們也會持續擴充更多功能，並已預留綁定自訂獨立網域的架構。歡迎常來逛逛！`,
      excerpt: '這是專屬於我們復興610的全新起點！整合新聞公告、原創小說與生活日記...',
      category: '重要公告',
      is_pinned: true,
      views: 128,
      likes: 42,
      author_name: '復興610 站長',
      created_at: new Date(Date.now() - 3600000 * 24 * 2).toISOString()
    },
    {
      id: 'news-demo-2',
      type: 'news',
      title: '📢 復興610 本週大掃除與班級競賽公告',
      content: `提醒各位610的夥伴們：
本週五下午將進行全校大掃除活動，請負責各區域的同學提早準備工具。
同時，班際籃球賽初賽將於下週二開打，歡迎大家踴躍到場為我們的選手加油打氣！`,
      excerpt: '本週五下午進行全校大掃除，下週二班際籃球賽開打，歡迎為選手加油！',
      category: '活動快訊',
      is_pinned: false,
      views: 86,
      likes: 19,
      author_name: '康樂幹事',
      created_at: new Date(Date.now() - 3600000 * 12).toISOString()
    },
    {
      id: 'diary-demo-1',
      type: 'diary',
      title: '今日的陽光與放學後的微風',
      content: `今天的數學課特別充實，黑板上寫滿了公式，但窗外的陽光灑進來的時候，整個教室特別溫暖。

放學後和大家在走廊聊了很久，看著夕陽慢慢染紅天際。這種平凡的日子，最值得被好好記錄下來。明天繼續加油！`,
      excerpt: '今天的數學課特別充實，窗外的陽光灑進來的時候，整個教室特別溫暖...',
      category: '生活隨筆',
      mood: 'happy',
      weather: 'sunny',
      views: 54,
      likes: 23,
      author_name: '小宇',
      created_at: new Date(Date.now() - 3600000 * 6).toISOString()
    },
    {
      id: 'diary-demo-2',
      type: 'diary',
      title: '雨天的午後圖書館與一杯熱奶茶',
      content: `午後下起了一場大雨，雨滴敲打著窗戶發出清脆的節奏。
我和幾位同學躲進圖書館自習，空氣中瀰漫著舊書頁的香氣。雖然雨天有些涼意，但手裡捧著剛買的熱奶茶，心裡感覺特別踏實平靜。`,
      excerpt: '午後下起了一場大雨，雨滴敲打著窗戶。我和幾位同學躲進圖書館自習...',
      category: '心情札記',
      mood: 'calm',
      weather: 'rainy',
      views: 41,
      likes: 15,
      author_name: '晴晴',
      created_at: new Date(Date.now() - 3600000 * 30).toISOString()
    }
  ],
  novels: [
    {
      id: 'novel-demo-1',
      title: '六樓十班的奇幻時空迴廊',
      author: '復興編劇社',
      description: '在一所名為復興的校園裡，位於六樓第十間教室的角落，藏著一扇通往不同時空的不可思議之門。平凡的高中生活，在某個下雨的午後徹底改變...',
      category: '校園奇幻',
      status: '連載中',
      cover_image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&auto=format&fit=crop&q=80',
      views: 350,
      likes: 76,
      created_at: new Date(Date.now() - 3600000 * 24 * 7).toISOString()
    }
  ],
  chapters: [
    {
      id: 'chapter-demo-1',
      novel_id: 'novel-demo-1',
      chapter_number: 1,
      title: '第一章：窗邊最後一排的秘密',
      content: `初秋的陽光穿透樹梢，在復興大樓六樓的走廊上印出斑駁的光影。

林晨坐在靠窗的最後一個位置，托著腮看著操場上的晨練人群。這間名為「610」的教室，在所有人眼中都只是普通的一班，直到今天早自習時，他無意間在課桌抽屜深處摸到了一把帶著古老金屬紋路的青銅鑰匙。

「林晨，你在發什麼呆？」同桌的阿翔輕輕撞了他一下，「班導走過來了。」

林晨連忙將鑰匙塞入口袋，但那枚鑰匙觸碰到指尖的剎那，他的耳邊竟然響起了一聲極其清脆的鐘聲，彷彿來自另一個世界的呼喚。

窗外的雲朵似乎在那一瞬間凝固了半秒，走廊上的微風也突兀地停止。當鐘聲漸漸平息，林晨再次低頭看向桌面時，發現木質桌面上不知何時浮現出一行淡金色的文字：

「時空的齒輪已重新轉動，守護者，歡迎歸位。」

這一切的冒險，就從這個看似尋常的星期三早晨開始展開了。`,
      word_count: 520,
      author_notes: '感謝大家閱讀第一章！這部作品將記錄屬於我們班級的冒險故事，每週定時更新！',
      views: 210,
      likes: 58,
      created_at: new Date(Date.now() - 3600000 * 24 * 5).toISOString()
    },
    {
      id: 'chapter-demo-2',
      novel_id: 'novel-demo-1',
      chapter_number: 2,
      title: '第二章：圖書館地下的舊書庫',
      content: `放學的鐘聲一響，林晨便背起書包，依約來到學校最偏僻的舊圖書館。

鑰匙上的溫度隨著他靠近舊館地下室而逐漸升高，散發出微弱的青藍色光澤。根據桌面上浮現的提示，第一處封印正位於地下三層的廢棄檔案室。

「你真的打算一個人進去？」門口傳來熟悉的聲音。林晨回過頭，看見班長蘇晴抱著一本厚重的校史冊，眼神認真地看著他。

「妳怎麼知道我在這裡？」林晨驚訝問道。

「因為在六樓教室，看見那行金字的人，不只你一個。」蘇晴微微一笑，從口袋裡拿出一枚同樣閃耀著微光的徽章。

兩人對視一眼，心中的疑慮瞬間化作前進的勇氣。推開沉重的木門，一條泛著螢光的螺旋階梯在他們眼前緩緩展開...`,
      word_count: 480,
      author_notes: '第二章登場！蘇晴與林晨正式結伴，接下來將深入舊書庫探尋神秘歷史！',
      views: 140,
      likes: 42,
      created_at: new Date(Date.now() - 3600000 * 24 * 2).toISOString()
    }
  ]
};

const DataStore = {
  // 本地快取 Storage Key
  LOCAL_POSTS_KEY: 'fuxing610_local_posts',
  LOCAL_NOVELS_KEY: 'fuxing610_local_novels',
  LOCAL_CHAPTERS_KEY: 'fuxing610_local_chapters',

  initLocalData() {
    if (!localStorage.getItem(this.LOCAL_POSTS_KEY)) {
      localStorage.setItem(this.LOCAL_POSTS_KEY, JSON.stringify(INITIAL_DEMO_DATA.posts));
    }
    if (!localStorage.getItem(this.LOCAL_NOVELS_KEY)) {
      localStorage.setItem(this.LOCAL_NOVELS_KEY, JSON.stringify(INITIAL_DEMO_DATA.novels));
    }
    if (!localStorage.getItem(this.LOCAL_CHAPTERS_KEY)) {
      localStorage.setItem(this.LOCAL_CHAPTERS_KEY, JSON.stringify(INITIAL_DEMO_DATA.chapters));
    }
  },

  // 取得文章 (新聞 / 日記)
  async getPosts(type = null) {
    const supabase = SupabaseConfig.getClient();
    if (supabase) {
      try {
        let query = supabase.from('posts').select('*').order('created_at', { ascending: false });
        if (type) query = query.eq('type', type);
        const { data, error } = await query;
        if (!error && data) return data;
      } catch (e) {
        console.warn('Supabase getPosts 讀取失敗，使用本地資料:', e);
      }
    }
    // Fallback
    this.initLocalData();
    let posts = JSON.parse(localStorage.getItem(this.LOCAL_POSTS_KEY) || '[]');
    if (type) posts = posts.filter(p => p.type === type);
    return posts.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  },

  // 取得單一文章
  async getPostById(id) {
    const supabase = SupabaseConfig.getClient();
    if (supabase) {
      try {
        const { data, error } = await supabase.from('posts').select('*').eq('id', id).single();
        if (!error && data) return data;
      } catch (e) {
        console.warn('Supabase getPostById 讀取失敗:', e);
      }
    }
    this.initLocalData();
    const posts = JSON.parse(localStorage.getItem(this.LOCAL_POSTS_KEY) || '[]');
    return posts.find(p => p.id === id) || null;
  },

  // 取得小說列表
  async getNovels() {
    const supabase = SupabaseConfig.getClient();
    if (supabase) {
      try {
        const { data, error } = await supabase.from('novels').select('*').order('created_at', { ascending: false });
        if (!error && data) return data;
      } catch (e) {
        console.warn('Supabase getNovels 讀取失敗:', e);
      }
    }
    this.initLocalData();
    const novels = JSON.parse(localStorage.getItem(this.LOCAL_NOVELS_KEY) || '[]');
    return novels.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  },

  // 取得單本小說
  async getNovelById(id) {
    const supabase = SupabaseConfig.getClient();
    if (supabase) {
      try {
        const { data, error } = await supabase.from('novels').select('*').eq('id', id).single();
        if (!error && data) return data;
      } catch (e) {
        console.warn('Supabase getNovelById 讀取失敗:', e);
      }
    }
    this.initLocalData();
    const novels = JSON.parse(localStorage.getItem(this.LOCAL_NOVELS_KEY) || '[]');
    return novels.find(n => n.id === id) || null;
  },

  // 取得特定小說章節
  async getChapters(novelId) {
    const supabase = SupabaseConfig.getClient();
    if (supabase) {
      try {
        const { data, error } = await supabase.from('novel_chapters').select('*').eq('novel_id', novelId).order('chapter_number', { ascending: true });
        if (!error && data) return data;
      } catch (e) {
        console.warn('Supabase getChapters 讀取失敗:', e);
      }
    }
    this.initLocalData();
    const chapters = JSON.parse(localStorage.getItem(this.LOCAL_CHAPTERS_KEY) || '[]');
    return chapters.filter(c => c.novel_id === novelId).sort((a, b) => a.chapter_number - b.chapter_number);
  },

  // 新增文章 (新聞/日記)
  async createPost(postData) {
    const newPost = {
      ...postData,
      id: 'post-' + Date.now(),
      views: 0,
      likes: 0,
      created_at: new Date().toISOString()
    };
    const supabase = SupabaseConfig.getClient();
    if (supabase) {
      try {
        const { data, error } = await supabase.from('posts').insert([postData]).select().single();
        if (!error && data) {
          console.log('✅ 成功寫入 Supabase 雲端資料庫:', data);
          return data;
        } else if (error) {
          console.error('❌ Supabase 寫入被拒絕 (通常是 RLS 權限未開放):', error);
          if (window.App) App.showToast('⚠️ 雲端寫入被拒絕，請檢查 Supabase RLS 權限', 'error');
        }
      } catch (e) {
        console.error('❌ Supabase 連線發生異常:', e);
      }
    }
    // Fallback 到本地
    console.warn('⚠️ 改為存入本機 LocalStorage');
    this.initLocalData();
    const posts = JSON.parse(localStorage.getItem(this.LOCAL_POSTS_KEY) || '[]');
    posts.unshift(newPost);
    localStorage.setItem(this.LOCAL_POSTS_KEY, JSON.stringify(posts));
    return newPost;
  },

  // 新增小說
  async createNovel(novelData) {
    const newNovel = {
      ...novelData,
      id: 'novel-' + Date.now(),
      views: 0,
      likes: 0,
      created_at: new Date().toISOString()
    };
    const supabase = SupabaseConfig.getClient();
    if (supabase) {
      try {
        const { data, error } = await supabase.from('novels').insert([novelData]).select().single();
        if (!error && data) return data;
      } catch (e) {
        console.warn('Supabase createNovel 失敗:', e);
      }
    }
    this.initLocalData();
    const novels = JSON.parse(localStorage.getItem(this.LOCAL_NOVELS_KEY) || '[]');
    novels.unshift(newNovel);
    localStorage.setItem(this.LOCAL_NOVELS_KEY, JSON.stringify(novels));
    return newNovel;
  },

  // 新增章節
  async createChapter(chapterData) {
    const newChapter = {
      ...chapterData,
      id: 'chap-' + Date.now(),
      views: 0,
      likes: 0,
      created_at: new Date().toISOString()
    };
    const supabase = SupabaseConfig.getClient();
    if (supabase) {
      try {
        const { data, error } = await supabase.from('novel_chapters').insert([chapterData]).select().single();
        if (!error && data) return data;
      } catch (e) {
        console.warn('Supabase createChapter 失敗:', e);
      }
    }
    this.initLocalData();
    const chapters = JSON.parse(localStorage.getItem(this.LOCAL_CHAPTERS_KEY) || '[]');
    chapters.push(newChapter);
    localStorage.setItem(this.LOCAL_CHAPTERS_KEY, JSON.stringify(chapters));
    return newChapter;
  },

  // 刪除文章 (新聞 / 日記)
  async deletePost(id) {
    const supabase = SupabaseConfig.getClient();
    if (supabase) {
      try {
        const { error } = await supabase.from('posts').delete().eq('id', id);
        if (error) {
          console.error('❌ Supabase 刪除失敗:', error);
          if (window.App) App.showToast('雲端刪除失敗: ' + error.message, 'error');
        } else {
          console.log('✅ Supabase 文章刪除成功:', id);
        }
      } catch (e) {
        console.warn('Supabase deletePost 異常:', e);
      }
    }
    this.initLocalData();
    let posts = JSON.parse(localStorage.getItem(this.LOCAL_POSTS_KEY) || '[]');
    posts = posts.filter(p => p.id !== id);
    localStorage.setItem(this.LOCAL_POSTS_KEY, JSON.stringify(posts));
    return true;
  },

  // 刪除小說
  async deleteNovel(id) {
    const supabase = SupabaseConfig.getClient();
    if (supabase) {
      try {
        const { error } = await supabase.from('novels').delete().eq('id', id);
        if (error) console.error('Supabase 刪除小說失敗:', error);
      } catch (e) {
        console.warn('Supabase deleteNovel 異常:', e);
      }
    }
    this.initLocalData();
    let novels = JSON.parse(localStorage.getItem(this.LOCAL_NOVELS_KEY) || '[]');
    novels = novels.filter(n => n.id !== id);
    localStorage.setItem(this.LOCAL_NOVELS_KEY, JSON.stringify(novels));
    return true;
  },

  // 清空本機所有範例快取
  clearLocalCache() {
    localStorage.removeItem(this.LOCAL_POSTS_KEY);
    localStorage.removeItem(this.LOCAL_NOVELS_KEY);
    localStorage.removeItem(this.LOCAL_CHAPTERS_KEY);
    localStorage.setItem(this.LOCAL_POSTS_KEY, '[]');
    localStorage.setItem(this.LOCAL_NOVELS_KEY, '[]');
    localStorage.setItem(this.LOCAL_CHAPTERS_KEY, '[]');
  },

  // 按讚與計數增加
  async likePost(id) {
    const supabase = SupabaseConfig.getClient();
    if (supabase) {
      try {
        // 先取得最新讚數
        const { data: currentPost } = await supabase.from('posts').select('likes').eq('id', id).single();
        if (currentPost) {
          const newLikes = (currentPost.likes || 0) + 1;
          await supabase.from('posts').update({ likes: newLikes }).eq('id', id);
          return newLikes;
        }
      } catch (e) {
        console.warn('Supabase likePost 失敗:', e);
      }
    }

    this.initLocalData();
    let posts = JSON.parse(localStorage.getItem(this.LOCAL_POSTS_KEY) || '[]');
    const p = posts.find(item => item.id === id);
    if (p) {
      p.likes = (p.likes || 0) + 1;
      localStorage.setItem(this.LOCAL_POSTS_KEY, JSON.stringify(posts));
      return p.likes;
    }
    return 1;
  }
};

window.DataStore = DataStore;
