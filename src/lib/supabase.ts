import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function uploadAsset(projectId: string, file: File, folder?: string) {
  const filePath = `${projectId}/${folder ? folder + "/" : ""}${Date.now()}_${file.name}`;
  
  const { data, error } = await supabase.storage
    .from("assets")
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (error) {
    throw new Error(error.message);
  }

  const { data: { publicUrl } } = supabase.storage
    .from("assets")
    .getPublicUrl(filePath);

  return { path: data.path, publicUrl };
}

export async function deleteAsset(filePath: string) {
  const { error } = await supabase.storage
    .from("assets")
    .remove([filePath]);

  if (error) {
    throw new Error(error.message);
  }

  return true;
}
