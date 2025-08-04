import { supabase } from "./supabase";

export const uploadImage = async (file: File): Promise<string | null> => {
	try {
		// ファイル名をユニークにする（タイムスタンプ + ランダム文字列）
		const fileExt = file.name.split(".").pop();
		const fileName = `${Date.now()}-${Math.random()
			.toString(36)
			.substring(2)}.${fileExt}`;

		// Supabase Storageにアップロード
		const { data, error } = await supabase.storage
			.from("post-images")
			.upload(fileName, file);

		if (error) {
			console.error("Error uploading image:", error);
			return null;
		}

		// 公開URLを取得
		const {
			data: { publicUrl },
		} = supabase.storage.from("post-images").getPublicUrl(fileName);

		return publicUrl;
	} catch (error) {
		console.error("Error uploading image:", error);
		return null;
	}
};

export const deleteImage = async (imageUrl: string): Promise<boolean> => {
	try {
		// URLからファイル名を抽出
		const fileName = imageUrl.split("/").pop();
		if (!fileName) return false;

		const { error } = await supabase.storage
			.from("post-images")
			.remove([fileName]);

		if (error) {
			console.error("Error deleting image:", error);
			return false;
		}

		return true;
	} catch (error) {
		console.error("Error deleting image:", error);
		return false;
	}
};
