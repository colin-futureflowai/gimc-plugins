# Safe zones and danger zones per platform

All values in px on a **1080×1920** (9:16) canvas: the margin from each edge that the platform's own UI
covers. The safe rectangle is what remains. For another size, scale by width (for example ×1.333 for
1440×2560, which Meta now recommends).

Researched 17-11-2026. The official zones are **ad** specifications; the organic UI is close to them but
not documented. Re-check once a year: platforms move their buttons.

## Per platform

| Platform | Top | Bottom | Left | Right | Safe rectangle (x × y) | What sits in the danger zones | Status |
|---|---|---|---|---|---|---|---|
| Instagram Reels | 269 | 672 | 65 | 65 | 65–1015 × 269–1248 | top: profile, "Sponsored"; bottom: username, caption, CTA button; right: like/comment/share column | official (Meta: 14 % / 35 % / 6 %) |
| Instagram Stories | 269 | 672 | 65 | 65 | 65–1015 × 269–1248 | top: progress bar, profile name; bottom: reply bar, CTA | official (same zone as Reels since March 2026; older guides with 20 % bottom are out of date) |
| Facebook Reels | 269 | 672 | 65 | 65 | 65–1015 × 269–1248 | as Instagram Reels | official |
| YouTube Shorts | 288 | 672 | 48 | 192 | 48–888 × 288–1248 | top: search, camera, menu; bottom: title, channel, subscribe, CTA; right: like/dislike/comment/share/remix | official (Google's safe-zone diagram and PDF) |
| TikTok (in-feed) | 240 | 660 | 120 | 120 above y 840, 300 below | 120–780 × 240–1260 (to x 960 above y 840) | top: Following / For You, search, LIVE; bottom: username, caption, music, CTA; right: avatar and action column | secondary (measured from TikTok's template; TikTok publishes no px) |
| TikTok with Anchor + long caption | 240 | 1014 | 120 | 300 | 120–780 × 240–906 | as TikTok, plus the anchor link | secondary |
| LinkedIn vertical video | 260 | 560 | 112 | 210 | 112–870 × 260–1360 | likely the right action column and the bottom caption / CTA | **unverified** (no official zone; secondary source only) |
| Snapchat (ads) | 150 | 330 | – | – | full width × 150–1590 | top: advertiser name, "Ad"; bottom: CTA / swipe up | **unverified** (official page unavailable; several secondary sources agree) |

Where sources differ, the larger margin is used.

## Universal safe area

The largest margin of every platform above (TikTok Anchor left out):

- top **288**, bottom **672**, left **120**, right **300**
- **safe area: x 120–780 × y 288–1248 (660 × 960 px)**
- above y 840 the right edge may go to x 960 (the TikTok action column starts lower)

Use it when a reel goes to several platforms or the platform is not known. TikTok Anchor creatives need
their own layout.

## Cover and the Instagram grid

The Instagram profile grid has shown a taller crop instead of a square since January 2025, mostly reported
as **3:4** (one source says 4:5; Instagram publishes no spec). A 3:4 centre crop of 1080×1920 is 1080×1440,
**y 240–1680**. The old square crop was y 420–1500.

- Keep the **cover title inside y 420–1500** (and x 120–780 when the cover frame is also seen in the feed):
  it survives both crops and the feed UI.
- Instagram lets the user move the grid crop ("Adjust preview"); do not rely on it.

## Sources

Official:

- Meta Ads Guide, Instagram Reels: https://www.facebook.com/business/ads-guide/update/video/instagram-reels
- Meta Ads Guide, Instagram Stories: https://www.facebook.com/business/ads-guide/update/video/instagram-story
- Meta Ads Guide, Facebook Reels: https://www.facebook.com/business/ads-guide/update/video/facebook-facebook-reels
- Google Ads Help, square and vertical video: https://support.google.com/google-ads/answer/9128498
- Google, Universal Video Ad Safe Zones (PDF): https://services.google.com/fh/files/helpcenter/ytadsafezones.pdf
- TikTok In-Feed Ads (templates only, no px): https://ads.tiktok.com/help/article/tiktok-auction-in-feed-ads
- LinkedIn video ad specs (no safe zone): https://www.linkedin.com/help/lms/answer/a424737

Secondary:

- adkit.so safe zones (TikTok, LinkedIn, Snapchat; updated 21-10-2026): https://adkit.so/tools/safe-zones/tiktok
- Billo, Meta unified safe zone (12-11-2026): https://billo.app/blog/meta-ads-safe-zones
- Social Media Today, Instagram grid change (January 2025): https://www.socialmediatoday.com/news/instagram-chief-flags-coming-changes-profile-grid-displays/724532/
- Kapwing, 3:4 grid: https://www.kapwing.com/resources/instagrams-new-grid-layout-size-and-dimensions-2025/
