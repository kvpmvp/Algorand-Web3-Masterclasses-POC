import React from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Starfield from "../components/Starfield";
import { useProjects } from "../context/ProjectContext";

const InfoBlock: React.FC<{ label: string; value?: string | React.ReactNode }> = ({ label, value }) => (
  <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
    <div className="text-white/60 text-sm mb-1">{label}</div>
    <div className="text-white leading-relaxed whitespace-pre-wrap">{value || "—"}</div>
  </div>
);

const PitchDeckPage: React.FC = () => {
  const { id } = useParams();
  const { getProject } = useProjects();
  const navigate = useNavigate();
  const p = id ? getProject(id) : undefined;

  if (!p) {
    return (
      <div className="min-h-screen relative text-white">
        <Starfield />
        <div className="mx-auto max-w-3xl px-4 py-24">
          <div className="text-xl">Project not found.</div>
          <Link to="/" className="underline">Back to projects</Link>
        </div>
      </div>
    );
  }

  const links = (p.links || "")
    .split(/\n|,/)
    .map((s) => s.trim())
    .filter(Boolean);

  return (
    <div className="min-h-screen relative text-white">
      <Starfield />
      <div className="mx-auto max-w-5xl px-4 py-12">
        <button onClick={() => navigate(-1)} className="mb-6 text-white/70 hover:text-white">← Back</button>

        <div className="flex items-center gap-4 mb-6">
          {p.logoDataUrl ? (
            <img src={p.logoDataUrl} alt="logo" className="h-16 w-16 rounded-full object-cover" />
          ) : (
            <div className="h-16 w-16 rounded-full bg-gradient-to-br from-teal-400 to-emerald-500" />
          )}
          <div>
            <h1 className="text-4xl font-extrabold">{p.name}</h1>
            <div className="text-white/60">{p.category}</div>
          </div>
        </div>

        {p.imageDataUrl && (
          <img src={p.imageDataUrl} alt="cover" className="w-full max-h-[420px] object-cover rounded-2xl mb-8" />
        )}

        <div className="grid md:grid-cols-2 gap-5">
          <InfoBlock label="Purpose" value={p.purpose} />
          <InfoBlock label="Target Market" value={p.targetMarket} />
          <InfoBlock label="Problem" value={p.problem} />
          <InfoBlock label="Solution" value={p.solution} />
          <InfoBlock label="Business Model" value={p.businessModel} />
          <InfoBlock label="Team" value={p.team} />
          <InfoBlock label="Contact" value={p.contact} />
          <InfoBlock label="Links" value={links.length ? (
            <ul className="list-disc pl-5 space-y-1">
              {links.map((href, i) => (
                <li key={i}><a href={href} target="_blank" rel="noreferrer" className="underline break-all">{href}</a></li>
              ))}
            </ul>
          ) : "—"} />
        </div>

        <div className="mt-8">
          <Link to={`/project/${p.id}/contribute`} className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-black font-semibold">Contribute</Link>
        </div>
      </div>
    </div>
  );
};

export default PitchDeckPage;
