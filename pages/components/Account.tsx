import {
  Session,
  useSupabaseClient,
  useUser,
} from "@supabase/auth-helpers-react";
import React, { useEffect, useState } from "react";
import { Database } from "../utils/database.types";
import UploadAvatar from "./UploadAvatar";
import { ArrowLeftOnRectangleIcon } from "@heroicons/react/24/solid";
import { Input } from "@material-tailwind/react";
import Avatar from "./shared/Avatar";

type Profiles = Database["public"]["Tables"]["profiles"]["Row"];

export default function Account({ session }: { session: Session }) {
  const supabase = useSupabaseClient();
  const user = useUser();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [name, setName] = useState<Profiles["username"]>(null!);
  const [website, setWebsite] = useState<Profiles["website"]>(null!);
  const [avatarUrl, setAvatarUrl] = useState<Profiles["avatarUrl"]>(null!);

  useEffect(() => {
    getProfile();
  }, [session]);

  console.log(user?.user_metadata?.picture);

  async function getProfile() {
    try {
      setIsLoading(true);
      if (!user) {
        setError("Cannot find user!");
        throw new Error("Cannot find user!");
      }
      let { data, error, status } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      console.log(data);

      if (data) {
        setName(data.username);
        setWebsite(data.website);
        setAvatarUrl(data.avatarUrl);
      }
    } catch (err) {
      setError("");
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  }

  async function updateProfile({
    name,
    website,
    avatarUrl,
  }: {
    name: Profiles["username"];
    website: Profiles["website"];
    avatarUrl: Profiles["avatarUrl"];
  }) {
    try {
      setIsLoading(true);
      if (!user) {
        console.log("Can not find user!");
      }
      const updates = {
        id: user?.id,
        username: name,
        full_name: "",
        website,
        avatar_url: avatarUrl,
        updated_at: new Date().toISOString(),
      };

      let { error } = await supabase.from("profiles").upsert(updates);

      console.log("Updated Success");

      if (error) throw error;
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex justify-center flex-col items-center gap-2">
      <Avatar src={user?.user_metadata?.avatar_url || ""} />
      <div className="w-72 flex justify-center items-center ">
        <span>Email: </span> <Input name="Email" disabled value={user?.email} />
      </div>
      <div className="w-72 flex justify-center items-center">
        <span>UserName: </span>
        <Input value={name || ""} onChange={(e) => setName(e.target.value)} />
      </div>
      <div className="w-72 flex justify-center items-center">
        <span>Website: </span>
        <Input
          value={website || ""}
          onChange={(e) => setWebsite(e.target.value)}
        />
      </div>
      <div>
        <button
          className="bg-green-500 w-20 h-10 rounded-md text-white"
          onClick={() => updateProfile({ name, website, avatarUrl })}
        >
          Update
        </button>
      </div>

      <div>
        <button
          title="Sign Out"
          className="w-28 h-10 rounded-md text-white bg-red-500 flex items-center justify-center"
          onClick={() => supabase.auth.signOut()}
        >
          <span>Sign Out</span>
          <ArrowLeftOnRectangleIcon className="h-6 w-6" />
        </button>

        <button></button>

        <button
          className="w-20 h-10 rounded-md text-white bg-green-500"
          onClick={() => supabase.auth.signInWithOAuth({ provider: "google" })}
        >
          Sign In
        </button>
      </div>
      <UploadAvatar
        uid={user?.id as string}
        url={avatarUrl}
        size={150}
        onUpload={(url) => {
          setAvatarUrl(url);
          updateProfile({ name, website, avatarUrl: url });
        }}
      ></UploadAvatar>
    </div>
  );
}
