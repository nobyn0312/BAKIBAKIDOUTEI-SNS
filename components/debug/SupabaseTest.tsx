"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";

export default function SupabaseTest() {
	const [testResult, setTestResult] = useState<string>("");
	const [loading, setLoading] = useState(false);

	const testConnection = async () => {
		setLoading(true);
		setTestResult("");

		try {
			// 1. 環境変数の確認
			const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
			const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

			let result = "=== Supabase接続テスト ===\n\n";

			if (!supabaseUrl || !supabaseKey) {
				result += "❌ 環境変数が設定されていません\n";
				result += `NEXT_PUBLIC_SUPABASE_URL: ${
					supabaseUrl ? "設定済み" : "未設定"
				}\n`;
				result += `NEXT_PUBLIC_SUPABASE_ANON_KEY: ${
					supabaseKey ? "設定済み" : "未設定"
				}\n`;
				setTestResult(result);
				return;
			}

			result += "✅ 環境変数は設定されています\n";
			result += `URL: ${supabaseUrl.substring(0, 30)}...\n`;
			result += `Key: ${supabaseKey.substring(0, 20)}...\n\n`;

			// 2. 基本的な接続テスト
			result += "=== 接続テスト ===\n";

			const { error } = await supabase
				.from("users")
				.select("count")
				.limit(1);

			if (error) {
				result += `❌ 接続エラー: ${error.message}\n`;
				result += `エラーコード: ${error.code}\n`;
			} else {
				result += "✅ Supabaseとの接続成功\n";
			}

			// 3. テーブル構造の確認
			result += "\n=== テーブル構造確認 ===\n";

			const { data: usersData, error: usersError } = await supabase
				.from("users")
				.select("*")
				.limit(1);

			if (usersError) {
				result += `❌ usersテーブルエラー: ${usersError.message}\n`;
			} else {
				result += "✅ usersテーブルにアクセス可能\n";
				if (usersData && usersData.length > 0) {
					result += `現在のユーザー数: ${usersData.length}\n`;
				} else {
					result += "ユーザー数: 0\n";
				}
			}

			// 4. postsテーブルの確認
			const { data: postsData, error: postsError } = await supabase
				.from("posts")
				.select("*")
				.limit(1);

			if (postsError) {
				result += `❌ postsテーブルエラー: ${postsError.message}\n`;
			} else {
				result += "✅ postsテーブルにアクセス可能\n";
				if (postsData && postsData.length > 0) {
					result += `現在の投稿数: ${postsData.length}\n`;
				} else {
					result += "投稿数: 0\n";
				}
			}

			setTestResult(result);
		} catch (error) {
			setTestResult(`❌ 予期しないエラー: ${error}`);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className='bg-white rounded-lg shadow p-6 mb-6'>
			<h3 className='text-lg font-semibold text-gray-900 mb-4'>
				Supabase接続テスト
			</h3>

			<Button
				onClick={testConnection}
				disabled={loading}
				className='mb-4 bg-blue-600 hover:bg-blue-700'
			>
				{loading ? "テスト中..." : "接続テスト実行"}
			</Button>

			{testResult && (
				<div className='bg-gray-100 p-4 rounded-lg'>
					<pre className='text-sm text-gray-800 whitespace-pre-wrap'>
						{testResult}
					</pre>
				</div>
			)}
		</div>
	);
}
