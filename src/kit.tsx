// Slim kit: ToolHero, ScoreCard, SectionBreakdown, CrossPromo, and track().
// Local copies of what `~/Projects/Bilko/src/components/tool-page/*` provides
// — minus the host-only theme registry and react-router <Link>.

import { useState, type ReactNode } from 'react';

// ─────────────────────────────────────────────────────────────
// Analytics — same wire format as the host's usePageView.track().
// Calls bilko.run/api/analytics/event same-origin once deployed.

const HOST = 'https://bilko.run';
const API = `${HOST}/api`;

let visitorId: string | null = null;
function getVisitorId(): string {
  if (visitorId) return visitorId;
  try {
    let v = localStorage.getItem('bilko_vid');
    if (!v) {
      v = crypto.randomUUID();
      localStorage.setItem('bilko_vid', v);
    }
    visitorId = v;
    return v;
  } catch {
    return 'anon';
  }
}

let sessionId: string | null = null;
function getSessionId(): string {
  if (sessionId) return sessionId;
  try {
    sessionId = sessionStorage.getItem('bilko_sid') ?? crypto.randomUUID();
    sessionStorage.setItem('bilko_sid', sessionId);
    return sessionId;
  } catch {
    return 'anon';
  }
}

export function track(event: string, props?: { tool?: string; metadata?: unknown }): void {
  try {
    const body = JSON.stringify({
      event,
      tool: props?.tool ?? 'stack-audit',
      path: typeof window !== 'undefined' ? window.location.pathname : null,
      metadata: props?.metadata ?? null,
      visitor_id: getVisitorId(),
      session_id: getSessionId(),
    });
    const url = `${API}/analytics/event`;
    if (typeof navigator?.sendBeacon === 'function') {
      const blob = new Blob([body], { type: 'application/json' });
      if (navigator.sendBeacon(url, blob)) return;
    }
    fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
      keepalive: true,
    }).catch(() => {});
  } catch {
    // analytics never breaks the app
  }
}

// ─────────────────────────────────────────────────────────────
// ToolHero — slate theme baked in (was: getToolTheme('stack-audit')).

export function ToolHero({ title, tagline, children }: {
  title: string;
  tagline: string;
  children: ReactNode;
}) {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#151a20] via-[#0f1318] to-[#151a20]" />
      <div
        className="absolute inset-0"
        style={{ background: 'radial-gradient(ellipse at center, rgba(100,116,139,0.14), transparent 70%)' }}
      />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

      <div className="relative max-w-3xl mx-auto px-6 py-16 md:py-24 text-center">
        <h1 className="text-display-lg text-white animate-slide-up">{title}</h1>
        <p
          className="mt-4 text-base md:text-lg text-warm-400 max-w-lg mx-auto leading-relaxed animate-slide-up"
          style={{ animationDelay: '60ms' }}
        >
          {tagline}
        </p>
        <div className="mt-6 animate-slide-up" style={{ animationDelay: '160ms' }}>
          {children}
        </div>
        <p className="mt-4 text-xs text-warm-500 flex items-center justify-center gap-2">
          <svg className="w-3.5 h-3.5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
          Free to try &middot; Results in ~30 seconds &middot; No credit card
        </p>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
// Color helpers (was: src/components/tool-page/colors.ts).

function gradeColorLight(grade: string): string {
  if (grade.startsWith('A')) return 'text-green-400';
  if (grade.startsWith('B')) return 'text-blue-400';
  if (grade.startsWith('C')) return 'text-yellow-400';
  if (grade === 'D') return 'text-orange-400';
  return 'text-red-400';
}

function barColor(pct: number): string {
  if (pct >= 80) return 'bg-green-500';
  if (pct >= 60) return 'bg-blue-500';
  if (pct >= 40) return 'bg-yellow-500';
  return 'bg-red-500';
}

// ─────────────────────────────────────────────────────────────
// ScoreCard — slate theme baked in.

export function ScoreCard({ score, grade, verdict, toolName }: {
  score: number;
  grade: string;
  verdict: string;
  toolName: string;
}) {
  const [copied, setCopied] = useState(false);
  const shareText = `Just scored ${score}/100 (${grade}) on ${toolName}\n\n"${verdict}"\n\nFree at bilko.run`;

  return (
    <div className="bg-gradient-to-br from-[#151a20] via-[#0f1318] to-[#151a20] rounded-2xl p-6 md:p-8 text-center relative overflow-hidden animate-slide-up shadow-dark-elevation">
      <div
        className="absolute inset-0"
        style={{ background: 'radial-gradient(circle at 50% 30%, rgba(100,116,139,0.14), transparent 60%)' }}
      />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
      <div className="relative">
        <p className="text-label text-slate-400 mb-4">{toolName}</p>
        <div className="flex items-center justify-center gap-4 mb-3">
          <span
            className="text-6xl md:text-7xl font-black text-white"
            style={{ letterSpacing: '-0.04em' }}
          >
            {score}
          </span>
          <div className="text-left">
            <div
              className={`text-4xl md:text-5xl font-black ${gradeColorLight(grade)}`}
              style={{ letterSpacing: '-0.03em' }}
            >
              {grade}
            </div>
            <div className="text-xs text-warm-500">/100</div>
          </div>
        </div>
        <p className="text-slate-400 font-bold italic text-sm md:text-base max-w-md mx-auto mb-5">
          &ldquo;{verdict}&rdquo;
        </p>
        <div className="flex flex-wrap justify-center gap-2 mt-4">
          <button
            onClick={() => {
              navigator.clipboard.writeText(shareText).then(() => {
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              });
            }}
            className="px-4 py-2 border border-white/10 hover:border-white/20 text-warm-400 hover:text-white text-xs font-semibold rounded-lg transition-colors"
          >
            {copied ? 'Copied!' : 'Copy Result'}
          </button>
          <button
            onClick={() => {
              const blob = new Blob([JSON.stringify({ score, grade, verdict, tool: toolName }, null, 2)], { type: 'application/json' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `${toolName.toLowerCase().replace(/\s+/g, '-')}-result.json`;
              a.click();
              URL.revokeObjectURL(url);
            }}
            className="px-4 py-2 border border-white/10 hover:border-white/20 text-warm-400 hover:text-white text-xs font-semibold rounded-lg transition-colors"
          >
            Download JSON
          </button>
          <button
            onClick={() =>
              window.open(
                `https://x.com/intent/tweet?text=${encodeURIComponent(shareText)}`,
                '_blank',
                'width=550,height=420',
              )
            }
            className="px-4 py-2 bg-white/[0.08] hover:bg-white/[0.12] text-white text-xs font-semibold rounded-lg transition-colors"
          >
            Share on X
          </button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// SectionBreakdown — score bar per pillar.

export interface PillarScore {
  score: number;
  max: number;
  feedback: string;
}

export function SectionBreakdown({ pillars, labels }: {
  pillars: Record<string, PillarScore>;
  labels: Record<string, string>;
}) {
  return (
    <div
      className="bg-white rounded-2xl shadow-elevation-1 p-6 animate-slide-up"
      style={{ animationDelay: '100ms' }}
    >
      <h3 className="text-label text-warm-400 mb-6">Score Breakdown</h3>
      <div className="space-y-6">
        {Object.entries(pillars).map(([key, pillar]) => {
          const pct = Math.round((pillar.score / pillar.max) * 100);
          return (
            <div key={key}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-warm-800">{labels[key] ?? key}</span>
                <span className="text-sm font-bold text-warm-700 tabular-nums">
                  {pillar.score}/{pillar.max}
                </span>
              </div>
              <div className="h-2 bg-warm-100 rounded-full overflow-hidden mb-2">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${barColor(pct)}`}
                  style={{ width: `${pct}%` }}
                />
              </div>
              <p className="text-sm text-warm-500 leading-relaxed">{pillar.feedback}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// CrossPromo — hardcoded list (was: data-driven via tools.ts crossPromo).
// Targets are full URLs back to bilko.run so the click triggers a full reload.

const CROSS_PROMO: { name: string; href: string; hook: string }[] = [
  {
    name: 'LaunchGrader',
    href: 'https://bilko.run/products/launch-grader',
    hook: 'Stack optimized. Now audit your launch readiness.',
  },
  {
    name: 'LocalScore',
    href: 'https://bilko.run/projects/local-score/',
    hook: 'Need to analyze sensitive contracts? Do it privately in your browser.',
  },
];

export function CrossPromo() {
  return (
    <div className="max-w-2xl mx-auto px-6 pb-12">
      <div className="bg-warm-50/80 rounded-2xl shadow-elevation-1 p-6">
        <h3 className="text-label text-warm-400 mb-4">Next up</h3>
        <div className="space-y-3">
          {CROSS_PROMO.map(p => (
            <a
              key={p.name}
              href={p.href}
              className="group flex items-center gap-3 p-3 rounded-xl bg-white shadow-elevation-1 hover:shadow-elevation-2 hover:-translate-y-0.5 transition-all"
            >
              <div className="flex-1 min-w-0">
                <span className="text-sm font-bold text-warm-800 group-hover:text-warm-900 transition-colors">
                  {p.name}
                </span>
                <p className="text-xs text-warm-500 mt-0.5">{p.hook}</p>
              </div>
              <svg
                className="w-4 h-4 text-warm-400 group-hover:text-fire-500 group-hover:translate-x-0.5 transition-all flex-shrink-0"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
