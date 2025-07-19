Create pull request with automatic issue closing.

Usage: Provide comma-separated issue numbers (e.g., "123,456")

Pre-flight checks:
1. Verify current branch is not main/master
2. Confirm local changes exist: `git rev-list main..HEAD --count`
3. Validate GitHub CLI authentication: `gh auth status`
4. Parse and verify issue numbers accessibility

Branch preparation:
1. Show change summary: `git log main..HEAD --oneline` and `git diff main --stat`
2. Ensure clean working directory (all changes committed)
3. Push feature branch: `git push -u origin HEAD`

PR creation process:
1. Fetch issue details for context: `gh issue view <num> --json title,body,labels`
2. Generate intelligent PR title:
   - Single issue: Use issue title with prefix
   - Multiple issues: Create summary based on common theme
   - Fallback: Use primary commit message
3. Create structured Japanese description:
   - 変更の概要 (based on commits and issues)
   - 主な変更点 (from git diff summary)
   - テスト方法 (prompt if not obvious)
   - 関連Issue: Closes #<each-issue-number>

Execute PR creation:
- Run: `gh pr create --title "<generated-title>" --body "<japanese-description>"`
- Handle draft PR option for large changes
- Auto-assign reviewers based on CODEOWNERS if available

Post-creation:
- Display PR URL and number
- Show CI/check status
- Suggest next actions (request reviews, etc.)

Error scenarios:
- No commits ahead of main: Explain and suggest workflow
- Issue numbers not found: List available open issues
- Permission denied: Authentication troubleshooting
- Merge conflicts: Resolution guidance
- Rate limiting: Retry suggestions

Quality assurance:
- Verify all issue numbers are correctly formatted in description
- Check PR title length (GitHub limits)
- Ensure description is meaningful and in Japanese
- Confirm branch protection rules are satisfied
