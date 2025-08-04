# Virgin SNS

Next.js と Supabase を使用したモダンな SNS アプリケーションです。

## 機能

- 🔐 ユーザー認証（Supabase Auth）
- 📝 投稿の作成・表示・削除
- ❤️ いいね機能
- 💬 コメント機能（準備中）
- 👤 ユーザープロフィール
- 📱 レスポンシブデザイン

## 技術スタック

- **フロントエンド**: Next.js 15, React 19, TypeScript
- **スタイリング**: Tailwind CSS
- **バックエンド**: Supabase (PostgreSQL, Auth, Real-time)
- **UI コンポーネント**: Radix UI, Lucide React
- **日付処理**: date-fns

## セットアップ

### 1. 依存関係のインストール

```bash
npm install
```

### 2. Supabase プロジェクトの作成

1. [Supabase](https://supabase.com) にアクセスしてアカウントを作成
2. 新しいプロジェクトを作成
3. プロジェクトの設定から以下を取得：
   - Project URL
   - Anon public key

### 3. 環境変数の設定

プロジェクトルートに `.env.local` ファイルを作成：

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

### 4. データベーススキーマの設定

Supabase の SQL Editor で `supabase/schema.sql` の内容を実行してください。

### 5. 開発サーバーの起動

```bash
npm run dev
```

[http://localhost:3000](http://localhost:3000) でアプリケーションにアクセスできます。

## プロジェクト構造

```
virgin-sns/
├── app/                    # Next.js App Router
│   ├── auth/              # 認証関連ページ
│   ├── login/             # ログインページ
│   └── page.tsx           # メインページ
├── components/            # React コンポーネント
│   ├── auth/              # 認証コンポーネント
│   ├── layout/            # レイアウトコンポーネント
│   ├── posts/             # 投稿関連コンポーネント
│   └── ui/                # UI コンポーネント
├── contexts/              # React Context
├── lib/                   # ユーティリティ関数
├── supabase/              # Supabase 設定
└── public/                # 静的ファイル
```

## 主な機能の実装

### 認証システム

- Supabase Auth を使用したユーザー認証
- Google、GitHub でのソーシャルログイン
- 認証状態の管理（UserContext）

### 投稿機能

- テキスト投稿の作成
- 投稿の一覧表示
- 投稿の削除（自分の投稿のみ）
- リアルタイム更新

### いいね機能

- 投稿へのいいね
- いいね数の表示
- いいねの取り消し

## 今後の拡張予定

- [ ] コメント機能
- [ ] 画像投稿
- [ ] フォロー機能
- [ ] 通知システム
- [ ] 検索機能
- [ ] ダークモード

## ライセンス

MIT License
