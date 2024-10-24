"use client";

import React, {useEffect} from 'react'
import Image from "next/image";
import { signIn, useSession } from "next-auth/react";
import google_logo from "../assests/google_logo.png"

export function GoogleSignInBtn()
{
	const { data: session, status } = useSession();

  // const handleClick = () => {
  //   signIn("google");
	// };

	const handleClick = async () => {
    try {
      const response = await signIn('google', { redirect: false });
      if (response?.error) {
        throw new Error(response.error);
			}

			if (status === "authenticated" && session) {
				const userInfo = {
					email: session.user?.email,
					username: session.user?.name,
					// image: session.user?.name
				};

				const res = await fetch(`${process.env.NEXT_PUBLIC_MY_BACKEND_API_URL}/api/register`, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify(userInfo),
				});


			}

      // Send user info to your backend to create the user

    //   const data = await res.json();

    //   // If the user is created successfully
    //   if (res.ok) {
    //     // Handle successful login (e.g., store token, update user state, etc.)
    //     // localStorage.setItem('token', data.token);
    //     // setUser(data.user);
    //   } else {
    //     throw new Error('User creation failed');
    //   }

    //   toast.success('Google sign-in successful!', {
    //     position: 'top-center',
    //     autoClose: 2000,
    //   });
    } catch (error) {
      console.error(error);
      // toast.error('Google sign-in failed.', {
      //   position: 'bottom-center',
      //   autoClose: 3000,
      // });
    }
  };

	useEffect(() => {
    if (status === "authenticated" && session) {
      console.log("User data:", session.user);
			console.log("JWT Token:", session.accessToken);


			console.log(session)

			if (session.accessToken) {
				localStorage.setItem('token', session.accessToken);
				if (session.user) {
					localStorage.setItem('user', JSON.stringify(session.user));
				}
			}
		}

	}, [session, status])


  return (
    <button
      onClick={handleClick}
      className="w-full flex items-center font-semibold justify-center h-14 px-6 mt-4 text-xl transition-colors duration-300 bg-white border-2 border-ring-blue-500 text-black rounded-lg focus:shadow-outline hover:bg-slate-200 mb-2"
    >
      <Image src={google_logo} alt="Google Logo" width={20} height={20} />
      <span className="ml-4">Continue with Google</span>
    </button>
  );
}



