import React from "react";
import { motion } from "framer-motion";
import { Button } from "@material-tailwind/react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import GoogleIcon from "@mui/icons-material/Google";
import SportsEsportsIcon from "@mui/icons-material/SportsEsports";
import { FcGoogle } from "react-icons/fc";
import { BsDiscord,BsGithub } from "react-icons/bs";

export default function login() {
  const supabase = useSupabaseClient();

  function template({ rotate, x }: { rotate: number; x: number }) {
    return `rotate(${rotate}) transiton(${x})`;
  }

  return (
    <div className="w-full h-[768px] bg-slate-800 flex  ">
      <div className="w-[40%] h-[100%] bg-white">
        <img
          className="w-full h-full object-cover"
          src="https://i.pinimg.com/originals/f1/6f/ed/f16fedc86686146624897737cf4338d8.jpg"
          alt=""
        />
      </div>

      <div className="w-[60%] flex items-center gap-4 flex-col justify-center">
        <Button
          className="flex items-center justify-center gap-3 w-[20rem] h-10 rounded-sm bg-purple-500 font-semibold"
          onClick={() => supabase.auth.signInWithOAuth({ provider: "discord" })}
        >
          <BsDiscord className="w-5 h-5" />
          Login with Discord
        </Button>
        <Button
          className="flex items-center justify-center gap-3 w-[20rem] h-10 rounded-sm bg-red-500 font-semibold"
          onClick={() => supabase.auth.signInWithOAuth({ provider: "google" })}
        >
          <FcGoogle className="w-5 h-5" />
          Login with Google
        </Button>
        <Button
          className="flex items-center justify-center gap-3 w-[20rem] h-10 rounded-sm bg-white text-black font-semibold"
          onClick={() => supabase.auth.signInWithOAuth({ provider: "github" })}
        >
          <BsGithub className="w-5 h-5" />
          Login with Github
        </Button>
      </div>
    </div>
  );
}
