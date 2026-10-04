import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://irfkwzvioggnnhxnxvxd.supabase.co";
const supabaseKey = "sb_publishable_5Ew3MbUVCrYLxvahtJw5rQ_2PJoda5P";

export const supabase = createClient(
  supabaseUrl,
  supabaseKey
);