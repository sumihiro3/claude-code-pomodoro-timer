Create detailed implementation plan for GitHub issue.

Usage: Provide issue number (e.g., 123)

Process:
1. **Deep issue analysis**
   - Extract issue content: `gh issue view $1 --json title,body,labels,assignees,milestone,comments`
   - Parse user stories, acceptance criteria, and requirements
   - Identify issue category and priority from labels

2. **Codebase reconnaissance**
   - Intelligent file search based on issue keywords
   - Pattern: `git grep -rn "relevant-terms" --include="*.{js,ts,py,java}"`
   - Analyze existing similar implementations
   - Identify architectural patterns and conventions
   - Map potential integration points

3. **Comprehensive planning**
   - Decompose into granular, actionable tasks
   - Define technical approach with rationale
   - Identify required changes by file/module
   - Plan testing strategy (unit, integration, e2e)
   - Consider performance and security implications
   - Estimate effort and identify blockers

4. **Generate structured plan issue**
   - Title format: "【実装計画】{sanitized-original-title}"
   - Comprehensive Japanese documentation
   - Link to original issue (preserve original)
   - Add planning labels and assign to appropriate team member

5. **Establish issue relationship**
   - Reference original issue: "計画対象: #{original-issue}"
   - Comment on original: "実装計画を作成しました: #{plan-issue}"
   - Update original issue labels (add "planned" or similar)
   - DO NOT close original issue automatically

Implementation plan template:
## 📋 実装計画概要
**対象Issue**: #{original-issue} - {title}
**計画作成日**: {date}
**推定工数**: {estimate}

## 🎯 要件整理
{parsed requirements}

## 🏗️ 技術設計
### アプローチ
{technical approach}

### 影響範囲
{affected files and components}

### 依存関係
{dependencies and prerequisites}

## ✅ 実装タスク
- [ ] {specific task 1}
- [ ] {specific task 2}
- [ ] テスト実装
- [ ] ドキュメント更新

## 🧪 テスト計画
{testing strategy}

## ⚠️ リスクと考慮事項
{risks and considerations}

## 📚 参考資料
{relevant documentation or similar implementations}

Safety measures:
- Confirm before creating if similar plan exists
- Validate issue is actionable and well-defined
- Handle edge cases (closed issues, duplicates)
- Provide rollback instructions for plan issues
- Support dry-run mode for validation
