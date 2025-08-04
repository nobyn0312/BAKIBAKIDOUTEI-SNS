"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Image, X } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { uploadImage } from "@/lib/storage";

export default function PostForm() {
	const [content, setContent] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [selectedImage, setSelectedImage] = useState<File | null>(null);
	const [imagePreview, setImagePreview] = useState<string | null>(null);
	const fileInputRef = useRef<HTMLInputElement>(null);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!content.trim() && !selectedImage) return;

		setIsSubmitting(true);

		try {
			// まず、既存のユーザーを取得（最初のユーザーを使用）
			const { data: users, error: userError } = await supabase
				.from("users")
				.select("id")
				.limit(1);

			let userId: string;

			if (userError || !users || users.length === 0) {
				// ユーザーが存在しない場合は、匿名ユーザーを作成
				const { data: newUser, error: createError } = await supabase
					.from("users")
					.insert([
						{
							username: "anonymous",
							bio: "匿名ユーザー",
							avatar_url: "https://via.placeholder.com/150", // デフォルトのアバター画像
						},
					])
					.select()
					.single();

				if (createError) {
					console.error("Error creating user:", createError);
					alert("ユーザーの作成に失敗しました");
					return;
				}
				userId = newUser.id;
			} else {
				userId = users[0].id;
			}

			// 画像をアップロード
			let imageUrl: string | null = null;
			if (selectedImage) {
				imageUrl = await uploadImage(selectedImage);
				if (!imageUrl) {
					alert("画像のアップロードに失敗しました");
					return;
				}
			}

			// Supabaseに投稿を保存
			const { data, error } = await supabase
				.from("posts")
				.insert([
					{
						content: content.trim(),
						user_id: userId,
						image_url: imageUrl,
					},
				])
				.select();

			if (error) {
				console.error("Error creating post:", error);
				alert("投稿の作成に失敗しました");
			} else {
				setContent("");
				setSelectedImage(null);
				setImagePreview(null);
				// 投稿成功メッセージ
				alert("投稿が完了しました！");
				// 投稿リストを更新
				if ((window as any).refreshPosts) {
					(window as any).refreshPosts();
				} else {
					// フォールバック: ページをリロード
					window.location.reload();
				}
			}
		} catch (error) {
			console.error("Error:", error);
			alert("投稿の作成に失敗しました");
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			// ファイルサイズチェック（5MB以下）
			if (file.size > 5 * 1024 * 1024) {
				alert("画像サイズは5MB以下にしてください");
				return;
			}

			// ファイルタイプチェック
			if (!file.type.startsWith("image/")) {
				alert("画像ファイルを選択してください");
				return;
			}

			setSelectedImage(file);

			// プレビュー表示
			const reader = new FileReader();
			reader.onload = (e) => {
				setImagePreview(e.target?.result as string);
			};
			reader.readAsDataURL(file);
		}
	};

	const removeImage = () => {
		setSelectedImage(null);
		setImagePreview(null);
		if (fileInputRef.current) {
			fileInputRef.current.value = "";
		}
	};

	return (
		<div className='bg-white rounded-lg shadow p-6'>
			<div className='flex items-start space-x-3'>
				<Avatar className='h-10 w-10'>
					<AvatarFallback>
						<User className='h-5 w-5' />
					</AvatarFallback>
				</Avatar>

				<form onSubmit={handleSubmit} className='flex-1'>
					<textarea
						value={content}
						onChange={(e) => setContent(e.target.value)}
						placeholder='今なにしてる？'
						className='w-full p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500  focus:border-transparent'
						rows={3}
						maxLength={500}
					/>

					{/* 画像プレビュー */}
					{imagePreview && (
						<div className='relative mt-3'>
							<img
								src={imagePreview}
								alt='プレビュー'
								className='max-w-full h-48 object-cover rounded-lg'
							/>
							<button
								type='button'
								onClick={removeImage}
								className='absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600'
							>
								<X className='h-4 w-4' />
							</button>
						</div>
					)}

					<div className='flex justify-between items-center mt-3'>
						<div className='flex items-center space-x-2'>
							<input
								ref={fileInputRef}
								type='file'
								accept='image/*'
								onChange={handleImageSelect}
								className='hidden'
							/>
							<Button
								type='button'
								onClick={() => fileInputRef.current?.click()}
								variant='outline'
								size='sm'
								className='flex items-center space-x-1'
							>
								<Image className='h-4 w-4' />
								<span>画像</span>
							</Button>
							<span className='text-sm text-gray-500'>
								{content.length}/500
							</span>
						</div>
						<Button
							type='submit'
							disabled={(!content.trim() && !selectedImage) || isSubmitting}
							className='bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white'
						>
							{isSubmitting ? "投稿中..." : "投稿"}
						</Button>
					</div>
				</form>
			</div>
		</div>
	);
}
