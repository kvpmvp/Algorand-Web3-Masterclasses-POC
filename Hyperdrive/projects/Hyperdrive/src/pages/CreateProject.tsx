import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Starfield from "../components/Starfield";
import { useProjects } from "../context/ProjectContext";

const inputBase = "w-full rounded-xl bg-white/5 border border-white/10 focus:border-emerald-400 focus:ring-0 px-4 py-3 placeholder-white/40 text-white";

const CreateProject: React.FC = () => {
  const { addProject } = useProjects();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    category: "",
    purpose: "",
    problem: "",
    solution: "",
    targetMarket: "",
    businessModel: "",
    team: "",
    contact: "",
    links: "",
  });
  const [logoDataUrl, setLogoDataUrl] = useState<string | undefined>();
  const [imageDataUrl, setImageDataUrl] = useState<string | undefined>();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleFile = (file: File, setter: (v: string) => void) => {
    const reader = new FileReader();
    reader.onload = () => setter(reader.result as string);
    reader.readAsDataURL(file);
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const id = addProject({ ...form, logoDataUrl, imageDataUrl });
    navigate(`/project/${id}`);
  };

  return (
    <div className="min-h-screen relative text-white">
      <Starfield />
      <div className="mx-auto max-w-3xl px-4 py-16">
        <h1 className="text-4xl font-extrabold mb-6">Create Project</h1>
        <form onSubmit={onSubmit} className="space-y-5">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block mb-2 text-white/80">Project name</label>
              <input className={inputBase} name="name" value={form.name} onChange={handleChange} required />
            </div>
            <div>
              <label className="block mb-2 text-white/80">Category</label>
              <input className={inputBase} name="category" value={form.category} onChange={handleChange} required />
            </div>
          </div>

          <div>
            <label className="block mb-2 text-white/80">Purpose (short blurb)</label>
            <input className={inputBase} name="purpose" value={form.purpose} onChange={handleChange} required />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block mb-2 text-white/80">Problem</label>
              <textarea className={inputBase} name="problem" value={form.problem} onChange={handleChange} rows={4} required />
            </div>
            <div>
              <label className="block mb-2 text-white/80">Solution</label>
              <textarea className={inputBase} name="solution" value={form.solution} onChange={handleChange} rows={4} required />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block mb-2 text-white/80">Target market</label>
              <textarea className={inputBase} name="targetMarket" value={form.targetMarket} onChange={handleChange} rows={3} required />
            </div>
            <div>
              <label className="block mb-2 text-white/80">Business model</label>
              <textarea className={inputBase} name="businessModel" value={form.businessModel} onChange={handleChange} rows={3} required />
            </div>
          </div>

          <div>
            <label className="block mb-2 text-white/80">Team</label>
            <textarea className={inputBase} name="team" value={form.team} onChange={handleChange} rows={4} required />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block mb-2 text-white/80">Contact info</label>
              <input className={inputBase} name="contact" value={form.contact} onChange={handleChange} placeholder="email, Telegram, etc." required />
            </div>
            <div>
              <label className="block mb-2 text-white/80">Relevant links</label>
              <input className={inputBase} name="links" value={form.links} onChange={handleChange} placeholder="comma or newline separated" />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block mb-2 text-white/80">Logo (optional)</label>
              <input type="file" accept="image/*" className="block w-full text-white" onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0], (d) => setLogoDataUrl(d))} />
              {logoDataUrl && <img src={logoDataUrl} alt="logo preview" className="h-16 mt-2 rounded" />}
            </div>
            <div>
              <label className="block mb-2 text-white/80">Project image (optional)</label>
              <input type="file" accept="image/*" className="block w-full text-white" onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0], (d) => setImageDataUrl(d))} />
              {imageDataUrl && <img src={imageDataUrl} alt="image preview" className="h-24 mt-2 rounded" />}
            </div>
          </div>

          <div className="pt-4 flex gap-3">
            <button type="submit" className="px-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-black font-semibold">Publish</button>
            <button type="button" onClick={() => navigate(-1)} className="px-5 py-3 rounded-xl border border-white/20 hover:bg-white/10">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProject;
