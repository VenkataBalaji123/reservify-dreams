// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://sfrboyyyufhqsszhyjjg.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNmcmJveXl5dWZocXNzemh5ampnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzkyNTM1ODQsImV4cCI6MjA1NDgyOTU4NH0.had4X8-S0UGjovpNms5xxLfL6-qWWLq1L2H9buxEfFQ";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);