-- usersテーブルのRLSポリシー

-- 1. 誰でもユーザーを作成できるポリシー
CREATE POLICY "Enable insert for all users" ON users
FOR INSERT WITH CHECK (true);

-- 2. 誰でもユーザーを読み取れるポリシー
CREATE POLICY "Enable read access for all users" ON users
FOR SELECT USING (true);

-- 3. ユーザーは自分のプロフィールを更新できるポリシー
CREATE POLICY "Enable update for users based on id" ON users
FOR UPDATE USING (auth.uid() = id);

-- postsテーブルのRLSポリシー

-- 1. 誰でも投稿を作成できるポリシー
CREATE POLICY "Enable insert for all users" ON posts
FOR INSERT WITH CHECK (true);

-- 2. 誰でも投稿を読み取れるポリシー
CREATE POLICY "Enable read access for all users" ON posts
FOR SELECT USING (true);

-- 3. 誰でも投稿を削除できるポリシー（開発用）
CREATE POLICY "Enable delete for all users" ON posts
FOR DELETE USING (true);

-- 4. 誰でも投稿を更新できるポリシー（開発用）
CREATE POLICY "Enable update for all users" ON posts
FOR UPDATE USING (true);