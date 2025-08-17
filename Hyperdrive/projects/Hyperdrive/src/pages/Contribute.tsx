import React, { useState } from "react";
import { useParams } from "react-router-dom";
import Starfield from "../components/Starfield";
import { useProjects } from "../context/ProjectContext";
import { useWallet } from "@txnlab/use-wallet-react";

const Contribute: React.FC = () => {
  const { id } = useParams();
  const { getProject } = useProjects();
  const project = id ? getProject(id) : undefined;
  const { activeAddress } = useWallet();
  const [amount, setAmount] = useState<string>("");
  const [note, setNote] = useState<string>("");
  const [status, setStatus] = useState<string>("");

  const handleContribute = async () => {
    // TODO: integrate Algorand payment + ASA distribution via smart contract (app call).
    // For now, just mock a success.
    if (!amount) return setStatus("Enter an amount in ALGO.");
    setStatus("Preparing transaction (mock)…");
    setTimeout(() => setStatus("Success! (mock) – integrate Algorand tx + token mint/transfer here."), 600);
  };

  if (!project) {
    return (
      <div className="min-h-screen relative text-white"><Starfield /><div className="px-4 py-24">Project not found.</div></div>
    );
  }

  return (
    <div className="min-h-screen relative text-white">
      <Starfield />
      <div className="mx-auto max-w-xl px-4 py-16">
        <h1 className="text-3xl font-extrabold mb-2">Contribute to {project.name}</h1>
        <p className="text-white/70 mb-6">Send ALGO to support the project and receive project tokens per the developer's terms.</p>

        <div className="space-y-4">
          <div>
            <label className="block mb-2 text-white/80">Your wallet</label>
            <div className="rounded-xl bg-white/5 border border-white/10 px-4 py-3">
              {activeAddress ? (
                <code className="break-all">{activeAddress}</code>
              ) : (
                <span className="text-white/60">Not connected — use the Connect Wallet button on the home page.</span>
              )}
            </div>
          </div>

          <div>
            <label className="block mb-2 text-white/80">Amount (ALGO)</label>
            <input type="number" min="0" step="0.1" value={amount} onChange={(e) => setAmount(e.target.value)} className="w-full rounded-xl bg-white/5 border border-white/10 focus:border-emerald-400 focus:ring-0 px-4 py-3 text-white" placeholder="e.g., 10" />
          </div>

          <div>
            <label className="block mb-2 text-white/80">Note (optional)</label>
            <input value={note} onChange={(e) => setNote(e.target.value)} className="w-full rounded-xl bg-white/5 border border-white/10 focus:border-emerald-400 focus:ring-0 px-4 py-3 text-white" placeholder="say thanks or add a memo" />
          </div>

          <button onClick={handleContribute} className="w-full px-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-black font-semibold">Send Contribution</button>

          {status && <div className="text-emerald-300 text-sm">{status}</div>}

          <div className="text-white/60 text-sm pt-2">
            <strong>Heads up:</strong> a smart contract will likely be required to escrow ALGO and deliver ASA project tokens to the contributor. You can wire this button to your App Call flow.
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contribute;
