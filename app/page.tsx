"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import PostForm from "@/components/posts/PostForm";
import PostList from "@/components/posts/PostList";
import UserRegistration from "@/components/auth/UserRegistration";
import { supabase } from "@/lib/supabase";

export default function Home() {
	const [hasUsers, setHasUsers] = useState<boolean | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		checkUsers();
	}, []);

	const checkUsers = async () => {
		try {
			const { data, error } = await supabase
				.from("users")
				.select("id")
				.limit(1);

			if (error) {
				console.error("Error checking users:", error);
				setHasUsers(false);
			} else {
				setHasUsers(data && data.length > 0);
			}
		} catch (error) {
			console.error("Error:", error);
			setHasUsers(false);
		} finally {
			setLoading(false);
		}
	};

	if (loading) {
		return (
			<div className='min-h-screen bg-gray-50 flex items-center justify-center'>
				<div className='text-center'>
					<div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto'></div>
					<p className='mt-4 text-gray-600'>読み込み中...</p>
				</div>
			</div>
		);
	}

	return (
		<div className='min-h-screen bg-gray-50'>
			{/* ヘッダー */}
			<header className='bg-white shadow-sm border-b px-4 py-3'>
				<h1 className='text-xl font-bold text-gray-900 text-center'>
					BAKIDOU-SNS
				</h1>
			</header>

			{/* メインコンテンツ */}
			<div className='max-w-4xl mx-auto px-4 py-8 pb-24'>
				{/* Supabase接続テスト */}
				{/* <SupabaseTest /> */}

				{/* ユーザーが存在しない場合は登録フォームを表示 */}
				{!hasUsers && <UserRegistration />}

				{/* 投稿フォームとリスト */}
				<PostForm />
				<div className='mt-8'>
					<PostList />
				</div>
			</div>

			{/* 下部ナビゲーションバー */}
			<Navbar />
		</div>
	);
}
