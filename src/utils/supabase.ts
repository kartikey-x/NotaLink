import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://ilunufsznbrfgmzrhuzv.supabase.co';
const SUPABASE_KEY = 'sb_publishable_aFbitddmJP5exs6EvfW9_g_Jaj02IbF';

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export const saveNoteToCloud = async (content: string): Promise<string | null> => {
  try {
    const id = Math.random().toString(36).substring(2, 10); // short 8-char ID
    const { error } = await supabase
      .from('notes')
      .insert({ id, content });

    if (error) throw error;
    return id;
  } catch (err) {
    console.error('Error saving note to cloud:', err);
    return null;
  }
};

export const loadNoteFromCloud = async (id: string): Promise<string | null> => {
  try {
    const { data, error } = await supabase
      .from('notes')
      .select('content')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data?.content ?? null;
  } catch (err) {
    console.error('Error loading note from cloud:', err);
    return null;
  }
};
