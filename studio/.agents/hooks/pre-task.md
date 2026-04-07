# hook: pre-task

# run before starting ANY coding task

## CHECKLIST (answer all before writing code)

### 1. SCOPE CHECK

- Is this task in CLAUDE.md SCOPE section?
- If NO → ask user to confirm before proceeding

### 2. SKILL LOAD

- What is the primary domain of this task?
  - DB/RLS/migrations → load `.agents/skills/supabase.md`
  - Routing/RSC/API routes → load `.agents/skills/nextjs.md`
  - Generation/HF Spaces → load `.agents/skills/inference.md`
  - Components/DRY/cva → load `.agents/skills/components.md`
  - Realtime/subscriptions → load `.agents/skills/realtime.md`
  - Styling/brand/Tailwind → load `.agents/skills/brand.md`
  - Tests/Vitest/Playwright → load `.agents/skills/testing.md`
- Load ONLY relevant skills — not all of them

### 3. SCHEMA VERIFY (for DB tasks)

- Does this task touch a table?
- If YES → read `.agents/steering/schema.md` for column names
- Do NOT guess column names from memory

### 4. ARCHITECTURE CHECK (for new files)

- Does the file path match `.agents/steering/architecture.md`?
- Is this a Server or Client Component?
- Does it need a new lib/util or hook?

### 5. ABSOLUTE RULES SCAN

- Will this task involve Supabase client instantiation? → RULE-01/02/03
- Will this task involve Supabase queries? → RULE-04
- Will this task involve styling? → RULE-06/11
- Will this task involve TypeScript types? → RULE-09

### 6. PLAN (for tasks > 2 files)

Use TodoWrite to list all files to create/modify before touching any:

```
[ ] Create lib/utils/storage.ts
[ ] Update app/api/generate/route.ts
[ ] Create hooks/useGeneration.ts
[ ] Update components/studio/StudioShell.tsx
```

### 7. FREEZE GATE

- Is today ≤ March 28?
- Is this task required for expo or is it nice-to-have?
- If nice-to-have → defer to post-expo backlog

## TOKEN EFFICIENCY

- If context already has schema info → do not re-read schema file
- If context already has skill content → do not re-read skill file
- Check context window for existing file contents before reading files
