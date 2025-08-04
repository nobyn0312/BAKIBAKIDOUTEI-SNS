"use client";

import { useState } from "react";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";

export default function AuthForm() {
	const [isCreatingTestAccount, setIsCreatingTestAccount] = useState(false);
	const [isLoggingInTest, setIsLoggingInTest] = useState(false);

	const createTestAccount = async () => {
		setIsCreatingTestAccount(true);

		try {
			const testEmail = `test${Date.now()}@example.com`;
			const testPassword = "testpassword123";

			const { data, error } = await supabase.auth.signUp({
				email: testEmail,
				password: testPassword,
				options: {
					data: {
						full_name: "テストユーザー",
						username: "testuser",
					},
				},
			});

			if (error) {
				console.error("Error creating test account:", error);
				alert("テストアカウントの作成に失敗しました");
			} else {
				alert(
					`テストアカウントが作成されました！\nメール: ${testEmail}\nパスワード: ${testPassword}`
				);
			}
		} catch (error) {
			console.error("Error:", error);
			alert("テストアカウントの作成に失敗しました");
		} finally {
			setIsCreatingTestAccount(false);
		}
	};

	const loginWithTestAccount = async () => {
		setIsLoggingInTest(true);

		try {
			// 既存のテストアカウントでログイン（存在しない場合は作成）
			const testEmail = "test@example.com";
			const testPassword = "testpassword123";

			const { data, error } = await supabase.auth.signInWithPassword({
				email: testEmail,
				password: testPassword,
			});

			if (error) {
				// アカウントが存在しない場合は作成
				if (error.message.includes("Invalid login credentials")) {
					const { data: signUpData, error: signUpError } =
						await supabase.auth.signUp({
							email: testEmail,
							password: testPassword,
							options: {
								data: {
									full_name: "テストユーザー",
									username: "testuser",
								},
							},
						});

					if (signUpError) {
						console.error("Error creating test account:", signUpError);
						alert("テストアカウントの作成に失敗しました");
					} else {
						alert("テストアカウントが作成され、ログインしました！");
					}
				} else {
					console.error("Error logging in:", error);
					alert("ログインに失敗しました");
				}
			} else {
				alert("テストアカウントでログインしました！");
			}
		} catch (error) {
			console.error("Error:", error);
			alert("ログインに失敗しました");
		} finally {
			setIsLoggingInTest(false);
		}
	};

	return (
		<div className='max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md'>
			<h2 className='text-2xl font-bold text-center mb-6'>Virgin SNS</h2>

			{/* テストアカウント作成ボタン */}
			<div className='mb-6 p-4 bg-gray-50 rounded-lg'>
				<h3 className='text-sm font-semibold text-gray-700 mb-2'>
					開発用テストアカウント
				</h3>
				<div className='space-y-2'>
					<Button
						onClick={loginWithTestAccount}
						disabled={isLoggingInTest}
						className='w-full bg-green-600 hover:bg-green-700'
					>
						{isLoggingInTest ? "ログイン中..." : "テストアカウントでログイン"}
					</Button>
					<Button
						onClick={createTestAccount}
						disabled={isCreatingTestAccount}
						variant='outline'
						className='w-full'
					>
						{isCreatingTestAccount
							? "作成中..."
							: "新しいテストアカウントを作成"}
					</Button>
				</div>
				<p className='text-xs text-gray-500 mt-2'>
					テスト用のダミーアカウントでログインまたは作成します
				</p>
			</div>

			<div className='relative'>
				<div className='absolute inset-0 flex items-center'>
					<span className='w-full border-t' />
				</div>
				<div className='relative flex justify-center text-xs uppercase'>
					<span className='bg-white px-2 text-gray-500'>または</span>
				</div>
			</div>

			<div className='mt-6'>
				<Auth
					supabaseClient={supabase}
					appearance={{ theme: ThemeSupa }}
					providers={["google", "github"]}
					redirectTo={`${window.location.origin}/auth/callback`}
				/>
			</div>
		</div>
	);
}
