# Media on the GIMC canvas

Video and images are uploaded as files, never pasted through the conversation (a video does not fit). The upload is one signed HTTP PUT straight to GIMC's storage, then GIMC checks the file.

Accepted: `video/mp4`, `video/quicktime` (mov), `video/webm`, `image/png`, `image/jpeg`, `image/webp`; max 200 MB. GIMC checks the real bytes: a file whose content does not match its type is rejected.

## The flow

**1. The card.** Create it with the rest of the step (kind `video` or `image`, `title`, `body`, `frame_id`, `skill`, `run_id`, lineage) in `gimc.canvas_create_items`. Note its id. A landscape file gets w/h for its aspect (see layout.md).

**2. Size and type.**

```sh
bytes=$(wc -c < final.mp4 | tr -d ' ')
ffprobe -v error -select_streams v:0 -show_entries stream=width,height -of csv=p=0 final.mp4   # e.g. 1080,1920
```

**3. Upload link.** `gimc.canvas_media_upload_url` with `item_id`, `file_name` (a readable name, e.g. `eindvideo-ochtendroutine.mp4`), `mime`, `bytes`. The answer has `signed_url`, `path` and `item_id`. The link is valid for two hours.

**4. PUT.**

```sh
curl -sS -X PUT -H "Content-Type: video/mp4" --data-binary @final.mp4 \
  -o /dev/null -w '%{http_code}\n' "<signed_url>"
```

Content-Type must be the same mime you gave in step 3. 200 means stored. Quote the URL: it contains `?token=`.

**5. Complete.** `gimc.canvas_media_complete` with `item_id` and `path` (exactly as returned). GIMC checks the file; `media_status: ready` means the card now plays. A rejected file (wrong type, empty) leaves the card on "rejected": fix the file and repeat from step 3 with the same `item_id`.

Not completed → the card shows "upload niet afgerond". You can always request a new link for that `item_id` and try again.

### One loose file

For a single file without other cards, skip step 1: call `gimc.canvas_media_upload_url` without `item_id`, with `board_id` and `frame_id` (or x/y, not both), plus `skill`, `run_id`, and `parent_id` + `relation` if it came from a card. GIMC creates the card (kind from the mime, titled with the file name). Afterwards give it a real title and body with `gimc.canvas_update_item`.

## Poster for a video

Every video card gets a poster, so the board shows a still instead of a blank player.

```sh
ffmpeg -y -ss 0.1 -i final.mp4 -frames:v 1 poster.jpg
```

Then `gimc.canvas_media_upload_url` with the video's `item_id`, `role: "poster"`, `file_name: "poster.jpg"`, `mime: "image/jpeg"`, `bytes`; PUT it; `gimc.canvas_media_complete` with `item_id`, `path` and `role: "poster"`. A poster must be an image. If the first frame is black (fade-in), take a later one (`-ss 1`).

## Social video from another account (inspiration, research)

A reel, TikTok or YouTube video you found (scraped, searched, or a link the user gave) is a `link` card, never an uploaded copy of the video (that is someone else's content). GIMC shows it like our own video cards: a phone frame with the thumbnail, the platform and account on top, a play button that opens the platform player only when someone clicks, and the numbers below.

1. **The card** in `gimc.canvas_create_items`: `kind: "link"`, `source_url` (the post URL as the platform shows it; GIMC derives `platform`), `title` (the hook or caption's first line, short), `account_handle` (without `@`), `posted_at` (ISO, if known), `body` (why it matters, a few lines), `skill`, `run_id`, `frame_id`.
2. **Numbers** you have (views, likes, comments, shares, saves): `gimc.canvas_record_stats` on the card, with `measured_at` when the scraper says when.
3. **Thumbnail as poster.** Take the thumbnail or cover URL from the scraper output (Apify `displayUrl`/`thumbnailUrl`, TikTok `cover`, YouTube `https://i.ytimg.com/vi/<id>/hqdefault.jpg`, or the page's `og:image`). Download it right away (platform image links expire), then upload it as the card's poster: `gimc.canvas_media_upload_url` with `item_id`, `role: "poster"`, `file_name: "poster.jpg"`, `mime`, `bytes`; PUT; `gimc.canvas_media_complete` with `role: "poster"`. Convert webp/avif you can't upload to jpeg first (`ffmpeg -i in.webp poster.jpg`).

```sh
curl -sSL -o poster.jpg "$THUMB_URL" && file --mime-type -b poster.jpg && wc -c < poster.jpg
```

No thumbnail (private post, download refused)? Keep the card without poster: it shows the platform and the title, and still plays on click. Never put the scraper's raw JSON in the body.

## Landscape, square and other shapes

The phone frame on the card follows the real aspect of the file, but inside the card's box. A 16:9 video in the default 240×480 box becomes tiny. So for landscape create the card with `w: 480, h: 300` (square: `w: 320, h: 360`), or after a loose upload use `gimc.canvas_move_items` with one move: the same x/y and those w/h.

## Audio (voice-over, podcast)

Audio files are not accepted. Options:

- Keep the audio as text: a `doc` card with the lines, and the file path in the body.
- Or render a waveform video that plays the sound, and upload that as a `video` card:

```sh
ffmpeg -y -i voiceover.mp3 -filter_complex "[0:a]showwaves=s=720x1280:mode=cline,format=yuv420p[v]" \
  -map "[v]" -map 0:a -c:v libx264 -c:a aac -shortest voiceover-golfvorm.mp4
```

## Clips from a long video (podcast, webinar)

Cut each moment to 9:16 with subtitles and the hook on screen; each clip is its own `video` card with lineage `repurpose` to the source card, all in one frame ("Clips"), each with a poster.

```sh
ffmpeg -y -ss 00:12:03 -to 00:12:41 -i source.mp4 \
  -vf "crop=ih*9/16:ih,scale=1080:1920,subtitles=clip1.srt" -c:a aac clip1.mp4
```

## Carousels

A `carousel` card holds the slide texts in its body. Upload slide 1 as the carousel card's poster (`role: poster`). Rendered slides that should be visible on their own become `image` cards in the same frame, each with lineage `derived` from the carousel card. Images can't be uploaded as the carousel card's media (the kinds don't match).

## Cowork: refused upload (network egress)

In Cowork the sandbox only reaches allowed hosts. A PUT that fails with

```
CONNECT tunnel failed, response 403
```

means GIMC's storage host is not on the list yet. Then:

1. Do not retry in a loop.
2. Keep the card (it already has title and body); add the local file path to its body with `gimc.canvas_update_item` so the work is findable.
3. Finish the rest of the run, including all text cards.
4. Tell the user once, with the exact host — the hostname of the `signed_url` you received (e.g. `<project>.supabase.co`): "Allow `<host>` once under claude.ai → Settings → Capabilities (network egress), then ask me to retry the upload."
5. Retry later: `gimc.canvas_media_upload_url` with the same `item_id` (new link), PUT, complete, poster.

Other PUT failures (4xx from storage): request a new link once (it may have expired) and try again; still failing → keep the card, report in one sentence.

## Rendering video in a sandbox (Remotion)

Remotion normally downloads its own headless Chrome from `remotion.media`, which Cowork blocks. Never ask the user to allow `remotion.media`. Use a browser that is already on the system:

```sh
# find one
for b in chrome-headless-shell chromium chromium-browser google-chrome google-chrome-stable; do command -v $b; done
find / \( -name 'chrome-headless-shell' -o -name 'chrome' -o -name 'chromium' \) -type f -perm -u+x 2>/dev/null | head
# render with it
npx remotion render <entry> <composition> out.mp4 --browser-executable=/path/to/chrome-headless-shell
```

`npx remotion browser ensure` may also fail for the same reason; skip it. If no browser is found at all, keep the build table and assets as cards, and tell the user the render needs a machine with Chrome.

Video services that cost money (Seedance, Runway, …) only when the user explicitly asks.
