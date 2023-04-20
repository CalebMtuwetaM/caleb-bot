import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function Logout() {
  const router = useRouter();
  const supabaseClient = useSupabaseClient();
  useEffect(() => {
    supabaseClient.auth.signOut().then(() => {
      router.push("/");
    });
  }, [router, supabaseClient]);

  return <div></div>;
}