import { createClient } from '@supabase/supabase-js';

// The anon key is safe to expose in a frontend. Environment variables override
// these public fallbacks so the site also works on a first Vercel deploy.
const url = import.meta.env.VITE_SUPABASE_URL || 'https://gpjcwuxupxiwpjmyrcmp.supabase.co';
const key = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_vr9WjrOJFZWiEkn8Gnyerg_nxAZNgZI';
export const supabase = url && key ? createClient(url, key) : null;
export const visitorId = () => {
  const stored = localStorage.getItem('diccionardo-visitor');
  if (stored) return stored;
  const id = crypto.randomUUID();
  localStorage.setItem('diccionardo-visitor', id);
  return id;
};
export async function registerVisit() {
  if (!supabase) return null;
  const fingerprint = visitorId();
  const { error: visitError } = await supabase.from('site_visits').upsert({ fingerprint, last_seen_at: new Date().toISOString() }, { onConflict: 'fingerprint' });
  if (visitError) console.warn('Diccionardo visitas:', visitError.message);
  const { count, error } = await supabase.from('site_visits').select('*', { count: 'exact', head: true });
  if (error) console.warn('Diccionardo contador:', error.message);
  return count || 0;
}
export async function reactToWord(wordSlug, reaction) {
  if (!supabase) return null;
  const { error } = await supabase.from('word_reactions').upsert({ word_slug: wordSlug, fingerprint: visitorId(), reaction }, { onConflict: 'word_slug,fingerprint' });
  return error ? null : reaction;
}
export async function reactionTotals(slugs) {
  if (!supabase) return {};
  const { data, error } = await supabase.from('word_reactions').select('word_slug,reaction').in('word_slug', slugs);
  if (error) console.warn('Diccionardo reacciones:', error.message);
  return (data || []).reduce((all, row) => { all[row.word_slug] ||= { likes: 0, dislikes: 0 }; all[row.word_slug][row.reaction === 1 ? 'likes' : 'dislikes']++; return all; }, {});
}
