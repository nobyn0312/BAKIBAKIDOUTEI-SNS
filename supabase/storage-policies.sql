-- Supabase StorageのRLSポリシー

-- post-imagesバケットのポリシー

-- 1. 誰でも画像をアップロードできるポリシー
CREATE POLICY "Allow public uploads" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'post-images');

-- 2. 誰でも画像を読み取れるポリシー
CREATE POLICY "Allow public reads" ON storage.objects
FOR SELECT USING (bucket_id = 'post-images');

-- 3. 誰でも画像を削除できるポリシー
CREATE POLICY "Allow public deletes" ON storage.objects
FOR DELETE USING (bucket_id = 'post-images');

-- 4. 誰でも画像を更新できるポリシー
CREATE POLICY "Allow public updates" ON storage.objects
FOR UPDATE USING (bucket_id = 'post-images');