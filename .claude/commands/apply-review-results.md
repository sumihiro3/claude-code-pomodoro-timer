Apply code review feedback from `/reviews` directory.

Steps:
1. Scan `/reviews` for feedback files (.md, .txt, .json)
2. Parse and categorize feedback (bugs, improvements, style, etc.)
3. Present implementation plan with estimated scope
4. Implement changes incrementally with explanations
5. Run tests after each significant change
6. Perform final validation (tests, linting, type checking)
7. Generate descriptive commit message
8. Confirm changes before committing

Additional requirements:
- Handle missing `/reviews` directory gracefully
- Support multiple feedback file formats
- Prioritize critical issues first
- Provide clear progress updates
- Ask for confirmation on ambiguous feedback
