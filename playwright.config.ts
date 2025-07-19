/**
 * Playwright E2Eテストの設定ファイル
 * ポモドーロタイマーアプリのエンドツーエンドテスト設定
 * クロスブラウザテスト、CI/CD統合、トレーシング機能を含む
 */
import { defineConfig, devices } from '@playwright/test'

/**
 * Playwrightテストのメイン設定
 */
export default defineConfig({
  // テストファイルの格納ディレクトリ
  testDir: './src/tests/e2e',
  // テストの并列実行を有効化（パフォーマンス向上）
  fullyParallel: true,
  // CI環境での.only()使用を禁止（一部テストのみ実行を防止）
  forbidOnly: !!process.env.CI,
  // テスト失敗時のリトライ回数（CI: 2回、ローカル: 0回）
  retries: process.env.CI ? 2 : 0,
  // 並列ワーカー数（CI: 1、ローカル: 自動）
  workers: process.env.CI ? 1 : undefined,
  // テストレポートの形式（HTMLレポートを生成）
  reporter: 'html',
  /**
   * 全テスト共通の設定
   */
  use: {
    // テスト対象アプリのベースURL
    baseURL: 'http://localhost:3000',
    // 初回リトライ時にトレーシングを有効化（デバッグ用）
    trace: 'on-first-retry',
  },
  /**
   * テストプロジェクト設定（クロスブラウザテスト）
   */
  projects: [
    {
      name: 'chromium',                        // Chrome/Chromiumブラウザ
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',                         // Firefoxブラウザ
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',                          // Safari/WebKitブラウザ
      use: { ...devices['Desktop Safari'] },
    },
  ],
  /**
   * テスト用ウェブサーバー設定
   * テスト実行前に自動で開発サーバーを起動
   */
  webServer: {
    // サーバー起動コマンド（Nuxt開発サーバー）
    command: 'npm run dev',
    // サーバーのURL（ヘルスチェック用）
    url: 'http://localhost:3000',
    // ローカルでは既存サーバーを再利用、CIでは新規起動
    reuseExistingServer: !process.env.CI,
  },
})