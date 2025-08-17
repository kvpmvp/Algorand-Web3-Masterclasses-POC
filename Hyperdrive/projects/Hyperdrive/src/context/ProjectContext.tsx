import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { nanoid } from "nanoid";

export type Project = {
  id: string;
  name: string;
  category: string;
  purpose: string;
  problem: string;
  solution: string;
  targetMarket: string;
  businessModel: string;
  team: string;
  contact: string;
  links: string; // newline or comma-separated
  logoDataUrl?: string;
  imageDataUrl?: string;
  createdAt: string;
};

type ProjectContextType = {
  projects: Project[];
  addProject: (p: Omit<Project, "id" | "createdAt">) => string; // returns id
  getProject: (id: string) => Project | undefined;
};

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

const STORAGE_KEY = "algocrowd_projects_v1";

// Helper: simple SVG placeholder generators (lightweight, inline)
const svgLogo = (text: string, from = "#34d399", to = "#06b6d4") =>
  `data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='128' height='128'>
      <defs>
        <linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>
          <stop offset='0%' stop-color='${from}'/>
          <stop offset='100%' stop-color='${to}'/>
        </linearGradient>
      </defs>
      <rect width='100%' height='100%' rx='24' fill='url(#g)'/>
      <text x='50%' y='55%' dominant-baseline='middle' text-anchor='middle' font-family='Inter,Arial' font-size='56' fill='white' font-weight='700'>${text}</text>
    </svg>`
  )}`;

const svgBanner = (title: string) =>
  `data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='1200' height='480'>
      <defs>
        <linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>
          <stop offset='0%' stop-color='#0ea5e9'/>
          <stop offset='100%' stop-color='#10b981'/>
        </linearGradient>
      </defs>
      <rect width='100%' height='100%' fill='url(#g)'/>
      <text x='50%' y='55%' dominant-baseline='middle' text-anchor='middle' font-family='Inter,Arial' font-size='64' fill='white' font-weight='800'>${title}</text>
    </svg>`
  )}`;

const sampleProjects = (): Project[] => {
  const now = new Date().toISOString();
  const mk = (
    name: string,
    category: string,
    purpose: string,
    problem: string,
    solution: string,
    targetMarket: string,
    businessModel: string,
    team: string,
    contact: string,
    links: string
  ): Project => ({
    id: nanoid(),
    name,
    category,
    purpose,
    problem,
    solution,
    targetMarket,
    businessModel,
    team,
    contact,
    links,
    logoDataUrl: svgLogo(name.split(" ").map((w) => w[0]).slice(0,2).join("").toUpperCase()),
    imageDataUrl: svgBanner(name),
    createdAt: now,
  });

  return [
    mk(
      "MasterPass",
      "Events / Ticketing",
      "A simple event access platform on Algorand.",
      "Event organizers struggle with fraud and high fees; users juggle multiple QR apps.",
      "Algorand-backed passes with on-chain ownership and instant settlement.",
      "Event organizers, venues, and promoters.",
      "Service fee per ticket + enterprise API tier.",
      "Core team of 3 (product, contracts, BD). Advisors from ticketing.",
      "hello@masterpass.dev",
      "https://masterpass.dev, https://twitter.com/masterpass"
    ),
    mk(
      "ChainLearn",
      "EdTech",
      "Earn-as-you-learn courses with verifiable certificates.",
      "Certificates are hard to verify; learners can't monetize progress.",
      "On-chain credentials and micro-rewards via ASA.",
      "Bootcamps, MOOCs, and corporate L&D.",
      "Freemium content + issuer subscriptions.",
      "Team of 4 educators + 2 engineers.",
      "team@chainlearn.io",
      "https://chainlearn.io"
    ),
    mk(
      "GreenCompute",
      "Sustainability",
      "Crowdfund green compute nodes with transparent impact.",
      "Hard to trust carbon claims from infra providers.",
      "Proof-of-green attestations anchored on Algorand.",
      "Web3 infra funds, climate DAOs, eco-conscious devs.",
      "Node revenue share + tokenized credits.",
      "Ops + climate scientists + devs.",
      "hi@greencompute.xyz",
      "https://greencompute.xyz"
    ),
    mk(
      "AlgoArt Guild",
      "Creator Economy",
      "Collective funding for artist toolchains.",
      "Artists lack upfront capital for tools and marketing.",
      "Milestone-based releases with escrowed ALGO and ASA rewards.",
      "Digital artists, small studios.",
      "Platform fee + marketplace revenue share.",
      "Artists council, 2 engineers, 1 PM.",
      "contact@algoartguild.app",
      "https://algoartguild.app"
    ),
    mk(
      "OpenLedger Tools",
      "DevTooling",
      "Open-source SDKs for Algorand integrations.",
      "Fragmented tooling slows adoption.",
      "Unified, audited libs with example apps.",
      "Startups, agencies, hackathon teams.",
      "Sponsorware + support contracts.",
      "OSS maintainers + security advisors.",
      "oss@openledgertools.org",
      "https://openledgertools.org"
    ),
  ];
};

export const ProjectProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [projects, setProjects] = useState<Project[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw) as Project[];
      // Seed only when empty
      return sampleProjects();
    } catch {
      return sampleProjects();
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
  }, [projects]);

  const addProject: ProjectContextType["addProject"] = (p) => {
    const id = nanoid();
    const entry: Project = { id, createdAt: new Date().toISOString(), ...p };
    setProjects((prev) => [entry, ...prev]);
    return id;
  };

  const getProject = (id: string) => projects.find((p) => p.id === id);

  const value = useMemo(() => ({ projects, addProject, getProject }), [projects]);
  return <ProjectContext.Provider value={value}>{children}</ProjectContext.Provider>;
};

export const useProjects = () => {
  const ctx = useContext(ProjectContext);
  if (!ctx) throw new Error("useProjects must be used within ProjectProvider");
  return ctx;
};
