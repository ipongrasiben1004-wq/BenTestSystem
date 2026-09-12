/**
 * 復興610 - Supabase 設定與初始化模組
 * 支援從 localStorage 動態載入自訂 Supabase 網址與 Key，或使用預設展示模式
 */

const SupabaseConfig = {
  // 預設專案連線資訊
  DEFAULT_URL: 'https://ojsqxlhhnqqtgznfwegs.supabase.co',
  DEFAULT_ANON_KEY: 'sb_publishable_3Sc6xDg89-0q1Fr1YhdiLQ_JuMei4CP',

  storageKeyUrl: 'fuxing610_supabase_url',
  storageKeyKey: 'fuxing610_supabase_anon_key',
  
  // 獲取目前設定的 Supabase 資訊
  getCredentials() {
    const url = localStorage.getItem(this.storageKeyUrl) || this.DEFAULT_URL;
    const anonKey = localStorage.getItem(this.storageKeyKey) || this.DEFAULT_ANON_KEY;
    return { url, anonKey, isConfigured: Boolean(url && anonKey) };
  },

  // 儲存新的 Supabase 資訊
  saveCredentials(url, anonKey) {
    if (url && anonKey) {
      localStorage.setItem(this.storageKeyUrl, url.trim());
      localStorage.setItem(this.storageKeyKey, anonKey.trim());
      return true;
    } else {
      localStorage.removeItem(this.storageKeyUrl);
      localStorage.removeItem(this.storageKeyKey);
      return false;
    }
  },

  // 取得 Supabase Client 實例（如果有載入 @supabase/supabase-js CDN）
  getClient() {
    const { url, anonKey, isConfigured } = this.getCredentials();
    if (isConfigured && window.supabase && typeof window.supabase.createClient === 'function') {
      try {
        return window.supabase.createClient(url, anonKey);
      } catch (err) {
        console.error('Supabase 初始化失敗:', err);
        return null;
      }
    }
    return null;
  }
};

window.SupabaseConfig = SupabaseConfig;
