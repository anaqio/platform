# MCP Setup — Anaqio Studio

## Required tokens (add to shell env or ~/.zshrc)

```bash
# Supabase — get from dashboard.supabase.com > Account > Access Tokens
export SUPABASE_ACCESS_TOKEN="sbp_..."

# GitHub — github.com > Settings > Developer settings > Personal access tokens
# Scopes: repo, read:org
export GITHUB_TOKEN="ghp_..."

# Vercel — vercel.com > Account Settings > Tokens
export VERCEL_TOKEN="..."
export VERCEL_TEAM_ID="team_..."     # from vercel.com/teams — optional if personal

# Atlassian — id.atlassian.com > Security > API tokens
export ATLASSIAN_EMAIL="moughamir@anaqio.com"
export ATLASSIAN_API_TOKEN="..."
# Cloud ID: d5eeddb2-3289-41c4-9613-4a814d4f282f
# Site: omnizya.atlassian.net
```

## Installation

Copy `.mcp.json` to project root:

```bash
cp .agents/mcp/.mcp.json .mcp.json
```

Or place in home for global use:

```bash
cp .agents/mcp/.mcp.json ~/.mcp.json
```

Claude Code picks up `.mcp.json` automatically from project root or `~/.mcp.json`.

## MCP TOOL USAGE GUIDE

### Supabase MCP

```
# Run migrations
mcp__supabase__apply_migration

# Execute SQL
mcp__supabase__execute_sql

# List tables
mcp__supabase__list_tables

# Generate types (replaces npx supabase gen types)
mcp__supabase__generate_typescript_types
```

**Token efficiency:** Use Supabase MCP for schema inspection instead of
reading migration files. One MCP call = current live schema state.

### GitHub MCP

```
# Create issue (instead of Jira for quick tasks)
mcp__github__create_issue

# Create PR
mcp__github__create_pull_request

# Read file without checkout
mcp__github__get_file_contents
```

### Vercel MCP

```
# Check deployment status
mcp__vercel__get_deployments

# Get env vars (names only, not values)
mcp__vercel__list_environment_variables

# Trigger redeploy
mcp__vercel__create_deployment
```

### Atlassian MCP (Jira + Confluence)

```
# Create Jira issue
mcp__atlassian__create_issue
# Cloud ID: d5eeddb2-3289-41c4-9613-4a814d4f282f
# Project: SCRUM

# Update issue status
mcp__atlassian__transition_issue
# Transition 21 = In Progress, 31 = Done

# Search issues
mcp__atlassian__search_issues_jql
```

### Sequential Thinking MCP

```
# Use for complex multi-step architectural decisions
# Triggers chain-of-thought before coding
# Invoke with: "Think through this step by step"
```

## TOKEN EFFICIENCY RULES

1. **Supabase MCP > reading migration files** — live schema is authoritative
2. **GitHub MCP > git commands** — avoid shelling out for simple operations
3. **Vercel MCP > checking Vercel dashboard** — deployment status in one call
4. **Atlassian MCP > Jira UI** — create/update issues without browser
5. **Batch MCP calls** — group related queries into single tool invocations
6. **Never use MCP to re-fetch data already in context** — check context first

## ANAQIO JIRA REFERENCE

```
Cloud ID:   d5eeddb2-3289-41c4-9613-4a814d4f282f
Project:    SCRUM
Site:       omnizya.atlassian.net
Mohamed ID: 712020:a1c14b83-d259-449c-b4ec-ded8add71817

Transition IDs:
  11 = To Do
  21 = In Progress
  31 = Done

Confluence:
  Space: AIS (ID: 2621445)
  Parent page: 6914049
```
