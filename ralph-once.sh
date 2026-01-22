#!/bin/bash

claude --permission-mode acceptEdits "@PRD.md @progress.txt \\
1. Read the PRD and progress file. \\
2. Find the next incomplete task and implement it. \\
3. Update progress.txt with what you did. \\
4. Commit your changes. \\
ONLY DO ONE TASK AT A TIME."