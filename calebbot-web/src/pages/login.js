import Navbar from "@/components/navbar";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";

export default function Login() {
  const supabaseClient = useSupabaseClient();

  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");

  const router = useRouter();

  async function sendCode() {
    const { data, error } = await supabaseClient.auth.signInWithOtp({
      email: email,
    });
    if (data) {
      toast.success("Verification code sent to email");
      console.log("Verification code sent to email", data);
    }
    if (error) {
      toast.error("Failed to send verification code.");
      console.error("Failed to send verification code.", error);
    }
  }

  async function submitCode() {
    const { data, error } = await supabaseClient.auth.verifyOtp({
      email,
      token: code,
      type: "magiclink",
    });
    if (data) {
      toast.success("Logged in");
      console.log("Logged in successfully", data);
      router.push("/");
    }
    if (error) {
      console.error("Login failed", error);

      const { data: d2, error: e2 } = await supabaseClient.auth.verifyOtp({
        email,
        token: code,
        type: "signup",
      });

      if (d2) {
        toast.success("Signed up");
        console.log("Signed up successfully", data);
      } else {
        toast.error("Failed to log in / sign up");
        console.error("Failed to log in / sign up", e2);
      }
    }
  }

  return (
    <>
      <Head>
        <title>Calebot - Your friendly neighborhood AI</title>
      </Head>
      <Toaster />
      <div className="flex flex-col h-screen">
        <Navbar />

        <div className="mx-auto max-w-md">
          <div className="border self-center rounded-lg my-8 p-4 m-4">
            <div className="text-center text-xl font-bold text-gray-800">
              Sign In - Calebot
            </div>

            <div className=" flex flex-col my-4">
              <label className="font-medium text-gray-600">Email</label>
              <input
                type="email"
                className="border p-2 rounded-md mt-1"
                placeholder="john@doe.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button
                className="w-40 border text-sm font-medium px-4 py-2 mt-2 rounded-md bg-gray-50 hover:bg-gray-100"
                onClick={sendCode}
              >
                Send Code
              </button>
            </div>

            <div className=" flex flex-col my-4">
              <label className="font-medium text-gray-600">
                Verification Code
              </label>
              <input
                type="password"
                className="border p-2 rounded-md mt-1"
                placeholder="123456"
                onChange={(e) => setCode(e.target.value)}
                value={code}
              />
              <button
                onClick={submitCode}
                className="w-40 border border-blue-600 text-sm font-medium px-4 py-2 mt-2 rounded-md bg-blue-500 hover:bg-blue-600 text-white"
              >
                Sign In
              </button>
            </div>

            <p className="text-gray-600 text-sm prose">
              {"By signing in, you agree to our "}
              <Link href="/terms">terms of use</Link>
              {" and "}
              <Link href="/privacy">privacy policy</Link>.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
