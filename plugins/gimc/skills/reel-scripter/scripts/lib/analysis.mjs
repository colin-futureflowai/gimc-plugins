// The measurements behind script-check.mjs, as pure functions: text in, findings out. No files, no console.
// What each check means and why is in ../../references/storytelling.md; the numbers live in THRESHOLDS only.
//
// An error is something the script plainly gets wrong (too long, a tagged value signal too late, a beat without its
// questions). Everything that rests on a word list or a pattern is a warning: it points at a line worth a second
// look, it does not prove the line is bad.

export const THRESHOLDS = {
  /** Spoken words per second when no voice-over timings are given (normal, lively reel delivery). */
  wps: { nl: 2.8, en: 3.0 },
  /** Estimated or measured length against the target: above `errorOver` an error, above `warnOver` or below `warnUnder` a warning. */
  duration: { errorOver: 1.2, warnOver: 1.1, warnUnder: 0.75 },
  /** Measured pace from word timings: above `fast` or below `slow` a warning. */
  pace: { fast: 3.6, slow: 2.0 },
  /** Seconds until the first value signal. */
  valueSignalSeconds: 5,
  /** Word timings without punctuation are split into phrases at silences of at least this many milliseconds. */
  pauseMs: 300,
  /** A short sentence has at most `shortWords` words; at least `shortShare` of the sentences should be short. */
  rhythm: { shortWords: 8, shortShare: 0.5, longWords: 18, droneRun: 3, droneMinWords: 5, droneSpread: 1, flatCv: 0.35, flatMinSentences: 6 },
  /** NL: words with more than `nlSyllables` syllables are hard at B1. EN: Flesch-Kincaid grade above `enGrade`. */
  words: { nlSyllables: 4, enGrade: 8 },
  /** Every core term (also as the start of a longer word) should be said at least this often: once plain, once again in other words or an example. */
  coreRepeats: 2,
}

export const BEAT_JOBS = ['hook', 'contrast', 'proof', 'value', 'tease', 'payoff', 'cta']

const VALUE_TAG = /\[value\]/i

const LISTS = {
  nl: {
    stop: ['de', 'het', 'een', 'en', 'van', 'je', 'ik', 'dat', 'die', 'niet', 'is', 'met', 'op', 'voor', 'maar', 'wat', 'jij', 'ze', 'dit', 'zijn', 'ook', 'als', 'naar', 'er', 'om'],
    fillers: ['eigenlijk', 'gewoon', 'even', 'best wel', 'echt', 'heel erg', 'een beetje', 'natuurlijk', 'zeg maar', 'dus ja', 'nou', 'sowieso', 'eh', 'uh', 'uhm', 'ehm', 'als het ware', 'in principe'],
    jargon: ['optimaliseren', 'implementeren', 'faciliteren', 'synergie', 'paradigma', 'holistisch', 'leveragen', 'efficiëntie', 'effectiviteit', 'conceptueel', 'strategisch', 'integraal', 'proactief', 'schaalbaar', 'disruptief'],
    value: [/\d/u, /\b(twee|drie|vier|vijf|zes|zeven|acht|negen|tien|twintig|honderd|duizend|procent|helft)\b/u,
      /\b(zodat|in plaats van|zonder|het geheim|de truc|stappen?|manier om|de fout|fouten|sneller|het verschil|het omgekeerde|nooit meer|de reden|zo doe je|dit is hoe)\b/u,
      /^(hoe|waarom|zo)\b/u],
    beForms: ['word', 'wordt', 'worden', 'werd', 'werden', 'geworden'],
    perfectForms: ['is', 'zijn', 'was', 'waren'],
  },
  en: {
    stop: ['the', 'a', 'an', 'and', 'of', 'you', 'i', 'that', 'it', 'not', 'is', 'with', 'on', 'for', 'but', 'what', 'they', 'this', 'are', 'to', 'in', 'your', 'my', 'we', 'so'],
    fillers: ['basically', 'actually', 'just', 'really', 'very', 'literally', 'kind of', 'sort of', 'you know', 'so yeah', 'honestly', 'um', 'uh', 'i mean', 'pretty much'],
    jargon: ['leverage', 'synergy', 'paradigm', 'holistic', 'utilize', 'optimize', 'facilitate', 'scalable', 'disruptive', 'actionable', 'robust', 'streamline', 'ideate', 'operationalize'],
    value: [/\d/u, /\b(two|three|four|five|six|seven|eight|nine|ten|twenty|hundred|thousand|percent|half)\b/u,
      /\b(here's|here is|instead of|without|the secret|the trick|steps?|way to|the mistake|mistakes|faster|the difference|the opposite|never again|the reason|this is how)\b/u,
      /^(how|why)\b/u],
    beForms: ['am', 'is', 'are', 'was', 'were', 'be', 'been', 'being'],
    irregular: ['done', 'made', 'given', 'taken', 'written', 'shown', 'built', 'seen', 'told', 'known', 'sent', 'found', 'held', 'kept', 'left', 'paid', 'said', 'sold', 'bought', 'caught', 'taught', 'thought', 'brought', 'put', 'set', 'run', 'won', 'lost', 'broken', 'chosen', 'driven', 'eaten', 'forgotten', 'hidden', 'spoken', 'stolen'],
  },
}

// ---------------------------------------------------------------- reading the input

/** Words of a piece of text: letters and digits, with inner apostrophes, hyphens and decimal points. */
export function words(text) {
  return text.match(/[\p{L}\p{N}]+(?:['’.,-][\p{L}\p{N}]+)*/gu) ?? []
}

/** Sentences of a piece of text: split after . ! ? … and at line breaks; tags like [value] stay in the text. */
export function sentences(text) {
  return text
    .split(/\n+/)
    .flatMap((line) => line.split(/(?<=[.!?…])\s+/u))
    .map((s) => s.trim())
    .filter((s) => words(s.replace(VALUE_TAG, '')).length > 0)
}

/** The header of the spoken-line column, in English or Dutch ("Spoken line", "Gesproken zin", "Tekst"). */
const LINE_HEADER = /spoken|gesproken|tekst|zin/

const COLUMNS = [
  ['line', new RegExp(`${LINE_HEADER.source}|line`)],
  ['answered', /answer|beantwoord/],
  ['opened', /open/],
  ['job', /job|taak|rol/],
  ['energy', /emotion|energy|emotie|energie/],
  ['sec', /sec|tijd/],
]

/**
 * The first Markdown table with a spoken-line column, as beats; null when the text has no such table. The header is a
 * pipe row followed by a separator row; the table ends at the first line that is not a pipe row.
 */
export function parseTable(text) {
  const lines = text.split('\n').map((l) => l.trim())
  const cells = (row) => row.replace(/^\||\|$/g, '').split('|').map((c) => c.trim())
  const separator = (row) => /^\|?[\s:|-]+\|?$/.test(row ?? '') && row.includes('-')
  const headerAt = lines.findIndex((l, i) => l.startsWith('|') && separator(lines[i + 1]) && cells(l).some((c) => LINE_HEADER.test(c.toLowerCase())))
  if (headerAt < 0) return null
  const header = cells(lines[headerAt]).map((h) => h.toLowerCase())
  const index = Object.fromEntries(COLUMNS.map(([key, re]) => [key, header.findIndex((h) => re.test(h))]))
  const end = lines.findIndex((l, i) => i > headerAt + 1 && !l.startsWith('|'))
  return lines
    .slice(headerAt + 2, end < 0 ? undefined : end)
    .filter((r) => !separator(r))
    .map((r) => {
      const c = cells(r)
      const get = (key) => (index[key] >= 0 ? c[index[key]] ?? '' : '')
      return normalizeBeat({ line: get('line'), answered: get('answered'), opened: get('opened'), job: get('job'), energy: get('energy'), sec: get('sec') })
    })
}

function normalizeBeat(beat) {
  const text = (value) => (value == null ? '' : String(value).trim())
  const empty = (value) => /^(—|-|–|n\/a|none|geen)?$/i.test(text(value))
  const sec = Number(text(beat.sec).replace(/[~s]/g, '').replace(',', '.'))
  return {
    line: text(beat.line ?? beat.spoken),
    answered: empty(beat.answered) ? '' : text(beat.answered),
    opened: empty(beat.opened) ? '' : text(beat.opened),
    job: text(beat.job).toLowerCase(),
    energy: text(beat.energy ?? beat.emotion),
    sec: Number.isFinite(sec) && sec > 0 ? sec : null,
    value: beat.value === true,
  }
}

/** Voice-over word timings ({ text, startMs, endMs }[], the shape of GIMC captions); null when it is not that. */
export function parseWordTimings(data) {
  const list = Array.isArray(data) ? data : Array.isArray(data?.words) ? data.words : null
  if (!list?.length || !list.every((w) => typeof w?.text === 'string' && Number.isFinite(w.startMs) && Number.isFinite(w.endMs))) return null
  return list
}

/**
 * Turns the input into one shape: { kind: 'text'|'table'|'words', text, beats?, timings?, meta }.
 * `source` is a string (Markdown or plain text) or parsed JSON (a beat table, or word timings).
 */
export function readScript(source) {
  if (typeof source === 'string') {
    const beats = parseTable(source)
    if (beats) return { kind: 'table', text: beatsText(beats), beats, meta: {} }
    const text = source
      .split('\n')
      .filter((l) => !/^\s*(#|>|```|---)/.test(l))
      .map((l) => l.replace(/^\s*([-*+]|\d+[.)])\s+/, '').replace(/[*_`]/g, ''))
      .join('\n')
    if (!words(text).length) throw new Error('the script is empty')
    return { kind: 'text', text, meta: {} }
  }
  const timings = parseWordTimings(source)
  if (timings) return { kind: 'words', text: timings.map((w) => w.text).join(' '), timings, meta: {} }
  const list = Array.isArray(source) ? source : source?.beats
  if (!Array.isArray(list) || !list.length) {
    throw new Error('JSON must be a beat table ({ beats: [{ line, answered, opened, job, energy, sec }] }) or word timings ([{ text, startMs, endMs }])')
  }
  const beats = list.map(normalizeBeat)
  const meta = Array.isArray(source) ? {} : { lang: source.lang, target: source.target, core: source.core }
  return { kind: 'table', text: beatsText(beats), beats, meta }
}

function beatsText(beats) {
  return beats.map((b) => (b.value && !VALUE_TAG.test(b.line) ? `[value] ${b.line}` : b.line)).join('\n')
}

/** Phrases of word timings, split where the silence between two words is at least `gapMs`. */
export function pauseChunks(timings, gapMs) {
  const chunks = [[]]
  timings.forEach((w, i) => {
    if (i > 0 && w.startMs - timings[i - 1].endMs >= gapMs) chunks.push([])
    chunks.at(-1).push(w.text)
  })
  return chunks.map((c) => c.join(' ')).filter((c) => words(c).length > 0)
}

/** 'nl' or 'en', from which common words occur more. */
export function detectLanguage(text) {
  const lower = words(text.toLowerCase())
  const score = (lang) => lower.filter((w) => LISTS[lang].stop.includes(w)).length
  return score('nl') > score('en') ? 'nl' : 'en'
}

// ---------------------------------------------------------------- measuring

/** Estimated syllables of one word. NL: vowel groups, a diaeresis starts a new one. EN: vowel groups minus a silent e. */
export function syllables(word, lang) {
  let w = word.toLowerCase().replace(/[^\p{L}]/gu, '')
  if (!w) return 0
  if (lang === 'nl') {
    w = w.replace(/[äëïöü]/g, (c) => ` ${c.normalize('NFD')[0]}`)
    return Math.max(1, (w.match(/[aeiouyàáèéíóú]+/g) ?? []).length)
  }
  w = w.replace(/(?:[^laeiouy]es|[^laeiouy]e|ed)$/, '').replace(/^y/, '')
  return Math.max(1, (w.match(/[aeiouy]+/g) ?? []).length)
}

/** How often `phrase` occurs as whole words; with `prefix`, also as the start of a longer word (snooze → snoozen). */
function countPhrase(text, phrase, { prefix = false } = {}) {
  const end = prefix ? '' : '(?![\\p{L}\\p{N}])'
  const re = new RegExp(`(?<![\\p{L}\\p{N}])${phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}${end}`, 'giu')
  return (text.match(re) ?? []).length
}

/** The first sentence that signals value: the one tagged [value], else the first that matches the heuristic. */
export function findValueSignal(list, lang) {
  const tagged = list.findIndex((s) => VALUE_TAG.test(s))
  if (tagged >= 0) return { index: tagged, source: 'tag' }
  const index = list.findIndex((s) => LISTS[lang].value.some((re) => re.test(s.toLowerCase())))
  return index >= 0 ? { index, source: 'heuristic' } : null
}

/** Passive constructions in one sentence (a heuristic): NL worden + participle, or zijn + participle + door; EN be + participle. */
export function isPassive(sentence, lang) {
  const t = words(sentence.toLowerCase())
  const near = (i, test) => t.slice(i + 1, i + 7).some(test)
  if (lang === 'nl') {
    const participle = (w) => /^ge\p{L}{2,}(d|t|en)$/u.test(w) || /^(be|ver|ont|her|er)\p{L}{2,}(d|t|en)$/u.test(w)
    return t.some((w, i) => (LISTS.nl.beForms.includes(w) && near(i, participle)) || (LISTS.nl.perfectForms.includes(w) && near(i, participle) && t.slice(i).includes('door')))
  }
  const participle = (w) => (/\p{L}{3,}ed$/u.test(w) && !/(need|feed|speed|seed|bleed)$/.test(w)) || LISTS.en.irregular.includes(w)
  return t.some((w, i) => LISTS.en.beForms.includes(w) && (participle(t[i + 1] ?? '') || (/ly$/.test(t[i + 1] ?? '') && participle(t[i + 2] ?? ''))))
}

/** Runs of at least `droneRun` sentences of (almost) the same length: the drone the ear tunes out. */
export function droneRuns(lengths, { droneRun, droneMinWords, droneSpread }) {
  const runs = []
  let start = 0
  for (let i = 1; i <= lengths.length; i++) {
    const run = lengths.slice(start, i + 1)
    const same = i < lengths.length && Math.max(...run) - Math.min(...run) <= droneSpread && Math.min(...run) >= droneMinWords
    if (!same) {
      if (i - start >= droneRun) runs.push({ from: start, to: i - 1 })
      start = i
    }
  }
  return runs
}

const round = (n, d = 1) => Math.round(n * 10 ** d) / 10 ** d
const clip = (s) => (s.length > 70 ? `${s.slice(0, 67)}…` : s)

/**
 * Checks a script. `script` comes from readScript; options: { lang, target (seconds), core (terms), timings, wps }.
 * Returns { lang, kind, metrics, errors, warnings, thresholds }; every finding is { code, message, at? }.
 */
export function analyze(script, options = {}) {
  const T = THRESHOLDS
  const lang = options.lang ?? script.meta.lang ?? detectLanguage(script.text)
  if (!LISTS[lang]) throw new Error(`language "${lang}" is not supported (nl or en)`)
  const target = Number(options.target ?? script.meta.target) || null
  const coreInput = options.core ?? script.meta.core ?? []
  const core = (Array.isArray(coreInput) ? coreInput : String(coreInput).split(',')).map((c) => c.trim()).filter(Boolean)
  const timings = options.timings ?? script.timings ?? null
  const errors = []
  const warnings = []

  // Captions without punctuation have no sentences: fall back to phrases split at pauses in the voice-over.
  const breakless = script.kind === 'words' && Boolean(timings) && !/[.!?…]/.test(script.text)
  const list = breakless ? pauseChunks(timings, T.pauseMs) : sentences(script.text)
  const judgeable = !breakless || list.length > 1
  if (breakless) {
    warnings.push({ code: 'no_sentence_breaks', message: judgeable
      ? `the timings have no punctuation: split into ${list.length} phrases at pauses of ${T.pauseMs} ms or more; rhythm and the value signal are approximate`
      : `the timings have no punctuation and no pause of ${T.pauseMs} ms or more: rhythm and the value signal can't be judged; check them on the script text` })
  }
  const plain = list.map((s) => s.replace(VALUE_TAG, '').trim())
  const lengths = plain.map((s) => words(s).length)
  const allWords = words(plain.join(' '))
  const total = allWords.length
  const lower = plain.join('\n').toLowerCase()

  // Length and pace.
  const wps = options.wps ?? T.wps[lang]
  const estimated = total / wps
  const measured = timings ? (timings.at(-1).endMs - timings[0].startMs) / 1000 : null
  const seconds = measured ?? estimated
  const pace = measured ? total / measured : null
  if (target) {
    const label = measured ? 'measured' : 'estimated'
    if (seconds > target * T.duration.errorOver) errors.push({ code: 'too_long', message: `${label} ${round(seconds)} s for a ${target} s target (${total} words); cut about ${Math.ceil(total - target * (pace ?? wps))} words` })
    else if (seconds > target * T.duration.warnOver) warnings.push({ code: 'long', message: `${label} ${round(seconds)} s for a ${target} s target` })
    else if (seconds < target * T.duration.warnUnder) warnings.push({ code: 'short', message: `${label} ${round(seconds)} s for a ${target} s target: room for one more proof or example` })
  }
  if (pace && pace > T.pace.fast) warnings.push({ code: 'fast', message: `${round(pace)} words per second: fast to absorb; cut words or slow down` })
  if (pace && pace < T.pace.slow) warnings.push({ code: 'slow', message: `${round(pace)} words per second: slow; tighten the pauses or the lines` })

  // Speed to value.
  const signal = judgeable ? findValueSignal(list, lang) : null
  let valueSeconds = null
  if (!judgeable) {
    warnings.push({ code: 'value_signal_unknown', message: 'the value signal can\'t be placed without sentences or pauses: judge the first seconds yourself' })
  } else if (signal) {
    const before = lengths.slice(0, signal.index).reduce((a, b) => a + b, 0)
    valueSeconds = timings ? (timings[Math.min(before, timings.length - 1)].startMs - timings[0].startMs) / 1000 : before / wps
    if (valueSeconds > T.valueSignalSeconds) {
      const finding = { code: 'late_value', message: `first value signal at ~${round(valueSeconds)} s (${before} words in): "${clip(plain[signal.index])}"`, at: signal.index + 1 }
      ;(signal.source === 'tag' ? errors : warnings).push(finding)
    }
  } else {
    warnings.push({ code: 'no_value_signal', message: `no value signal found: tag the line that promises the payoff with [value], or write one in the first ${T.valueSignalSeconds} s` })
  }

  // Rhythm (not for one unbroken block of captions).
  const shortShare = lengths.filter((n) => n <= T.rhythm.shortWords).length / Math.max(1, lengths.length)
  const mean = total / Math.max(1, lengths.length)
  const sd = Math.sqrt(lengths.reduce((a, n) => a + (n - mean) ** 2, 0) / Math.max(1, lengths.length))
  if (judgeable && shortShare < T.rhythm.shortShare) warnings.push({ code: 'few_short', message: `${Math.round(shortShare * 100)}% short sentences (≤ ${T.rhythm.shortWords} words): mostly staccato reads easier` })
  plain.forEach((s, i) => {
    if (judgeable && lengths[i] > T.rhythm.longWords) warnings.push({ code: 'long_sentence', message: `${lengths[i]} words: "${clip(s)}"`, at: i + 1 })
  })
  for (const run of judgeable ? droneRuns(lengths, T.rhythm) : []) {
    warnings.push({ code: 'drone', message: `sentences ${run.from + 1}–${run.to + 1} are all ${lengths[run.from]}±${T.rhythm.droneSpread} words: vary the length`, at: run.from + 1 })
  }
  if (lengths.length >= T.rhythm.flatMinSentences && sd / mean < T.rhythm.flatCv) warnings.push({ code: 'flat_rhythm', message: `sentence lengths barely vary (${round(mean)} ± ${round(sd)} words)` })

  // Clarity.
  plain.forEach((s, i) => {
    if (isPassive(s, lang)) warnings.push({ code: 'passive', message: `passive voice? "${clip(s)}"`, at: i + 1 })
  })
  const fillers = LISTS[lang].fillers.map((f) => ({ word: f, count: countPhrase(lower, f) })).filter((f) => f.count)
  if (fillers.length) warnings.push({ code: 'fillers', message: `filler words: ${fillers.map((f) => `${f.word} ×${f.count}`).join(', ')}` })
  const distinct = [...new Set(allWords.map((w) => w.toLowerCase()))]
  const jargon = distinct.filter((w) => LISTS[lang].jargon.includes(w))
  const longWords = lang === 'nl' ? distinct.filter((w) => !/\d/.test(w) && syllables(w, 'nl') > T.words.nlSyllables) : []
  const syllableCount = allWords.reduce((a, w) => a + syllables(w, lang), 0)
  const grade = lang === 'en' && total ? round(0.39 * mean + 11.8 * (syllableCount / total) - 15.59) : null
  if (jargon.length) warnings.push({ code: 'jargon', message: `jargon: ${jargon.join(', ')}; say what it does in plain words` })
  if (longWords.length) warnings.push({ code: 'long_words', message: `words over ${T.words.nlSyllables} syllables: ${longWords.join(', ')}; keep a term only if you explain it` })
  if (grade !== null && grade > T.words.enGrade) warnings.push({ code: 'grade', message: `reading grade ${grade} (aim for ${T.words.enGrade} or lower): shorter words and sentences` })

  // Repeaters.
  const coreCounts = core.map((term) => ({ term, count: countPhrase(lower, term.toLowerCase(), { prefix: true }) }))
  for (const c of coreCounts) {
    if (c.count < T.coreRepeats) warnings.push({ code: 'core_once', message: `core point "${c.term}" said ${c.count}×: say it twice (plain, then with an example)` })
  }

  // The beat table: every beat answers a question and opens the next.
  if (script.beats) {
    script.beats.forEach((b, i) => {
      const n = i + 1
      if (!b.line) errors.push({ code: 'empty_beat', message: `beat ${n} has no spoken line`, at: n })
      if (b.job && !BEAT_JOBS.includes(b.job)) errors.push({ code: 'unknown_job', message: `beat ${n}: job "${b.job}" is not one of ${BEAT_JOBS.join(', ')}`, at: n })
      if (!b.job) errors.push({ code: 'no_job', message: `beat ${n} has no beat job`, at: n })
      if (i > 0 && !b.answered) errors.push({ code: 'no_question_answered', message: `beat ${n} answers no question: why is it there?`, at: n })
      if (i < script.beats.length - 1 && !b.opened) errors.push({ code: 'no_question_opened', message: `beat ${n} opens no question: nothing pulls the viewer to beat ${n + 1}`, at: n })
    })
    const jobs = script.beats.map((b) => b.job)
    const payoff = jobs.indexOf('payoff')
    if (payoff >= 0 && !jobs.slice(0, payoff).some((j) => j === 'tease' || j === 'hook')) warnings.push({ code: 'payoff_without_tease', message: 'the payoff comes without a tease before it', at: payoff + 1 })
    const secs = script.beats.map((b) => b.sec)
    if (target && secs.every((s) => s)) {
      const sum = secs.reduce((a, b) => a + b, 0)
      if (Math.abs(sum - target) > target * (T.duration.errorOver - 1)) warnings.push({ code: 'sec_sum', message: `the ~sec column adds up to ${round(sum)} s for a ${target} s target` })
    }
  }

  return {
    lang,
    kind: script.kind,
    metrics: {
      words: total,
      sentences: lengths.length,
      seconds: round(seconds),
      secondsSource: measured ? 'timings' : `estimate at ${wps} words/s`,
      target,
      wordsPerSecond: pace ? round(pace, 2) : null,
      valueSignal: signal ? { sentence: signal.index + 1, seconds: round(valueSeconds), source: signal.source, text: clip(plain[signal.index]) } : null,
      sentenceLength: { mean: round(mean), sd: round(sd), shortShare: round(shortShare, 2), longest: Math.max(0, ...lengths) },
      readingGrade: grade,
      longWords,
      fillers,
      core: coreCounts,
      beats: script.beats?.length ?? null,
    },
    errors,
    warnings,
    thresholds: T,
  }
}

/** The report as readable text. */
export function formatReport(result) {
  const m = result.metrics
  const lines = [
    `script-check · ${result.lang} · ${result.kind}${m.beats ? ` (${m.beats} beats)` : ''}`,
    `length      ${m.words} words · ${m.sentences} sentences · ~${m.seconds} s (${m.secondsSource})${m.target ? ` · target ${m.target} s` : ''}${m.wordsPerSecond ? ` · ${m.wordsPerSecond} words/s` : ''}`,
    `value       ${m.valueSignal ? `sentence ${m.valueSignal.sentence} at ~${m.valueSignal.seconds} s (${m.valueSignal.source}): "${m.valueSignal.text}"` : 'none found'}`,
    `rhythm      ${m.sentenceLength.mean} ± ${m.sentenceLength.sd} words · ${Math.round(m.sentenceLength.shortShare * 100)}% short · longest ${m.sentenceLength.longest}`,
  ]
  if (m.readingGrade !== null) lines.push(`grade       ${m.readingGrade}`)
  if (m.core.length) lines.push(`core        ${m.core.map((c) => `${c.term} ×${c.count}`).join(' · ')}`)
  const list = (title, items) => {
    if (!items.length) return
    lines.push('', `${title} (${items.length})`)
    for (const f of items) lines.push(`  ${f.at ? `[${f.at}] ` : ''}${f.code}: ${f.message}`)
  }
  list('ERRORS', result.errors)
  list('WARNINGS (heuristics: look again, do not obey blindly)', result.warnings)
  lines.push('', result.errors.length ? `${result.errors.length} error(s)` : '0 errors')
  return lines.join('\n')
}
