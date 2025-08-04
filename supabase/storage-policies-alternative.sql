-- 別の名前でポリシーを作成

-- 1. 画像アップロード用ポリシー
CREATE POLICY "post_images_upload_policy" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'post-images');

-- 2. 画像読み取り用ポリシー
CREATE POLICY "post_images_read_policy" ON storage.objects
FOR SELECT USING (bucket_id = 'post-images');

-- 3. 画像削除用ポリシー
CREATE POLICY "post_images_delete_policy" ON storage.objects
FOR DELETE USING (bucket_id = 'post-images');

-- 4. 画像更新用ポリシー
CREATE POLICY "post_images_update_policy" ON storage.objects
FOR UPDATE USING (bucket_id = 'post-images');