import {
  Session,
  useSupabaseClient,
  useUser,
} from "@supabase/auth-helpers-react";
import React, { useEffect, useState } from "react";
import { Database } from "../utils/database.types";

type Profiles = Database["public"]["Tables"]["profiles"]["Row"];

export default function Account({ session }: { session: Session }) {
  const supabase = useSupabaseClient();
  const user = useUser();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [name, setName] = useState<Profiles["username"]>(null);
  const [website, setWebsite] = useState<Profiles["website"]>(null);
  const [avatarUrl, setAvatarUrl] = useState<Profiles["avatarUrl"]>(null);


  useEffect(() => {
    getProfile();
  }, [session]);


  async function getProfile() {
    try {
      setLoading(true);
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
      setLoading(false);
    }
  }

  console.log(name)

  return (
    <div className="flex justify-center flex-col items-center gap-2">
      <div className="justify-between">
        <label htmlFor="email">Email:</label>
        <input className="" id="email" type="text" value={user?.email} disabled />
      </div>
      <div>
        <label htmlFor="username">Username: </label>
        <input
        //   id="username"
          type="text"
          value={name || "" }
          onChange={e=> setName(e.target.value)}
        />
      </div>
    </div>
  );
}
