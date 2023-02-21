import { useSupabaseClient } from "@supabase/auth-helpers-react";
import React, { useEffect, useState } from "react";
import { Database } from "../utils/database.types";

type Profiles = Database["public"]["Tables"]["profiles"]["Row"];

export default function Avatar({
  uid,
  url,
  size,
  onUpload,
}: {
  uid: string;
  url: Profiles["avatarUrl"];
  size: number;
  onUpload: (url: string) => void;
}) {
  const supabase = useSupabaseClient();
  const [avatarUrl, setAvatarUrl] = useState<Profiles["avatarUrl"]>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (url) {
      downloadImage(url);
    }
  }, [url]);

  async function downloadImage(path: string) {
    try {
      const { data, error } = await supabase.storage
        .from("avatars")
        .download(path);
      console.log(data);
      if (error) {
        throw error;
      }
      const url = URL.createObjectURL(data);

      setAvatarUrl(url);

      console.log("url:" + url);
    } catch (error) {
      console.log("Error loading image");
      console.log(error);
    }
  }

  console.log(avatarUrl);

  const uploadAvatar: React.ChangeEventHandler<HTMLInputElement> = async (
    event
  ) => {
    try {
      setUploading(true);
      if (!event.target.files || event.target.files.length === 0) {
        setError("You must select image to upload !");
        throw new Error("You must select image to upload !");
      } else {
        setError("");
      }
      const file = event.target.files[0];
      // const fileExt = file.name.split(".").pop();
      const fileName = file.name;
      const filePath = `${fileName}`;

      let { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file, { upsert: true });

      if (uploadError) {
        console.log(uploadError);
      }

      onUpload(filePath);
    } catch (error) {
      console.log(error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      {!avatarUrl ? (
        <div>
          <img
            src={avatarUrl || ""}
            alt="Avatar"
            className="w-20 rounded-full"
          />
          <input type="file" onChange={uploadAvatar} />
          <p>{error}</p>
        </div>
      ) : (
        <img src={avatarUrl || ""} alt="Avatar" className="w-20 rounded-full" />
      )}
    </div>
  );
}
