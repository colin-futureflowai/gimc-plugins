#!/usr/bin/env node
// Checks a reel script before anyone records or renders it: length against the target, how fast the first value
// signal comes, rhythm, plain words, passive voice, filler words, the core point said twice, and in a script table
// whether every beat answers a question and opens the next. Node 18+, no dependencies.
//
//   node script-check.mjs script.md --lang nl --target 45 --core "promptpiramide"
//   node script-check.mjs beats.json --target 30                 a script table as JSON (see SKILL.md, "The script table")
//   node script-check.mjs script.md --words vo-words.json        measure against the real voice-over timings
//   node script-check.mjs vo-words.json --target 40              only timings ([{ text, startMs, endMs }], e.g. GIMC captions)
//
// Input: Markdown or plain text (a table with a "spoken line" column is read as the script table; headings, quotes and
// code fences are skipped), or JSON. Tag the line that promises the payoff with [value] to measure speed to value
// exactly; without a tag a word-list heuristic picks the first likely line (a warning, never an error).
// Options: --lang nl|en (default: from the text or the JSON), --target <seconds>, --core "term, term", --wps <words
// per second>, --words <timings.json>, --json <file> (the full result as JSON; "-" prints only the JSON).
// The thresholds are THRESHOLDS in lib/analysis.mjs and are printed in the JSON. Exit code 0: no errors, 1: errors,
// 2: the input could not be read.
import { readFileSync, writeFileSync } from 'node:fs'
import { analyze, formatReport, parseWordTimings, readScript } from './lib/analysis.mjs'

const FLAGS = ['lang', 'target', 'core', 'wps', 'words', 'json']

function parseArgs(argv) {
  const options = {}
  const files = []
  for (let i = 0; i < argv.length; i++) {
    const name = argv[i].startsWith('--') ? argv[i].slice(2) : null
    if (name === null) files.push(argv[i])
    else if (!FLAGS.includes(name)) throw new Error(`unknown option --${name} (known: ${FLAGS.map((f) => `--${f}`).join(', ')})`)
    else if (argv[i + 1] === undefined) throw new Error(`--${name} needs a value`)
    else options[name] = argv[++i]
  }
  if (files.length !== 1) throw new Error('give exactly one script file: node script-check.mjs <script.md|beats.json|words.json> [options]')
  return { file: files[0], options }
}

function load(file) {
  let raw
  try {
    raw = readFileSync(file, 'utf8')
  } catch {
    throw new Error(`cannot read ${file}`)
  }
  if (!file.endsWith('.json')) return raw
  try {
    return JSON.parse(raw)
  } catch (error) {
    throw new Error(`${file} is not valid JSON: ${error.message}`)
  }
}

function main() {
  let result
  try {
    const { file, options } = parseArgs(process.argv.slice(2))
    const script = readScript(load(file))
    let timings
    if (options.words) {
      timings = parseWordTimings(load(options.words))
      if (!timings) throw new Error(`${options.words} has no word timings ([{ text, startMs, endMs }])`)
    }
    const target = options.target === undefined ? undefined : Number(options.target)
    if (target !== undefined && !(target > 0)) throw new Error('--target must be a number of seconds')
    const wps = options.wps === undefined ? undefined : Number(options.wps)
    if (wps !== undefined && !(wps > 0)) throw new Error('--wps must be a positive number')
    result = analyze(script, { lang: options.lang, target, core: options.core, timings, wps })
    const json = `${JSON.stringify(result, null, 2)}\n`
    if (options.json === '-') process.stdout.write(json)
    else {
      if (options.json) {
        try {
          writeFileSync(options.json, json)
        } catch (error) {
          throw new Error(`cannot write ${options.json}: ${error.code ?? error.message}`)
        }
      }
      console.log(formatReport(result))
    }
  } catch (error) {
    console.error(`script-check: ${error.message}`)
    process.exitCode = 2
    return
  }
  // exitCode, not exit(): a large JSON on a pipe is written asynchronously and must not be cut off.
  process.exitCode = result.errors.length ? 1 : 0
}

main()
