import { createClient } from '@supabase/supabase-js';

// Supabase URL y clave anónima (pública)
// Para un proyecto de producción, estas deberían estar en variables de entorno
export const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-supabase-url.supabase.co';
export const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-supabase-key';

// Crear cliente de Supabase
export const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase; 