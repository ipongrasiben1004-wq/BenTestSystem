-- ==============================================================================
-- 復興610 綜合資訊門戶（新聞、小說、日記）Supabase 資料庫結構腳本
-- 請複製以下所有內容，前往 Supabase 專案的「SQL Editor」貼上並點擊「Run」即可完成建表！
-- ==============================================================================

-- 1. 新聞公告與日記資料表 (posts)
CREATE TABLE IF NOT EXISTS public.posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type VARCHAR(20) NOT NULL CHECK (type IN ('news', 'diary')),
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    excerpt VARCHAR(500),
    cover_image TEXT,
    category VARCHAR(50) DEFAULT '一般',
    mood VARCHAR(50), -- 適用於日記 (例如: happy, calm, inspired, tired, excited)
    weather VARCHAR(50), -- 適用於日記 (例如: sunny, cloudy, rainy, windy)
    is_pinned BOOLEAN DEFAULT false, -- 適用於新聞置頂
    views INTEGER DEFAULT 0,
    likes INTEGER DEFAULT 0,
    author_name VARCHAR(100) DEFAULT '復興610 小編',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. 小說專區資料表 (novels)
CREATE TABLE IF NOT EXISTS public.novels (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    author VARCHAR(100) NOT NULL DEFAULT '復興610創作者',
    description TEXT,
    cover_image TEXT,
    category VARCHAR(50) DEFAULT '校園奇幻',
    status VARCHAR(20) DEFAULT '連載中' CHECK (status IN ('連載中', '已完結', '暫停更新')),
    views INTEGER DEFAULT 0,
    likes INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. 小說章節資料表 (novel_chapters)
CREATE TABLE IF NOT EXISTS public.novel_chapters (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    novel_id UUID NOT NULL REFERENCES public.novels(id) ON DELETE CASCADE,
    chapter_number INTEGER NOT NULL,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    word_count INTEGER DEFAULT 0,
    author_notes TEXT,
    views INTEGER DEFAULT 0,
    likes INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(novel_id, chapter_number)
);

-- 4. 讀者留言與互動資料表 (comments)
CREATE TABLE IF NOT EXISTS public.comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    target_type VARCHAR(20) NOT NULL CHECK (target_type IN ('post', 'chapter', 'novel')),
    target_id UUID NOT NULL,
    author_name VARCHAR(100) NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 啟用 Row Level Security (RLS) 安全機制
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.novels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.novel_chapters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

-- 設定讀取權限：允許所有人（訪客）公開閱讀
CREATE POLICY "Public can read posts" ON public.posts FOR SELECT USING (true);
CREATE POLICY "Public can read novels" ON public.novels FOR SELECT USING (true);
CREATE POLICY "Public can read chapters" ON public.novel_chapters FOR SELECT USING (true);
CREATE POLICY "Public can read comments" ON public.comments FOR SELECT USING (true);

-- 設定互動權限：允許公開按讚與留言、更新點擊率
CREATE POLICY "Public can insert comments" ON public.comments FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can update post stats" ON public.posts FOR UPDATE USING (true);
CREATE POLICY "Public can update novel stats" ON public.novels FOR UPDATE USING (true);
CREATE POLICY "Public can update chapter stats" ON public.novel_chapters FOR UPDATE USING (true);

-- 設定管理寫入權限：允許新增、修改、刪除文章（由前端 PIN 密碼控制）
CREATE POLICY "Allow all to insert posts" ON public.posts FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow all to update posts" ON public.posts FOR UPDATE USING (true);
CREATE POLICY "Allow all to delete posts" ON public.posts FOR DELETE USING (true);

CREATE POLICY "Allow all to insert novels" ON public.novels FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow all to update novels" ON public.novels FOR UPDATE USING (true);
CREATE POLICY "Allow all to delete novels" ON public.novels FOR DELETE USING (true);

CREATE POLICY "Allow all to insert chapters" ON public.novel_chapters FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow all to update chapters" ON public.novel_chapters FOR UPDATE USING (true);
CREATE POLICY "Allow all to delete chapters" ON public.novel_chapters FOR DELETE USING (true);

-- 插入復興610 預設初始精美範例資料
INSERT INTO public.posts (type, title, content, excerpt, category, is_pinned, author_name)
VALUES (
    'news',
    '🎉 歡迎來到復興610 專屬綜合資訊門戶站！',
    '這是專屬於我們復興610的全新起點！這裡結合了【最新新聞快訊】、【原創小說連載】以及【班級生活日記】。\n\n大家可以在這裡閱讀最新的校園大事、閱讀精彩的班級創作，還能透過管理後台隨時發布新的故事與生活札記。\n\n歡迎大家把本站加入書籤，並分享給所有610的夥伴們！',
    '這是專屬於復興610的全新起點！結合新聞快訊、小說連載與生活日記...',
    '重要公告',
    true,
    '復興610 站長'
);

INSERT INTO public.posts (type, title, content, excerpt, category, mood, weather, author_name)
VALUES (
    'diary',
    '今日的陽光與放學後的微風',
    '今天的數學課特別充實，黑板上寫滿了公式，但窗外的陽光灑進來的時候，整個教室特別溫暖。\n\n放學後和大家在走廊聊了很久，這種平凡的日子，最值得被好好記錄下來。明天繼續加油！',
    '今天的數學課特別充實，窗外的陽光灑進來的時候特別溫暖...',
    '生活隨筆',
    'happy',
    'sunny',
    '小宇'
);

INSERT INTO public.novels (id, title, author, description, category, status, cover_image)
VALUES (
    'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
    '六樓十班的奇幻時空迴廊',
    '復興編劇社',
    '在一所名為復興的校園裡，位於六樓第十間教室的角落，藏著一扇通往不同時空的不可思議之門。平凡的高中生活，在某個下雨的午後徹底改變...',
    '校園奇幻',
    '連載中',
    'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&auto=format&fit=crop&q=80'
);

INSERT INTO public.novel_chapters (novel_id, chapter_number, title, content, word_count, author_notes)
VALUES (
    'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
    1,
    '第一章：窗邊最後一排的秘密',
    '初秋的陽光穿透樹梢，在復興大樓六樓的走廊上印出斑駁的光影。\n\n林晨坐在靠窗的最後一個位置，托著腮看著操場上的晨練人群。這間名為「610」的教室，在所有人眼中都只是普通的一班，直到今天早自習時，他無意間在課桌抽屜深處摸到了一把帶著古老金屬紋路的青銅鑰匙。\n\n「林晨，你在發什麼呆？」同桌的阿翔輕輕撞了他一下，「班導走過來了。」\n\n林晨連忙將鑰匙塞入口袋，但那枚鑰匙觸碰到指尖的剎那，他的耳邊竟然響起了一聲極其清脆的鐘聲，彷彿來自另一個世界的呼喚...\n\n這一切的冒險，就從這個看似尋常的星期三開始展開了。',
    420,
    '感謝大家支持第一章！每週定時更新，敬請期待接下來的劇情發展。'
);
