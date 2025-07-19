Review local changes based on GitHub issue context.

Arguments: <issue-number> (required)

Workflow:
1. Verify prerequisites (git repo, GitHub CLI, issue access)
2. Extract issue details: `gh issue view $1 --json title,body,labels,assignees,milestone`
3. Analyze local changes:
   - `git diff main...HEAD --name-status` (changed files)
   - `git diff main...HEAD` (detailed changes)
   - `git log main..HEAD --oneline` (commit history)
4. Contextual review based on issue requirements
5. Generate structured Japanese feedback

Review dimensions:
- Requirement compliance: Alignment with issue requirements
- Code quality: Readability, maintainability, design patterns
- Bug risks: Error handling, edge cases
- Testing: Coverage and test case validity
- Performance: Efficiency and scalability
- Security: Potential vulnerabilities

Output specification:
- Path: `/reviews/review-{issue-number}-{YYYYMMDD-HHMMSS}.md`
- Format: Issue summary, change summary, detailed review, improvement suggestions
- Style: Clear action items with priorities
- Language: Japanese for all feedback content

Error recovery:
- Missing issue: Suggest valid issue numbers
- No changes: Inform user and suggest workflow
- Permission issues: Provide authentication guidance
