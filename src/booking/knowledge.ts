// ─────────────────────────────────────────────────────────────────────────
//  REMI'S KNOWLEDGE BASE — the keyless "chatbot brain".
//
//  Lets Remi answer real questions about Ranah Studios from baked-in facts —
//  NO backend, NO API key, works on the static GitHub Pages deploy. When a
//  message matches an entry, the chat answers it then resumes the booking flow.
//
//  SOURCE OF TRUTH: these facts mirror the site's own "Straight answers" FAQ +
//  pricing tiers (Hero / Services / Pricing / FAQ sections). If you change a
//  price or offering on the site, update it HERE too so Remi never quotes wrong.
//
//  Offering, per the site: (1) websites that actually RANK on Google, and
//  (2) a 24/7 AI voice receptionist. For phone-heavy local businesses.
// ─────────────────────────────────────────────────────────────────────────

interface Entry {
  test: RegExp
  answer: string[]
}

// First match wins — order from most specific to most general.
const KB: Entry[] = [
  {
    // upfront cost / is it free — keep ahead of generic pricing
    test: /\b(upfront|up front|free|pay (anything|first|now)|cost to (talk|start)|obligation|catch|risk)\b/,
    answer: [
      'Nothing upfront. We build your demo (a real site and receptionist for your business) for free, before we even talk.',
      'You only pay once you’ve seen it and want it live. Want me to grab you a time?',
    ],
  },
  {
    // website pricing
    test: /\b(website|web ?site|site|web design|seo).*(price|pricing|cost|how much|charge)|\b(price|pricing|cost|how much|charge).*(website|web ?site|site)\b/,
    answer: [
      'Websites start at $750 for a one-page site and go up to $2,500 for a full custom build with ranking SEO (silo, schema, local-area pages, Google Business Profile aligned).',
      'There’s an optional $600/mo care plan that keeps everything hands-off after launch.',
    ],
  },
  {
    // receptionist pricing
    test: /\b(receptionist|voice|phone|call).*(price|pricing|cost|how much|charge)|\b(price|pricing|cost|how much|charge).*(receptionist|voice|phone)\b/,
    answer: [
      'The 24/7 AI receptionist is $4,000 setup + $500/mo. The per-minute phone cost (pennies a call) is billed straight through, and only switches on after your site is live.',
    ],
  },
  {
    // online ordering
    test: /\b(online ordering|order online|ordering|pickup|delivery|takeout|take-?out|cart|checkout|pay online)\b/,
    answer: [
      'Online ordering lets your customers order and pay online for pickup or delivery, without tying up the phone. It runs around $4,000 to set up plus a small monthly fee.',
    ],
  },
  {
    // generic pricing fallback
    test: /\b(price|pricing|cost|costs|how much|charge|rates?|expensive|afford|budget)\b|\$/,
    answer: [
      'Websites run $750 to $2,500 depending on scope. The 24/7 AI receptionist is $4,000 setup + $500/mo. Online ordering is around $4,000 setup plus a small monthly fee. Optional care plan $600/mo.',
      'And the demo is free first. You only pay once you’ve seen it. Want a quick call to scope yours?',
    ],
  },
  {
    // how fast / turnaround
    test: /\b(how (fast|long|soon)|turnaround|timeline|when.*(done|ready|live|finish)|lead time|take to)\b/,
    answer: [
      'Usually within a week of you saying yes, because your demo is already built before we even talk.',
    ],
  },
  {
    // does it pretend to be human / is it AI / disclosure
    test: /\b(pretend|real person|human|is it (a )?(bot|ai|robot)|sound like|disclose|fake)\b/,
    answer: [
      'No. It greets callers in your brand and discloses up front that it’s an automated assistant. It books, answers from your real details, and hands off to a person the moment someone asks. It never invents prices or hours.',
    ],
  },
  {
    // outbound / spam / compliance
    test: /\b(outbound|cold call|spam|call my customers|tcpa|compliant|compliance|legal)\b/,
    answer: [
      'Inbound only. It answers calls that come in, never outbound AI calls to your customers. That keeps you TCPA + Michigan SB 351 compliant.',
    ],
  },
  {
    // the receptionist (what it does)
    test: /\b(receptionist|answer.*(call|phone)|voicemail|miss.*call|phone agent|24\/?7)\b/,
    answer: [
      'A 24/7 AI receptionist that answers every inbound call in your name, books appointments into your calendar, answers hours and services from your own details, and hands off to a real person the moment a caller asks. No more lost-to-voicemail revenue.',
    ],
  },
  {
    // websites / ranking / SEO
    test: /\b(website|web ?site|web design|landing page|redesign|rank|ranking|google|seo|found online|search)\b/,
    answer: [
      'Fast, mobile-friendly, on-brand sites on your own domain, built as a real ranking search build (silo + schema + local-area pages + Google Business Profile), not just a pretty page. The point is getting you found on Google.',
    ],
  },
  {
    // results / guarantee
    test: /\b(guarantee|results|more (customer|client|business|lead)|roi|worth it|does it work)\b/,
    answer: [
      'We promise the mechanism, not a number we can’t control: we make you found and show you the exact ranking numbers every month. Not seeing more inbound in 90 days? We keep optimizing, free.',
    ],
  },
  {
    // who / fit / industries
    test: /\b(who.*(you )?(work|for)|right for|fit|industr|business type|niche|do you work with)\b/,
    answer: [
      'Independent, owner-operated local businesses that live on the phone: dental, salons, barbershops, podiatry, clinics, cafés, nail spas, trades, auto. If you lose calls or are hard to find on Google, you’re a fit.',
    ],
  },
  {
    // how it works / process
    test: /\b(how.*(it )?works?|process|what happens|next step|how do (we|you) start|get started|steps)\b/,
    answer: [
      'Your site and receptionist are built BEFORE we ever talk. You see the real demo on your phone, click around, hear it answer, and it only goes live once you want it. Then we prove results monthly.',
    ],
  },
  {
    // location
    test: /\b(where|location|located|area|near|local|detroit|michigan|ann arbor|ypsilanti)\b/,
    answer: [
      'We’re a solo local studio in Metro Detroit, working with independent local businesses across the area.',
    ],
  },
  {
    // what do you do — most general, keep LAST
    test: /\b(what do (you|u|yall|ya'?ll) (do|offer|make|build|sell)|who are (you|u)|what is ranah|what'?s ranah|about (you|ranah)|services|help me with)\b/,
    answer: [
      'We build local businesses two things: a website that actually ranks on Google, and a 24/7 AI receptionist that never misses a call, so you stop being invisible online and stop losing revenue to voicemail.',
      'Want me to book you a free call to see what fits?',
    ],
  },
]

/** Returns answer bubbles if the message matches a knowledge topic, else null. */
export function matchKnowledge(text: string): string[] | null {
  const t = text.toLowerCase()
  for (const e of KB) if (e.test.test(t)) return e.answer
  return null
}
