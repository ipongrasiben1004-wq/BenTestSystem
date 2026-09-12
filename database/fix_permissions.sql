-- ==============================================================================
-- 復興610 一鍵解鎖 Supabase 讀寫權限腳本 (RLS Fix)
-- 請複製以下全部內容，到 Supabase 的「SQL Editor」貼上並點擊「Run」！
-- ==============================================================================

-- 1. 解除並重新設定 posts 資料表權限
ALTER TABLE IF EXISTS public.posts DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.posts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can read posts" ON public.posts;
DROP POLICY IF EXISTS "Admin can insert posts" ON public.posts;
DROP POLICY IF EXISTS "Admin can update posts" ON public.posts;
DROP POLICY IF EXISTS "Admin can delete posts" ON public.posts;
DROP POLICY IF EXISTS "Allow all select posts" ON public.posts;
DROP POLICY IF EXISTS "Allow all insert posts" ON public.posts;
DROP POLICY IF EXISTS "Allow all update posts" ON public.posts;
DROP POLICY IF EXISTS "Allow all delete posts" ON public.posts;
DROP POLICY IF EXISTS "Allow all to insert posts" ON public.posts;
DROP POLICY IF EXISTS "Allow all to update posts" ON public.posts;
DROP POLICY IF EXISTS "Allow all to delete posts" ON public.posts;

CREATE POLICY "Allow all select posts" ON public.posts FOR SELECT USING (true);
CREATE POLICY "Allow all insert posts" ON public.posts FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow all update posts" ON public.posts FOR UPDATE USING (true);
CREATE POLICY "Allow all delete posts" ON public.posts FOR DELETE USING (true);

-- 2. 解除並重新設定 novels 資料表權限
ALTER TABLE IF EXISTS public.novels DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.novels ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can read novels" ON public.novels;
DROP POLICY IF EXISTS "Admin can insert novels" ON public.novels;
DROP POLICY IF EXISTS "Admin can update novels" ON public.novels;
DROP POLICY IF EXISTS "Admin can delete novels" ON public.novels;
DROP POLICY IF EXISTS "Allow all select novels" ON public.novels;
DROP POLICY IF EXISTS "Allow all insert novels" ON public.novels;
DROP POLICY IF EXISTS "Allow all update novels" ON public.novels;
DROP POLICY IF EXISTS "Allow all delete novels" ON public.novels;
DROP POLICY IF EXISTS "Allow all to insert novels" ON public.novels;
DROP POLICY IF EXISTS "Allow all to update novels" ON public.novels;
DROP POLICY IF EXISTS "Allow all to delete novels" ON public.novels;

CREATE POLICY "Allow all select novels" ON public.novels FOR SELECT USING (true);
CREATE POLICY "Allow all insert novels" ON public.novels FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow all update novels" ON public.novels FOR UPDATE USING (true);
CREATE POLICY "Allow all delete novels" ON public.novels FOR DELETE USING (true);

-- 3. 解除並重新設定 novel_chapters 資料表權限
ALTER TABLE IF EXISTS public.novel_chapters DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.novel_chapters ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can read chapters" ON public.novel_chapters;
DROP POLICY IF EXISTS "Admin can insert chapters" ON public.novel_chapters;
DROP POLICY IF EXISTS "Admin can update chapters" ON public.novel_chapters;
DROP POLICY IF EXISTS "Admin can delete chapters" ON public.novel_chapters;
DROP POLICY IF EXISTS "Allow all select chapters" ON public.novel_chapters;
DROP POLICY IF EXISTS "Allow all insert chapters" ON public.novel_chapters;
DROP POLICY IF EXISTS "Allow all update chapters" ON public.novel_chapters;
DROP POLICY IF EXISTS "Allow all delete chapters" ON public.novel_chapters;
DROP POLICY IF EXISTS "Allow all to insert chapters" ON public.novel_chapters;
DROP POLICY IF EXISTS "Allow all to update chapters" ON public.novel_chapters;
DROP POLICY IF EXISTS "Allow all to delete chapters" ON public.novel_chapters;

CREATE POLICY "Allow all select chapters" ON public.novel_chapters FOR SELECT USING (true);
CREATE POLICY "Allow all insert chapters" ON public.novel_chapters FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow all update chapters" ON public.novel_chapters FOR UPDATE USING (true);
CREATE POLICY "Allow all delete chapters" ON public.novel_chapters FOR DELETE USING (true);

-- 4. comments 權限
ALTER TABLE IF EXISTS public.comments DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.comments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can read comments" ON public.comments;
DROP POLICY IF EXISTS "Public can insert comments" ON public.comments;
CREATE POLICY "Allow all select comments" ON public.comments FOR SELECT USING (true);
CREATE POLICY "Allow all insert comments" ON public.comments FOR INSERT WITH CHECK (true);
