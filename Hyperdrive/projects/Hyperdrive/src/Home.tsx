import { useWallet } from '@txnlab/use-wallet-react'
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import ConnectWallet from './components/ConnectWallet'
import Transact from './components/Transact'
import AppCalls from './components/AppCalls'
import Starfield from './components/Starfield'
import { useProjects } from "./context/ProjectContext";

interface HomeProps {}

const Home: React.FC<HomeProps> = () => {
  const [openWalletModal, setOpenWalletModal] = useState<boolean>(false)
  const [openDemoModal, setOpenDemoModal] = useState<boolean>(false)
  const [appCallsDemoModal, setAppCallsDemoModal] = useState<boolean>(false)
  const { activeAddress } = useWallet()
  const { projects } = useProjects();
  const navigate = useNavigate();

  const toggleWalletModal = () => setOpenWalletModal(!openWalletModal)
  const toggleDemoModal = () => setOpenDemoModal(!openDemoModal)
  const toggleAppCallsModal = () => setAppCallsDemoModal(!appCallsDemoModal)

  return (
    <div className="min-h-screen relative text-white">
      <Starfield />

      {/* Top nav */}
      <header className="sticky top-0 z-10 backdrop-blur-sm bg-black/30">
        <div className="mx-auto max-w-7xl px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-gradient-to-br from-teal-400 to-emerald-500" />
            <div className="font-extrabold text-2xl tracking-tight">Hyperdrive</div>
          </Link>

          <nav className="flex items-center gap-3">
            <a href="#how-it-works" className="px-3 py-2 rounded-lg hover:bg-white/10">How it works</a>
            <a href="#faq" className="px-3 py-2 rounded-lg hover:bg-white/10">FAQ</a>
            <Link to="/create" className="px-3 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-black font-semibold">Create Project</Link>

            {/* Connect Wallet button (logic preserved) */}
            <button
              data-test-id="connect-wallet"
              className="ml-2 bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-lg"
              onClick={toggleWalletModal}
            >
              Connect Wallet
            </button>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-7xl px-4 pt-16 pb-10">
        <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight mb-4">Fund innovation on <span className="text-emerald-400">Algorand</span></h1>
        <p className="text-white/80 text-lg max-w-2xl">Discover developer-led projects, dive into their pitch decks, and contribute ALGO in exchange for project tokens. Secure. Transparent. Fast.</p>
        <div className="mt-6 flex gap-3">
          <Link to="/create" className="px-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-black font-semibold">Create a Project</Link>
          {activeAddress && (
            <>
              <button data-test-id="transactions-demo" className="px-5 py-3 rounded-xl border border-white/20 hover:bg-white/10" onClick={toggleDemoModal}>Transactions Demo</button>
              <button data-test-id="appcalls-demo" className="px-5 py-3 rounded-xl border border-white/20 hover:bg-white/10" onClick={toggleAppCallsModal}>Contract Interactions</button>
            </>
          )}
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="mx-auto max-w-7xl px-4 pb-12">
        <h2 className="text-3xl font-bold mb-6">How it works</h2>
        <div className="grid sm:grid-cols-3 gap-4">
          <div className="rounded-2xl bg-white/5 border border-white/10 p-5">
            <div className="text-emerald-300 font-semibold mb-1">1 · Create</div>
            <p className="text-white/80">Developers publish a pitch deck with problem, solution, market, model, team, and links. Optional logo & cover image.</p>
          </div>
          <div className="rounded-2xl bg-white/5 border border-white/10 p-5">
            <div className="text-emerald-300 font-semibold mb-1">2 · Discover</div>
            <p className="text-white/80">Backers browse cards, open a full deck, and review details transparently on one page.</p>
          </div>
          <div className="rounded-2xl bg-white/5 border border-white/10 p-5">
            <div className="text-emerald-300 font-semibold mb-1">3 · Contribute</div>
            <p className="text-white/80">Contribute ALGO and receive project tokens via an app call (ASA distribution contract in production).</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="mx-auto max-w-7xl px-4 pb-16">
        <h2 className="text-3xl font-bold mb-6">FAQ</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="rounded-2xl bg-white/5 border border-white/10 p-5">
            <h3 className="font-semibold mb-2">Is this mainnet-ready?</h3>
            <p className="text-white/80">This is a proof of concept. The contribute flow is mocked; wire it to your Algorand app (payment + ASA distribution) for production.</p>
          </div>
          <div className="rounded-2xl bg-white/5 border border-white/10 p-5">
            <h3 className="font-semibold mb-2">What wallets are supported?</h3>
            <p className="text-white/80">Defly, Pera, Exodus on public networks, and KMD on localnet—managed by <code>use-wallet-react</code>.</p>
          </div>
          <div className="rounded-2xl bg-white/5 border border-white/10 p-5">
            <h3 className="font-semibold mb-2">Where is data stored?</h3>
            <p className="text-white/80">In this POC, pitch decks are stored in <code>localStorage</code>. Replace with your backend or on-chain indexer for persistence.</p>
          </div>
          <div className="rounded-2xl bg-white/5 border border-white/10 p-5">
            <h3 className="font-semibold mb-2">Can I upload decks or images?</h3>
            <p className="text-white/80">Yes—logo and cover images are supported. In production, move to object storage and sanitize inputs.</p>
          </div>
        </div>
      </section>

      {/* Project grid */}
      <main className="mx-auto max-w-7xl px-4 pb-24">
        {projects.length === 0 ? (
          <div className="text-white/70">No projects yet. Be the first to <Link to="/create" className="underline">create one</Link>!</div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((p) => (
              <article key={p.id} className="group rounded-2xl bg-white/5 border border-white/10 hover:border-emerald-400/60 transition p-5">
                <div className="flex items-center gap-3 mb-3">
                  {p.logoDataUrl ? (
                    <img src={p.logoDataUrl} alt="logo" className="h-10 w-10 rounded-full object-cover" />
                  ) : (
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-teal-400 to-emerald-500" />
                  )}
                  <div>
                    <h3 className="font-bold text-xl">{p.name}</h3>
                    <p className="text-white/60 text-sm">{p.category}</p>
                  </div>
                </div>
                {p.imageDataUrl && (
                  <img src={p.imageDataUrl} alt="cover" className="h-40 w-full object-cover rounded-xl mb-4" />
                )}
                <p className="text-white/80 line-clamp-3 mb-4">{p.purpose}</p>
                <div className="flex gap-3">
                  <button
                    className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20"
                    onClick={() => navigate(`/project/${p.id}`)}
                  >
                    View
                  </button>
                  <button
                    className="px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-black font-semibold"
                    onClick={() => navigate(`/project/${p.id}/contribute`)}
                  >
                    Contribute
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>

      {/* Modals from your existing setup */}
      <ConnectWallet openModal={openWalletModal} closeModal={toggleWalletModal} />
      <Transact openModal={openDemoModal} setModalState={setOpenDemoModal} />
      <AppCalls openModal={appCallsDemoModal} setModalState={setAppCallsDemoModal} />
    </div>
  )
}

export default Home
