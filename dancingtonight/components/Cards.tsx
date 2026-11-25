import Link from "next/link";
import type { Festival, RecurringSocial, School, Source } from "@/lib/types";
import { formatDateRange, genreLabel } from "@/lib/data";

function SourceLine({ source }: { source: Source }) {
  return (
    <p className="source">
      <a href={source.url} target="_blank" rel="noopener nofollow">
        {source.label}
      </a>
      {" · "}
      {source.kind === "organizer" ? "Confirmed by organizer" : "Not yet confirmed by organizer"}
      {" · "}
      Last checked {source.checkedOn}
    </p>
  );
}

function Genres({ genres }: { genres: string[] }) {
  return (
    <div className="chips">
      {genres.map((g) => (
        <span key={g} className={`chip chip-${g}`}>
          {genreLabel(g as never)}
        </span>
      ))}
    </div>
  );
}

export function SocialCard({ s }: { s: RecurringSocial }) {
  const time = s.startTime ? `${s.startTime}${s.endTime ? ` to ${s.endTime}` : ""}` : "Time not listed";
  return (
    <article className="card">
      <div className="card-head">
        <h3>{s.name}</h3>
        <span className="time">{time}</span>
      </div>
      <p className="meta">
        {s.venue}
        {s.area ? `, ${s.area}` : ""}
        {s.price ? ` · ${s.price}` : ""}
      </p>
      <Genres genres={s.genres} />
      {s.note && <p className="note">{s.note}</p>}
      <SourceLine source={s.source} />
    </article>
  );
}

export function SchoolCard({ s }: { s: School }) {
  return (
    <article className="card">
      <h3>{s.name}</h3>
      <p className="meta">
        {s.area ?? ""}
        {s.schedule ? `${s.area ? " · " : ""}${s.schedule}` : ""}
        {s.price ? ` · ${s.price}` : ""}
      </p>
      <Genres genres={s.genres} />
      <SourceLine source={s.source} />
    </article>
  );
}

export function FestivalCard({ f }: { f: Festival }) {
  return (
    <article className="card">
      <div className="card-head">
        <h3>{f.name}</h3>
        <span className="time">{formatDateRange(f.startDate, f.endDate)}</span>
      </div>
      <p className="meta">
        {f.citySlug ? <Link href={`/city/${f.citySlug}`}>{f.city}</Link> : f.city}, {f.country}
      </p>
      <Genres genres={f.genres} />
      <SourceLine source={f.source} />
    </article>
  );
}
