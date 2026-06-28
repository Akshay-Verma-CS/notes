import type { ReactNode } from "react";

type HighlightTone = "amber" | "blue" | "ink";

function cx(...classes: Array<string | false | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function Container({
  children,
  className
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={cx("mx-auto w-full max-w-7xl px-5 sm:px-6 lg:px-8", className)}>{children}</div>;
}

export function Paragraph({
  children,
  className
}: {
  children: ReactNode;
  className?: string;
}) {
  return <p className={cx("max-w-3xl text-[1.05rem] leading-8 text-slate-700", className)}>{children}</p>;
}

export function Highlight({
  tone = "amber",
  title,
  children
}: {
  tone?: HighlightTone;
  title: string;
  children: ReactNode;
}) {
  const styles: Record<HighlightTone, string> = {
    amber: "border-amber-300/80 bg-amber-50/85 text-slate-800 dark:border-amber-400/30 dark:bg-amber-400/10 dark:text-slate-200",
    blue: "border-accent-200/80 bg-accent-50/85 text-slate-800 dark:border-sky-400/30 dark:bg-sky-400/10 dark:text-slate-200",
    ink: "border-slate-200 bg-white text-slate-800 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
  };

  return (
    <aside className={cx("rounded-lg border p-5 shadow-sm", styles[tone])}>
      <p className="section-title">{title}</p>
      <div className="mt-3 space-y-3 text-[0.98rem] leading-7 text-slate-700 dark:text-slate-300">{children}</div>
    </aside>
  );
}

export function DataTable({
  rows
}: {
  rows: Array<{ label: string; value: string }>;
}) {
  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
      <table className="w-full border-separate border-spacing-0 text-left">
        <tbody>
          {rows.map((row, index) => (
            <tr key={row.label} className={index > 0 ? "border-t border-slate-200" : ""}>
              <th className="w-1/3 border-b border-slate-200 bg-slate-50 px-5 py-4 text-sm font-semibold text-slate-600">
                {row.label}
              </th>
              <td className="border-b border-slate-200 px-5 py-4 text-[0.98rem] leading-7 text-slate-800">
                {row.value}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Box({
  x,
  y,
  w,
  h,
  title,
  subtitle,
  fill = "var(--diagram-box)",
  stroke = "var(--diagram-stroke)"
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  title: string;
  subtitle?: string;
  fill?: string;
  stroke?: string;
}) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx="8" fill={fill} stroke={stroke} strokeWidth="2" />
      <text x={x + w / 2} y={y + 28} textAnchor="middle" className="fill-ink-900 text-[14px] font-semibold">
        {title}
      </text>
      {subtitle ? (
        <text x={x + w / 2} y={y + 52} textAnchor="middle" className="fill-ink-500 text-[11px]">
          {subtitle}
        </text>
      ) : null}
    </g>
  );
}

function Arrow({
  x1,
  y1,
  x2,
  y2,
  stroke = "#9f8f7a",
  dashed = false
}: {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  stroke?: string;
  dashed?: boolean;
}) {
  return (
    <line
      x1={x1}
      y1={y1}
      x2={x2}
      y2={y2}
      stroke={stroke}
      strokeWidth="3"
      strokeLinecap="round"
      strokeDasharray={dashed ? "8 8" : undefined}
      markerEnd="url(#arrowhead)"
    />
  );
}

export function PatternDiagram({
  kind,
  title
}: {
  kind:
    | "singleton"
    | "builder"
    | "factory"
    | "abstract-factory"
    | "prototype"
    | "adapter"
    | "composite"
    | "decorator"
    | "proxy"
    | "flyweight"
    | "chain"
    | "state"
    | "observer"
    | "strategy"
    | "template"
    | "locking"
    | "sharding"
    | "redis";
  title: string;
}) {
  const accent = "#2277f2";
  const warm = "#f59e0b";
  const ink = "#475569";

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <svg viewBox="0 0 760 360" className="h-auto w-full">
        <defs>
          <marker id="arrowhead" markerWidth="12" markerHeight="12" refX="10" refY="6" orient="auto">
            <path d="M 0 0 L 12 6 L 0 12 z" fill="var(--diagram-arrow)" />
          </marker>
        </defs>

        <rect x="10" y="10" width="740" height="340" rx="12" fill="url(#bgGrad)" stroke="var(--diagram-border)" />
        <defs>
          <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--diagram-grad-from)" />
            <stop offset="100%" stopColor="var(--diagram-grad-to)" />
          </linearGradient>
        </defs>

        <text x="40" y="52" className="fill-ink-900 text-[24px] font-semibold">
          {title}
        </text>
        <text x="40" y="78" className="fill-ink-500 text-[12px]">
          A visual cue for how the pattern moves data, responsibility, or creation.
        </text>

        {kind === "singleton" ? (
          <>
            <Box x={320} y={120} w={120} h={66} title="One instance" subtitle="shared access" fill="var(--diagram-box-muted)" stroke="var(--diagram-stroke-accent)" />
            <Box x={80} y={120} w={92} h={56} title="Client A" />
            <Box x={80} y={220} w={92} h={56} title="Client B" />
            <Box x={600} y={170} w={92} h={56} title="Client C" />
            <Arrow x1={172} y1={148} x2={320} y2={150} stroke={accent} />
            <Arrow x1={172} y1={248} x2={320} y2={162} stroke={accent} />
            <Arrow x1={600} y1={198} x2={440} y2={155} stroke={accent} />
          </>
        ) : null}

        {kind === "builder" ? (
          <>
            <Box x={50} y={145} w={96} h={54} title="step 1" subtitle="plan" />
            <Box x={185} y={145} w={96} h={54} title="step 2" subtitle="assemble" />
            <Box x={320} y={145} w={96} h={54} title="step 3" subtitle="shape" />
            <Box x={500} y={120} w={140} h={108} title="product" subtitle="built object" fill="var(--diagram-box-muted)" stroke="var(--diagram-stroke-accent)" />
            <Arrow x1={146} y1={172} x2={185} y2={172} stroke={warm} />
            <Arrow x1={281} y1={172} x2={320} y2={172} stroke={warm} />
            <Arrow x1={416} y1={172} x2={500} y2={172} stroke={warm} />
          </>
        ) : null}

        {kind === "factory" ? (
          <>
            <Box x={74} y={138} w={122} h={70} title="Caller" subtitle="asks for product" />
            <Box x={278} y={118} w={164} h={114} title="Factory" subtitle="chooses concrete type" fill="var(--diagram-box-muted)" stroke="var(--diagram-stroke-accent)" />
            <Box x={526} y={86} w={134} h={72} title="Product A" />
            <Box x={526} y={182} w={134} h={72} title="Product B" />
            <Arrow x1={196} y1={173} x2={278} y2={175} stroke={accent} />
            <Arrow x1={442} y1={148} x2={526} y2={122} stroke={warm} />
            <Arrow x1={442} y1={178} x2={526} y2={218} stroke={warm} />
          </>
        ) : null}

        {kind === "abstract-factory" ? (
          <>
            <Box x={70} y={145} w={120} h={70} title="client" subtitle="asks for family" />
            <Box x={286} y={80} w={180} h={88} title="theme factory" subtitle="consistent family" fill="var(--diagram-box-muted)" stroke="var(--diagram-stroke-accent)" />
            <Box x={532} y={55} w={140} h={62} title="Button" />
            <Box x={532} y={134} w={140} h={62} title="Card" />
            <Box x={532} y={213} w={140} h={62} title="Input" />
            <Arrow x1={190} y1={180} x2={286} y2={124} stroke={accent} />
            <Arrow x1={466} y1={114} x2={532} y2={86} stroke={warm} />
            <Arrow x1={466} y1={124} x2={532} y2={165} stroke={warm} />
            <Arrow x1={466} y1={134} x2={532} y2={244} stroke={warm} />
          </>
        ) : null}

        {kind === "prototype" ? (
          <>
            <Box x={102} y={128} w={130} h={88} title="prototype" subtitle="known-good exemplar" fill="var(--diagram-box-muted)" stroke="var(--diagram-stroke-accent)" />
            <Box x={322} y={128} w={120} h={88} title="clone()" subtitle="copy state" />
            <Box x={526} y={86} w={124} h={62} title="copy A" />
            <Box x={526} y={178} w={124} h={62} title="copy B" />
            <Arrow x1={232} y1={172} x2={322} y2={172} stroke={accent} />
            <Arrow x1={442} y1={154} x2={526} y2={116} stroke={warm} />
            <Arrow x1={442} y1={190} x2={526} y2={209} stroke={warm} />
            <text x="322" y="245" className="fill-ink-500 text-[12px]">
              duplicate first, customize later
            </text>
          </>
        ) : null}

        {kind === "adapter" ? (
          <>
            <Box x={74} y={138} w={132} h={82} title="old API" subtitle="legacy shape" />
            <Box x={286} y={118} w={150} h={122} title="adapter" subtitle="translates" fill="var(--diagram-box-muted)" stroke="var(--diagram-stroke-accent)" />
            <Box x={520} y={138} w={164} h={82} title="new API" subtitle="client-facing" />
            <Arrow x1={206} y1={179} x2={286} y2={179} stroke={accent} />
            <Arrow x1={436} y1={179} x2={520} y2={179} stroke={warm} />
          </>
        ) : null}

        {kind === "composite" ? (
          <>
            <Box x={314} y={38} w={132} h={54} title="root" subtitle="composite" fill="var(--diagram-box-muted)" stroke="var(--diagram-stroke-accent)" />
            <Box x={136} y={142} w={116} h={54} title="branch" />
            <Box x={314} y={142} w={132} h={54} title="branch" />
            <Box x={520} y={142} w={116} h={54} title="branch" />
            <Box x={98} y={246} w={88} h={48} title="leaf" />
            <Box x={202} y={246} w={88} h={48} title="leaf" />
            <Box x={314} y={246} w={88} h={48} title="leaf" />
            <Box x={418} y={246} w={88} h={48} title="leaf" />
            <Box x={520} y={246} w={88} h={48} title="leaf" />
            <Arrow x1={380} y1={92} x2={194} y2={142} stroke={accent} />
            <Arrow x1={380} y1={92} x2={380} y2={142} stroke={accent} />
            <Arrow x1={380} y1={92} x2={578} y2={142} stroke={accent} />
            <Arrow x1={194} y1={196} x2={142} y2={246} stroke={warm} />
            <Arrow x1={194} y1={196} x2={246} y2={246} stroke={warm} />
            <Arrow x1={380} y1={196} x2={358} y2={246} stroke={warm} />
            <Arrow x1={380} y1={196} x2={462} y2={246} stroke={warm} />
            <Arrow x1={578} y1={196} x2={564} y2={246} stroke={warm} />
          </>
        ) : null}

        {kind === "decorator" ? (
          <>
            <Box x={102} y={120} w={110} h={84} title="core" subtitle="base behavior" />
            <Box x={250} y={96} w={126} h={132} title="decorator" subtitle="extra behavior" fill="var(--diagram-box-muted)" stroke="var(--diagram-stroke-accent)" />
            <Box x={408} y={76} w={126} h={172} title="decorator" subtitle="more behavior" fill="var(--diagram-box-warm)" stroke="var(--diagram-stroke-warm)" />
            <Box x={566} y={108} w={110} h={108} title="result" subtitle="same API" />
            <Arrow x1={212} y1={162} x2={250} y2={162} stroke={accent} />
            <Arrow x1={376} y1={162} x2={408} y2={162} stroke={warm} />
            <Arrow x1={534} y1={162} x2={566} y2={162} stroke={ink} />
          </>
        ) : null}

        {kind === "proxy" ? (
          <>
            <Box x={96} y={128} w={118} h={88} title="client" />
            <Box x={276} y={104} w={134} h={136} title="proxy" subtitle="gatekeeper" fill="var(--diagram-box-muted)" stroke="var(--diagram-stroke-accent)" />
            <Box x={486} y={128} w={180} h={88} title="real subject" subtitle="lazy / secure / cached" />
            <Arrow x1={214} y1={172} x2={276} y2={172} stroke={accent} />
            <Arrow x1={410} y1={172} x2={486} y2={172} stroke={warm} />
          </>
        ) : null}

        {kind === "flyweight" ? (
          <>
            <Box x={54} y={128} w={140} h={82} title="shared core" subtitle="intrinsic state" fill="var(--diagram-box-muted)" stroke="var(--diagram-stroke-accent)" />
            <Box x={272} y={62} w={100} h={48} title="context 1" />
            <Box x={272} y={122} w={100} h={48} title="context 2" />
            <Box x={272} y={182} w={100} h={48} title="context 3" />
            <Box x={430} y={90} w={120} h={48} title="context 4" />
            <Box x={430} y={158} w={120} h={48} title="context 5" />
            <Box x={600} y={128} w={104} h={82} title="many items" subtitle="shared state reused" />
            <Arrow x1={194} y1={169} x2={272} y2={86} stroke={accent} />
            <Arrow x1={194} y1={169} x2={272} y2={146} stroke={accent} />
            <Arrow x1={194} y1={169} x2={272} y2={206} stroke={accent} />
            <Arrow x1={194} y1={169} x2={430} y2={114} stroke={accent} />
            <Arrow x1={194} y1={169} x2={430} y2={182} stroke={accent} />
            <Arrow x1={194} y1={169} x2={600} y2={169} stroke={warm} />
          </>
        ) : null}

        {kind === "chain" ? (
          <>
            <Box x={50} y={148} w={96} h={56} title="h1" />
            <Box x={178} y={148} w={96} h={56} title="h2" />
            <Box x={306} y={148} w={96} h={56} title="h3" />
            <Box x={434} y={148} w={96} h={56} title="h4" />
            <Box x={594} y={118} w={104} h={116} title="handled" subtitle="first match wins" fill="var(--diagram-box-muted)" stroke="var(--diagram-stroke-accent)" />
            <Arrow x1={146} y1={176} x2={178} y2={176} stroke={accent} />
            <Arrow x1={274} y1={176} x2={306} y2={176} stroke={accent} />
            <Arrow x1={402} y1={176} x2={434} y2={176} stroke={accent} />
            <Arrow x1={530} y1={176} x2={594} y2={176} stroke={warm} />
          </>
        ) : null}

        {kind === "state" ? (
          <>
            <Box x={308} y={124} w={144} h={82} title="context" subtitle="delegates to state" fill="var(--diagram-box-muted)" stroke="var(--diagram-stroke-accent)" />
            <Box x={118} y={72} w={100} h={52} title="draft" />
            <Box x={532} y={72} w={100} h={52} title="published" />
            <Box x={586} y={220} w={100} h={52} title="archived" />
            <Box x={98} y={220} w={100} h={52} title="review" />
            <Arrow x1={218} y1={98} x2={308} y2={150} stroke={accent} />
            <Arrow x1={452} y1={98} x2={452} y2={124} stroke={accent} />
            <Arrow x1={532} y1={124} x2={452} y2={150} stroke={warm} />
            <Arrow x1={452} y1={206} x2={636} y2={220} stroke={warm} />
            <Arrow x1={586} y1={220} x2={198} y2={246} stroke={warm} />
            <Arrow x1={198} y1={220} x2={308} y2={186} stroke={accent} />
          </>
        ) : null}

        {kind === "observer" ? (
          <>
            <Box x={314} y={118} w={132} h={88} title="subject" subtitle="publishes updates" fill="var(--diagram-box-muted)" stroke="var(--diagram-stroke-accent)" />
            <Box x={78} y={62} w={110} h={52} title="observer 1" />
            <Box x={578} y={62} w={110} h={52} title="observer 2" />
            <Box x={70} y={236} w={118} h={52} title="observer 3" />
            <Box x={572} y={236} w={118} h={52} title="observer 4" />
            <Arrow x1={314} y1={146} x2={188} y2={88} stroke={accent} />
            <Arrow x1={446} y1={146} x2={578} y2={88} stroke={accent} />
            <Arrow x1={314} y1={178} x2={188} y2={262} stroke={warm} />
            <Arrow x1={446} y1={178} x2={572} y2={262} stroke={warm} />
          </>
        ) : null}

        {kind === "strategy" ? (
          <>
            <Box x={80} y={136} w={132} h={76} title="context" subtitle="fixed flow" />
            <Box x={282} y={84} w={110} h={56} title="strategy A" />
            <Box x={282} y={150} w={110} h={56} title="strategy B" fill="var(--diagram-box-muted)" stroke="var(--diagram-stroke-accent)" />
            <Box x={282} y={216} w={110} h={56} title="strategy C" />
            <Box x={476} y={130} w={194} h={80} title="result" subtitle="same interface, different algorithm" fill="var(--diagram-box-warm)" stroke="var(--diagram-stroke-warm)" />
            <Arrow x1={212} y1={174} x2={282} y2={112} stroke={accent} />
            <Arrow x1={212} y1={174} x2={282} y2={178} stroke={accent} />
            <Arrow x1={212} y1={174} x2={282} y2={244} stroke={accent} />
            <Arrow x1={392} y1={112} x2={476} y2={170} stroke={warm} />
            <Arrow x1={392} y1={178} x2={476} y2={170} stroke={warm} />
            <Arrow x1={392} y1={244} x2={476} y2={170} stroke={warm} />
          </>
        ) : null}

        {kind === "template" ? (
          <>
            <Box x={92} y={106} w={126} h={128} title="skeleton" subtitle="fixed workflow" fill="var(--diagram-box-muted)" stroke="var(--diagram-stroke-accent)" />
            <Box x={274} y={76} w={98} h={52} title="step 1" />
            <Box x={274} y={146} w={98} h={52} title="hook" fill="var(--diagram-box-warm)" stroke="var(--diagram-stroke-warm)" />
            <Box x={274} y={216} w={98} h={52} title="step 2" />
            <Box x={430} y={106} w={124} h={128} title="subclass" subtitle="fills blanks" />
            <Box x={610} y={128} w={104} h={84} title="result" subtitle="same outline" />
            <Arrow x1={218} y1={170} x2={274} y2={102} stroke={accent} />
            <Arrow x1={218} y1={170} x2={274} y2={172} stroke={accent} />
            <Arrow x1={218} y1={170} x2={274} y2={242} stroke={accent} />
            <Arrow x1={372} y1={170} x2={430} y2={170} stroke={warm} />
            <Arrow x1={554} y1={170} x2={610} y2={170} stroke={warm} />
          </>
        ) : null}

        {kind === "locking" ? (
          <>
            <Box x={48} y={68} w={118} h={48} title="worker A" />
            <Box x={48} y={138} w={118} h={48} title="worker B" />
            <Box x={48} y={208} w={118} h={48} title="worker C" />
            <Box
              x={250}
              y={90}
              w={138}
              h={88}
              title="lock queue"
              subtitle="wait or back off"
              fill="var(--diagram-box-muted)"
              stroke="var(--diagram-stroke-accent)"
            />
            <Box
              x={440}
              y={78}
              w={138}
              h={112}
              title="critical section"
              subtitle="one holder at a time"
              fill="var(--diagram-box-warm)"
              stroke="var(--diagram-stroke-warm)"
            />
            <Box x={620} y={112} w={98} h={76} title="shared state" subtitle="hot resource" />
            <Arrow x1={166} y1={92} x2={250} y2={118} stroke={accent} />
            <Arrow x1={166} y1={162} x2={250} y2={132} stroke={accent} />
            <Arrow x1={166} y1={232} x2={250} y2={146} stroke={accent} />
            <Arrow x1={388} y1={134} x2={440} y2={134} stroke={warm} />
            <Arrow x1={578} y1={134} x2={620} y2={150} stroke={ink} />
            <text x="250" y="236" className="fill-ink-500 text-[12px]">
              shorter critical section means less waiting
            </text>
          </>
        ) : null}

        {kind === "sharding" ? (
          <>
            <Box
              x={50}
              y={120}
              w={120}
              h={92}
              title="router"
              subtitle="chooses shard"
              fill="var(--diagram-box-muted)"
              stroke="var(--diagram-stroke-accent)"
            />
            <Box x={254} y={72} w={118} h={62} title="shard A" />
            <Box x={254} y={150} w={118} h={62} title="shard B" />
            <Box x={254} y={228} w={118} h={62} title="shard C" />
            <Box x={446} y={72} w={118} h={62} title="shard D" />
            <Box x={446} y={150} w={118} h={62} title="shard E" />
            <Box x={446} y={228} w={118} h={62} title="shard F" />
            <Box
              x={628}
              y={120}
              w={92}
              h={92}
              title="hot key"
              subtitle="one tenant"
              fill="var(--diagram-box-warm)"
              stroke="var(--diagram-stroke-warm)"
            />
            <Arrow x1={170} y1={166} x2={254} y2={103} stroke={accent} />
            <Arrow x1={170} y1={166} x2={254} y2={181} stroke={accent} />
            <Arrow x1={170} y1={166} x2={254} y2={259} stroke={accent} />
            <Arrow x1={170} y1={166} x2={446} y2={103} stroke={accent} />
            <Arrow x1={170} y1={166} x2={446} y2={181} stroke={accent} />
            <Arrow x1={170} y1={166} x2={446} y2={259} stroke={accent} />
            <Arrow x1={566} y1={166} x2={628} y2={166} stroke={warm} />
            <text x="254" y="318" className="fill-ink-500 text-[12px]">
              good shard keys spread load; bad ones create hot spots
            </text>
          </>
        ) : null}

        {kind === "redis" ? (
          <>
            <Box
              x={50}
              y={132}
              w={122}
              h={76}
              title="clients"
              subtitle="app traffic"
            />
            <Box
              x={256}
              y={110}
              w={150}
              h={120}
              title="redis primary"
              subtitle="in-memory command engine"
              fill="var(--diagram-box-muted)"
              stroke="var(--diagram-stroke-accent)"
            />
            <Box x={458} y={74} w={122} h={62} title="replica 1" />
            <Box x={458} y={150} w={122} h={62} title="replica 2" />
            <Box x={458} y={226} w={122} h={62} title="replica 3" />
            <Box x={636} y={120} w={78} h={86} title="AOF / RDB" subtitle="persistence" />
            <Arrow x1={172} y1={170} x2={256} y2={170} stroke={accent} />
            <Arrow x1={406} y1={140} x2={458} y2={105} stroke={warm} />
            <Arrow x1={406} y1={170} x2={458} y2={181} stroke={warm} />
            <Arrow x1={406} y1={200} x2={458} y2={257} stroke={warm} />
            <Arrow x1={406} y1={170} x2={636} y2={163} stroke={ink} />
            <text x="256" y="260" className="fill-ink-500 text-[12px]">
              fast because the hot path stays in memory
            </text>
          </>
        ) : null}
      </svg>
    </div>
  );
}
