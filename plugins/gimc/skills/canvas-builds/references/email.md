# Email templates — rules for `type: "email"`

GIMC stores the email as an HTML card (format `email`), shows it on the board and in the panel (desktop and mobile
preview), and people use **HTML kopiëren** or **Downloaden (.html)** to put it in their mail tool. Mail tools are
old browsers: write HTML that works in Outlook, Gmail and Apple Mail.

## What GIMC does with your HTML

- `var(--brand-…)` (with or without a fallback) becomes the value from the folder's brand. Unknown names stay and
  appear in `warnings`.
- Links stay when they are `https:`, `mailto:`, `tel:` or a merge field (`href="{{unsubscribe_url}}"`); any other
  link (`http:`, `javascript:`, relative) is removed. `links` in the answer counts the kept links.
- Scripts and `on*` attributes are removed (a mail tool never runs them), and so are forms and iframes; `removed`
  says what went.
- No brand layer and no base style: the values are inline.
- `text` (plain-text version) is made from the HTML when you do not send it. Send your own when the email has
  buttons or images whose meaning needs words.
- `warnings` lists what breaks in mail tools (flex/grid, position, wider than 600 px, no tables, no color-scheme,
  images without alt, data-URI images, SVG). Fix them in a variant when they are real.

## Structure

```html
<!DOCTYPE html>
<html lang="nl" xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="light dark">
<meta name="supported-color-schemes" content="light dark">
<title>TEST-Webinar: zo plan je je kwartaal</title>
<style>
  /* Only progressive extras here; everything that matters is inline. */
  @media (max-width: 620px) { .stack { display: block !important; width: 100% !important; } .px { padding-left: 20px !important; padding-right: 20px !important; } }
  @media (prefers-color-scheme: dark) { .bg-page { background: #111111 !important; } .bg-card { background: #1c1c1c !important; } .fg { color: #f2f2f2 !important; } }
</style>
</head>
<body style="margin:0;padding:0;background:var(--brand-color-bg, #f4f4f4);" class="bg-page">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;">Preheader text here, 40–90 characters.</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:var(--brand-color-bg, #f4f4f4);" class="bg-page">
    <tr><td align="center" style="padding:24px 12px;">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:600px;background:var(--brand-color-surface, #ffffff);border-radius:12px;" class="bg-card">
        <tr><td class="px" style="padding:32px 40px;font-family:var(--brand-font-body, Arial, sans-serif);font-size:16px;line-height:1.5;color:var(--brand-color-text, #1a1a1a);" >
          <h1 class="fg" style="margin:0 0 16px;font-family:var(--brand-font-heading, Georgia, serif);font-size:28px;line-height:1.2;">Kop</h1>
          <p class="fg" style="margin:0 0 24px;">Hoi {{first_name}}, …</p>
          <!-- Bulletproof button: a table cell with a background colour and a link inside. -->
          <table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
            <td bgcolor="#0b5cad" style="border-radius:8px;background:var(--brand-color-accent, #0b5cad);">
              <a href="https://example.com/aanmelden" style="display:inline-block;padding:14px 24px;font-family:Arial,sans-serif;font-size:16px;font-weight:bold;color:var(--brand-color-accent-text, #ffffff);text-decoration:none;border-radius:8px;">Meld je aan</a>
            </td></tr></table>
        </td></tr>
        <tr><td class="px" style="padding:24px 40px;font-family:Arial,sans-serif;font-size:12px;line-height:1.5;color:var(--brand-color-muted, #666666);">
          Bedrijfsnaam · adres · <a href="{{unsubscribe_url}}" style="color:inherit;">Afmelden</a>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>
```

## Rules

- **Layout with tables** (`role="presentation"`, `cellpadding="0" cellspacing="0" border="0"`), content table
  `width="600"` with `style="width:100%;max-width:600px"` (so it shrinks on a phone; check the Mobiel preview at
  375 px), outer table 100 %. No flex, grid, float layouts or `position`. Images inside: `width:100%;height:auto`.
- **Styles inline** on the element. `<style>` only for extras (mobile stacking, dark mode): Gmail apps can drop it.
- **Fonts:** the brand font first, then a web-safe fallback (`Arial`, `Helvetica`, `Georgia`). Body 16 px, line
  height 1.5; headings 24–32 px.
- **Dark mode:** the two color-scheme metas, colours with enough contrast on both, a `prefers-color-scheme: dark`
  block for page and card backgrounds, and logos that work on dark (use the `light` logo variant or a logo on a
  white tile). Never pure black text on a transparent PNG.
- **Images:** https only, `width` attribute plus `style="display:block;max-width:100%;height:auto"`, always `alt`.
  Brand photos and logos come from `brand.assets`. No SVG, no data-URIs, no background images without a colour.
- **Buttons:** bulletproof (table cell with `bgcolor` and a link), at least 44 px high, one main call to action.
- **Preheader:** the hidden div right after `<body>`, the same text as the `preheader` field.
- **Footer:** sender, address and an unsubscribe placeholder `{{unsubscribe_url}}` for marketing email.
- **Placeholders** in double braces (`{{first_name}}`); say in one line that the mail tool fills them.
- **Subject** 30–60 characters, no all caps, no spam words; **preheader** 40–90 characters, adds to the subject.
- Test content uses made-up names (TEST-…) and `example.com` links.
