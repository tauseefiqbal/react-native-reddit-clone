import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "../types/database.types";

const isRemoteUrl = (path: string) =>
  path.startsWith("http://") || path.startsWith("https://");

const mimeByExt: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  gif: "image/gif",
  webp: "image/webp",
  heic: "image/heic",
};

const extByMime: Record<string, string> = {
  "image/jpeg": "jpeg",
  "image/png": "png",
  "image/gif": "gif",
  "image/webp": "webp",
  "image/heic": "heic",
};

const normalizeStoragePath = (path: string) => path.replace(/^\//, "");

/** Resolves a post/group image path or URL to something React Native Image can load. */
export const resolveImageUri = async (
  path: string,
  bucket: string,
  supabase: SupabaseClient<Database>,
): Promise<string> => {
  if (isRemoteUrl(path)) {
    return path;
  }

  let storagePath = normalizeStoragePath(path);
  if (storagePath.startsWith(`${bucket}/`)) {
    storagePath = storagePath.slice(bucket.length + 1);
  }

  // 1. Try createSignedUrl first (works for private & public buckets with auth token)
  try {
    const { data, error } = await supabase.storage
      .from(bucket)
      .createSignedUrl(storagePath, 60 * 60);

    if (!error && data?.signedUrl) {
      return data.signedUrl;
    }
  } catch (err) {
    console.warn("createSignedUrl failed, trying fallback:", err);
  }

  // 2. Try publicUrl (works if bucket or object is public)
  try {
    const { data } = supabase.storage.from(bucket).getPublicUrl(storagePath);
    if (data?.publicUrl) {
      return data.publicUrl;
    }
  } catch (err) {
    console.warn("getPublicUrl failed:", err);
  }

  // 3. Fallback: download blob and convert using React Native's FileReader (built-in, does not require btoa)
  try {
    const { data: blob, error: downloadError } = await supabase.storage
      .from(bucket)
      .download(storagePath);

    if (!downloadError && blob) {
      return await new Promise<string>((resolve, reject) => {
        const fr = new FileReader();
        fr.onload = () => resolve(fr.result as string);
        fr.onerror = () => reject(fr.error);
        fr.readAsDataURL(blob);
      });
    }
  } catch (err) {
    console.warn("download fallback failed:", err);
  }

  // Best effort URL fallback so React Native Image can attempt loading
  const { data } = supabase.storage.from(bucket).getPublicUrl(storagePath);
  return data?.publicUrl || path;
};

export const uploadImage = async (
  localUri: string,
  supabase: SupabaseClient<Database>,
  mimeType?: string,
) => {
  const fileRes = await fetch(localUri);
  const arrayBuffer = await fileRes.arrayBuffer();

  const uriWithoutQuery = localUri.split(/[?#]/, 1)[0];
  const uriExt = uriWithoutQuery.split(".").pop()?.toLowerCase();
  const normalizedMimeType = mimeType?.toLowerCase();
  const fileExt =
    (normalizedMimeType && extByMime[normalizedMimeType]) ||
    (uriExt && mimeByExt[uriExt] ? uriExt : "jpeg");
  const path = `${Date.now()}.${fileExt}`;
  const contentType = normalizedMimeType ?? mimeByExt[fileExt] ?? "image/jpeg";

  const { error, data } = await supabase.storage
    .from("images")
    .upload(path, arrayBuffer, { contentType, upsert: false });

  if (error) {
    throw error;
  } else {
    return data.path;
  }
};
