import { ComponentProps, useEffect, useState } from "react";
import { ActivityIndicator, Image, View } from "react-native";
import { useSession } from "@clerk/clerk-expo";
import { resolveImageUri } from "../utils/supabaseImages";
import { useSupabase } from "../lib/supabase";

type SupabaseImageProps = {
  bucket: string;
  path: string;
} & ComponentProps<typeof Image>;

export default function SupabaseImage({
  path,
  bucket,
  style,
  ...imageProps
}: SupabaseImageProps) {
  const [imageUri, setImageUri] = useState<string>();
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const supabase = useSupabase();
  const { session } = useSession();

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setIsLoading(true);
      setHasError(false);
      setImageUri(undefined);

      if (!path || !bucket) {
        setIsLoading(false);
        return;
      }

      try {
        const uri = await resolveImageUri(path, bucket, supabase);
        if (!cancelled) {
          setImageUri(uri);
        }
      } catch (err) {
        console.warn("Failed to resolve Supabase image path:", path, err);
        if (!cancelled) {
          setHasError(true);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, [path, bucket, session?.id]);

  if (isLoading) {
    return (
      <View
        style={[
          {
            backgroundColor: "gainsboro",
            alignItems: "center",
            justifyContent: "center",
          },
          style,
        ]}
      >
        <ActivityIndicator />
      </View>
    );
  }

  if (hasError || !imageUri) {
    return (
      <View
        style={[
          {
            backgroundColor: "gainsboro",
            alignItems: "center",
            justifyContent: "center",
          },
          style,
        ]}
      />
    );
  }

  return (
    <Image
      source={{ uri: imageUri }}
      style={style}
      resizeMode="cover"
      onError={(e) => {
        console.warn("Failed to display image:", imageUri, e.nativeEvent?.error);
        setHasError(true);
      }}
      {...imageProps}
    />
  );
}
