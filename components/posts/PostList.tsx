"use client";

import { useEffect, useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { User, Heart, MessageCircle, Trash2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ja } from "date-fns/locale";
import { supabase, Post } from "@/lib/supabase";

interface PostWithUser extends Post {
	users: {
		username: string;
		avatar_url: string | null;
	} | null;
}

export default function PostList() {
	const [posts, setPosts] = useState<PostWithUser[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		fetchPosts();
	}, []);

	// 投稿リストを更新する関数をグローバルに公開
	useEffect(() => {
		if (typeof window !== 'undefined') {
			(window as { refreshPosts?: () => void }).refreshPosts = fetchPosts;
		}
		return () => {
			if (typeof window !== 'undefined') {
				delete (window as { refreshPosts?: () => void }).refreshPosts;
			}
		};
	}, []);

	const fetchPosts = async () => {
		try {
			console.log("Fetching posts...");

			// まず投稿を取得
			const { data: postsData, error: postsError } = await supabase
				.from("posts")
				.select("*")
				.order("created_at", { ascending: false });

			console.log("Posts fetch result:", { postsData, postsError });

			if (postsError) {
				console.error("Error fetching posts:", postsError);
				return;
			}

			// 投稿データがない場合は空配列を設定
			if (!postsData || postsData.length === 0) {
				setPosts([]);
				return;
			}

			// ユーザーIDのリストを作成
			const userIds = [...new Set(postsData.map((post) => post.user_id))];
			console.log("User IDs to fetch:", userIds);

			// ユーザー情報を取得
			const { data: usersData, error: usersError } = await supabase
				.from("users")
				.select("id, username, avatar_url")
				.in("id", userIds);

			console.log("Users fetch result:", { usersData, usersError });

			if (usersError) {
				console.error("Error fetching users:", usersError);
				// ユーザー情報が取得できなくても投稿は表示
				const postsWithUsers = postsData.map((post) => ({
					...post,
					users: null,
				}));
				setPosts(postsWithUsers);
				return;
			}

			// ユーザー情報をマップに変換
			const usersMap = new Map();
			if (usersData) {
				usersData.forEach((user) => {
					usersMap.set(user.id, user);
				});
			}

			// 投稿とユーザー情報を結合
			const postsWithUsers = postsData.map((post) => ({
				...post,
				users: usersMap.get(post.user_id) || null,
			}));

			console.log("Combined posts:", postsWithUsers);
			setPosts(postsWithUsers);
		} catch (error) {
			console.error("Error:", error);
		} finally {
			setLoading(false);
		}
	};

	const handleDelete = async (postId: number) => {
		if (!confirm("この投稿を削除しますか？")) return;

		try {
			const { error } = await supabase.from("posts").delete().eq("id", postId);

			if (error) {
				console.error("Error deleting post:", error);
				alert("投稿の削除に失敗しました");
			} else {
				setPosts(posts.filter((post) => post.id !== postId));
			}
		} catch (error) {
			console.error("Error:", error);
			alert("投稿の削除に失敗しました");
		}
	};

	if (loading) {
		return (
			<div className='flex items-center justify-center py-8'>
				<div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600'></div>
			</div>
		);
	}

	if (posts.length === 0) {
		return (
			<div className='text-center py-8'>
				<p className='text-gray-500'>まだ投稿がありません</p>
			</div>
		);
	}

	return (
		<div className='space-y-4'>
			{posts.map((post) => (
				<div key={post.id} className='bg-white rounded-lg shadow p-6'>
					<div className='flex items-start space-x-3'>
						<Avatar className='h-10 w-10'>
							<AvatarFallback>
								<User className='h-5 w-5' />
							</AvatarFallback>
						</Avatar>

						<div className='flex-1'>
							<div className='flex items-center space-x-2 mb-2'>
								<span className='font-semibold text-gray-900'>
									{post.users?.username || "匿名ユーザー"}
								</span>
								<span className='text-sm text-gray-500'>
									{formatDistanceToNow(new Date(post.created_at), {
										addSuffix: true,
										locale: ja,
									})}
								</span>
							</div>

							<p className='text-gray-800 mb-4 whitespace-pre-wrap'>
								{post.content}
							</p>

							{/* 画像表示 */}
							{post.image_url && (
								<div className='mb-4'>
									<img
										src={post.image_url}
										alt='投稿画像'
										className='max-w-full h-64 object-cover rounded-lg'
									/>
								</div>
							)}

							<div className='flex items-center space-x-4'>
								<Button
									variant='ghost'
									size='sm'
									className='flex items-center space-x-1 text-gray-500 hover:text-red-500'
								>
									<Heart className='h-4 w-4' />
									<span>0</span>
								</Button>

								<Button
									variant='ghost'
									size='sm'
									className='flex items-center space-x-1 text-gray-500 hover:text-blue-500'
								>
									<MessageCircle className='h-4 w-4' />
									<span>0</span>
								</Button>

								{/* すべての投稿に削除ボタンを表示 */}
								<Button
									variant='ghost'
									size='sm'
									onClick={() => handleDelete(post.id)}
									className='flex items-center space-x-1 text-gray-500 hover:text-red-500'
								>
									<Trash2 className='h-4 w-4' />
								</Button>
							</div>
						</div>
					</div>
				</div>
			))}
		</div>
	);
}
