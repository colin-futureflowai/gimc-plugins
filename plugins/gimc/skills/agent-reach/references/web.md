# Web reading

Web pages and RSS.

## Any web page (Jina Reader)

```bash
# Read any web page
curl -s "https://r.jina.ai/URL"

# Example
curl -s "https://r.jina.ai/https://example.com/article"
```

**Use for:** most web pages can be read directly with Jina Reader.

## Web Reader (MCP)

```bash
# Read a page as Markdown
mcporter call 'web-reader.webReader(url: "https://example.com")'

# Keep images
mcporter call 'web-reader.webReader(url: "https://example.com", retain_images: true)'

# Plain text
mcporter call 'web-reader.webReader(url: "https://example.com", return_format: "text")'
```

**Use for:** when you need more control over the output format.

## RSS (feedparser)

```python
python3 -c "
import feedparser
for e in feedparser.parse('FEED_URL').entries[:5]:
    print(f'{e.title} — {e.link}')
"
```

**Use for:** following blogs, news sources and podcasts via RSS.

## Which tool

| Need | Tool |
|---|---|
| Any web page | Jina Reader (`curl r.jina.ai`) |
| Images / format control | web-reader MCP |
| RSS feeds | feedparser |
