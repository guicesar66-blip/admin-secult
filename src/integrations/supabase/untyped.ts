// Untyped Supabase client for tables not yet in the generated schema
// Use `db` instead of `supabase` when querying tables like oficinas, oportunidades, etc.
import { supabase } from "./client";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const db = supabase as any;
