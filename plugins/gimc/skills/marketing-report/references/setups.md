# Setups and parts

## The block in the folder note

Under "What the user wants", exactly this shape (one block per setup; several setups per folder are fine):

```markdown
### Rapport: Weekrapport (marketing-report)
- Bron: social
- Periode: laatste week (elke run de afgelopen 7 dagen, vast in het rapport)
- Vergelijken: vorige periode
- Account: alle
- Concurrent: —
- Onderdelen: kerncijfers, resultaten, groei, beste posts (5), formaten, volgers online
- Wensen: korte zinnen, video's groot
```

Find setups with `/### Rapport: (.+?) \(marketing-report\)/g`. Keep the user's words; change only the line that changed.

## The four presets

| Preset | Period | Parts |
|---|---|---|
| **Weekrapport** | last week | kerncijfers, resultaten, groei, beste posts (5), formaten |
| **Maandrapport** | last month | kerncijfers, resultaten, groei, tijdlijn, volgers online, doelgroep, stories, beste posts (6) |
| **Beste tijden** | last 90 days | beste tijden, volgers online, beste posts (3) |
| **Wij vs. concurrent** | last 30 days | concurrent, kerncijfers, beste posts (3); handle from the intake |

## Parts → tags

`F`/`T` = the run's `from`/`to` (`YYYY-MM-DD`). A report never uses `range`. `account="<handle>"` on every tag when the
setup names one account.

| Part | Tags |
|---|---|
| kerncijfers | `<live-value data="followers.count" from="F" to="T">`, `views`, `reach`, `interactions`, `engagement_rate`, each with `compare="previous"` when the setup compares |
| resultaten | `<live-value data="profile_views" …>`, `<live-value data="website_clicks" …>` (profile visits and link clicks are separate numbers; no funnel) |
| groei | `<live-chart data="followers.growth" from="F" to="T" view="line">` + `<live-value data="followers.gained" …>` and `followers.lost`; only the tags whose `coverage` day is ≤ F (SKILL §4), otherwise leave the part out |
| tijdlijn | `<live-chart data="views" from="F" to="T" view="bars">` (views of posts per day) |
| beste posts (n) | `<live-posts data="posts.top" from="F" to="T" limit="n" show="media,views,reach,interactions">`; one featured post: `<live-post post="ID" show="media,views,reach,watch_time,skip_rate,follows">` |
| formaten | `<live-chart data="formats.reach" from="F" to="T" view="bars">` |
| volgers online | `<live-chart data="online.heatmap" from="F" to="T" view="heatmap">` (hours in Amsterdam time; GIMC converts Meta's Pacific hours) |
| doelgroep | `<live-chart data="audience.country" view="bars">`, `audience.city`, `audience.age` (latest measurement; with `to="T"` the latest up to that day) |
| stories | `<live-value data="stories" from="F" to="T">` (count) + `<live-table data="stories" from="F" to="T">` |
| beste tijden | `<live-table data="best_times">` (always current, no period) |
| concurrent | `<live-value data="competitor.followers" handle="H">`, `<live-value data="competitor.avg_interactions" handle="H">`, `<live-table data="competitor.posts" handle="H">` (always current; needs an Instagram account via Facebook Login, otherwise the card shows that reason) |

`show` and `columns` take a comma list of: `media, views, reach, interactions, engagement_rate, watch_time, skip_rate,
follows, profile_views, date, caption`. `<live-posts>`: `limit` 1–12 (default 5), `sort` `views|reach|interactions|engagement_rate`.

## What the reader sees

- Only parts with data for the whole period (SKILL §4, `coverage`); a part without it is not in the report.

- A number with a reason instead of a value (for example "Instagram geeft dit pas vanaf 100 volgers.") — never a 0.
- "voorlopig" next to a number whose period ended less than a day ago (two days for followers online); it freezes
  after that and never changes again, also when Instagram corrects its numbers later.
- A notice with the valid options when a tag is wrong (fix it in **Code** or with `gimc.canvas_update_html_card`).
