// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://bnmefdpbnlfufbjflwzl.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJubWVmZHBibmxmdWZiamZsd3psIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI2NTU3NDYsImV4cCI6MjA1ODIzMTc0Nn0.lNu2EQGE38lo4FtJuU7D1Lh-MrtaMhu7aBr7M6l0lbw";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);