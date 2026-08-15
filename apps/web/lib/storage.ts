import type { createClient } from "@/lib/supabase/server";

type ServerClient = Awaited<ReturnType<typeof createClient>>;

export async function uploadPrivateFile(
  supabase: ServerClient,
  bucket: "reports" | "imports",
  path: string,
  body: Buffer | Uint8Array,
  contentType: string,
) {
  const { error } = await supabase.storage.from(bucket).upload(path, body, {
    contentType,
    upsert: true,
  });
  if (error) {
    throw new Error("Could not store the file.");
  }
  return path;
}

export async function signedFileUrl(supabase: ServerClient, bucket: "reports" | "imports", path: string, expiresIn = 3600) {
  const { data, error } = await supabase.storage.from(bucket).createSignedUrl(path, expiresIn);
  if (error || !data?.signedUrl) return null;
  return data.signedUrl;
}
