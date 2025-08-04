"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";

export default function UserRegistration() {
	const [username, setUsername] = useState("");
	const [bio, setBio] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isRegistered, setIsRegistered] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!username.trim()) {
			alert("ユーザー名を入力してください");
			return;
		}

		setIsSubmitting(true);

		try {
			const { data, error } = await supabase
				.from("users")
				.insert([
					{
						username: username.trim(),
						bio: bio.trim() || null,
						avatar_url: "https://via.placeholder.com/150", // デフォルトのアバター画像
					},
				])
				.select()
				.single();

			if (error) {
				console.error("Error creating user:", error);
				if (error.code === "23505") {
					alert("このユーザー名は既に使用されています");
				} else {
					alert("ユーザーの作成に失敗しました");
				}
			} else {
				alert(`ユーザー「${username}」が作成されました！`);
				setIsRegistered(true);
				setUsername("");
				setBio("");
			}
		} catch (error) {
			console.error("Error:", error);
			alert("ユーザーの作成に失敗しました");
		} finally {
			setIsSubmitting(false);
		}
	};

	if (isRegistered) {
		return (
			<div className='bg-green-50 border border-green-200 rounded-lg p-4 mb-6'>
				<p className='text-green-800 text-center'>
					ユーザー登録が完了しました！投稿を開始できます。
				</p>
			</div>
		);
	}

	return (
		<div className='bg-white rounded-lg shadow p-6 mb-6'>
			<h3 className='text-lg font-semibold text-gray-900 mb-4'>ユーザー登録</h3>
			<form onSubmit={handleSubmit} className='space-y-4'>
				<div>
					<label
						htmlFor='username'
						className='block text-sm font-medium text-gray-700 mb-1'
					>
						ユーザー名 *
					</label>
					<input
						type='text'
						id='username'
						value={username}
						onChange={(e) => setUsername(e.target.value)}
						className='w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
						placeholder='ユーザー名を入力'
						maxLength={20}
						required
					/>
				</div>

				<div>
					<label
						htmlFor='bio'
						className='block text-sm font-medium text-gray-700 mb-1'
					>
						自己紹介
					</label>
					<textarea
						id='bio'
						value={bio}
						onChange={(e) => setBio(e.target.value)}
						className='w-full p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white'
						placeholder='自己紹介を入力（任意）'
						rows={3}
						maxLength={200}
					/>
				</div>

				<Button
					type='submit'
					disabled={!username.trim() || isSubmitting}
					className='w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50'
				>
					{isSubmitting ? "登録中..." : "ユーザー登録"}
				</Button>
			</form>
		</div>
	);
}
