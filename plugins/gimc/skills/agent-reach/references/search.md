# Search

Exa AI search engine.

## Exa AI search

High-quality AI search engine, strong on technical and code search.

```bash
mcporter call 'exa.web_search_exa(query: "query", numResults: 5)'
mcporter call 'exa.get_code_context_exa(query: "code question", tokensNum: 3000)'
```

### When to use which call

| Need | Call |
|---|---|
| Web search | `web_search_exa(query: "...", numResults: 5)` |
| Code search | `get_code_context_exa(query: "...", tokensNum: 3000)` |

### Strengths

- Strong on English content and technical docs
- Supports code-context search
- High-quality results

## Compared with other search tools

| Tool | Best for |
|---|---|
| Exa | English / technical / code search |
| GitHub search ([dev.md](dev.md)) | Repos and code |
