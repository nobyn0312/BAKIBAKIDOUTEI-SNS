"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function AuthCallback() {
	const router = useRouter();

	useEffect(() => {
		const handleAuthCallback = async () => {
			const {
				data: { session },
				error,
			} = await supabase.auth.getSession();

			if (error) {
				console.error("Auth error:", error);
				router.push("/login");
				return;
			}

			if (session) {
				router.push("/");
			} else {
				router.push("/login");
			}
		};

		handleAuthCallback();
	}, [router]);

	return (
		<div className='flex items-center justify-center min-h-screen'>
			<div className='text-center'>
				<div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto'></div>
				<p className='mt-4 text-gray-600'>認証中...</p>
			</div>
		</div>
	);
}
