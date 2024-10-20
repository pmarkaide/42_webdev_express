"use client";

import React, {useEffect} from 'react'
// import Image from "next/image";
import { signIn, useSession } from "next-auth/react";

export function GoogleSignInBtn()
{
	const { data: session, status } = useSession();

  const handleClick = () => {
    signIn("google");
	};

	useEffect(() => {
    if (status === "authenticated" && session) {
      console.log("User data:", session.user);
			console.log("JWT Token:", session.accessToken);

			if (session.accessToken) {
				localStorage.setItem('token', session.accessToken);
			}
		}

	}, [session, status])


  return (
    <button
      onClick={handleClick}
      className="w-full flex items-center font-semibold justify-center h-14 px-6 mt-4 text-xl  transition-colors duration-300 bg-white border-2 border-black text-black rounded-lg focus:shadow-outline hover:bg-slate-200"
    >
      {/* <Image src={googleLogo} alt="Google Logo" width={20} height={20} /> */}
      <span className="ml-4">Continue with Google</span>
    </button>
  );
}
