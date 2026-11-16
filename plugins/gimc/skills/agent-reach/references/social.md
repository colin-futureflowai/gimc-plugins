# Social media and communities

Reddit and Twitter/X.

## Reddit (several backends, login required)

**Reddit has no zero-config path:** the anonymous `.json` endpoints are blocked (403), and since 2025-11 the official API needs manual approval that is rarely granted. Both backends rely on a logged-in session; first run `agent-reach doctor --json` and check reddit's `active_backend`.

### Backend A: OpenCLI (desktop first choice, reuses the browser login)

```bash
# Search posts
opencli reddit search "query" -f yaml

# Read a post with comments
opencli reddit read POST_ID -f yaml

# Browse a subreddit / hot / popular
opencli reddit subreddit LocalLLaMA -f yaml
opencli reddit hot -f yaml
opencli reddit popular -f yaml

# Subreddit info (subscribers, description)
opencli reddit subreddit-info LocalLLaMA -f yaml
```

> Needs Chrome open and logged in to reddit.com.

### Backend B: rdt-cli (legacy / server fallback; upstream unmaintained since 2026-03)

```bash
rdt search "query" --limit 10   # search posts
rdt read POST_ID                # read a post with comments
rdt sub python --limit 20       # browse a subreddit
rdt popular --limit 10          # browse popular
rdt all --limit 10              # browse /r/all
```

> **Install:** `pipx install 'git+https://github.com/public-clis/rdt-cli.git'` (the PyPI version is behind; install v0.4.2+ from GitHub). Run `rdt login` before searching or reading (on a server without a browser, write the cookie by hand; see the doctor's hint).
> Prefer `--yaml` output; it is easier for an AI agent.

### Advanced: official API + PRAW (only for existing credentials)

Users who registered a Reddit script app before 2025-11 (and hold a client_id/client_secret) can use PRAW on the official API (100 QPM free). New applications need manual approval and personal projects are rarely approved; **don't recommend this route to new users**.

## Twitter/X (twitter-cli)

### Stable commands

```bash
# Home timeline (most stable)
twitter feed -n 20

# Read one tweet (with replies)
twitter tweet URL_OR_ID

# Read a long post / X Article
twitter article URL_OR_ID

# A user's timeline
twitter user-posts @username -n 20

# A user's profile
twitter user @username
```

### Commands that may be unstable

```bash
# Search tweets (Twitter often changes its GraphQL endpoints; may 404)
twitter search "query" -n 10

# Likes (since 2024 only your own, a platform limit)
twitter likes
```

### Retry chain when search fails (in order, stop at the first success)

1. Retry once (occasional failures are common): `twitter search "query" -n 10`
2. Upgrade and retry: `pipx upgrade twitter-cli && twitter search "query" -n 10`
3. Switch to OpenCLI (desktop, reuses the browser login): `opencli twitter search "query" -f yaml`
4. If nothing works, go around it with stable commands such as `twitter feed` / `twitter user-posts @somebody`

### Important notes

> **Install:** `pipx install twitter-cli` (make sure it is v0.8.5+)
>
> **Auth:** export cookies with Cookie-Editor and set the env vars `TWITTER_AUTH_TOKEN` + `TWITTER_CT0`. Automatic extraction does not work over SSH, in Docker or headless.
>
> **IP risk:** don't call it often from a VPS / data-centre IP, especially followers/following; accounts can get banned. Use a residential proxy or a local machine.
>
> **OpenCLI fallback:** with OpenCLI on the desktop, `opencli twitter search/article/user-posts -f yaml` all work (browser login, no cookie env vars).
>
> **Output:** prefer `--yaml` or `--json` for structured output; easier for an AI agent.

