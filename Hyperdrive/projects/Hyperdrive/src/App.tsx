import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { SnackbarProvider } from 'notistack'
import {
  SupportedWallet,
  WalletId,
  WalletManager,
  WalletProvider,
} from '@txnlab/use-wallet-react'

import { ProjectProvider } from './context/ProjectContext'

// NOTE: adjust this import if your Home lives at ./components/Home
import Home from './Home' // or: import Home from './components/Home'

import CreateProject from './pages/CreateProject'
import PitchDeckPage from './pages/PitchDeckPage'
import Contribute from './pages/Contribute'

import {
  getAlgodConfigFromViteEnvironment,
  getKmdConfigFromViteEnvironment,
} from './utils/network/getAlgoClientConfigs'

// --- existing wallet config (unchanged) ---
let supportedWallets: SupportedWallet[]
if (import.meta.env.VITE_ALGOD_NETWORK === 'localnet') {
  const kmdConfig = getKmdConfigFromViteEnvironment()
  supportedWallets = [
    {
      id: WalletId.KMD,
      options: {
        baseServer: kmdConfig.server,
        token: String(kmdConfig.token),
        port: String(kmdConfig.port),
      },
    },
  ]
} else {
  supportedWallets = [
    { id: WalletId.DEFLY },
    { id: WalletId.PERA },
    { id: WalletId.EXODUS },
    // If you are interested in WalletConnect v2 provider
    // refer to https://github.com/TxnLab/use-wallet for detailed integration instructions
  ]
}

export default function App() {
  const algodConfig = getAlgodConfigFromViteEnvironment()

  const walletManager = new WalletManager({
    wallets: supportedWallets,
    defaultNetwork: algodConfig.network,
    networks: {
      [algodConfig.network]: {
        algod: {
          baseServer: algodConfig.server,
          port: algodConfig.port,
          token: String(algodConfig.token),
        },
      },
    },
    options: {
      resetNetwork: true,
    },
  })

  return (
    <SnackbarProvider maxSnack={3}>
      <WalletProvider manager={walletManager}>
        <BrowserRouter>
          <ProjectProvider>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/create" element={<CreateProject />} />
              <Route path="/project/:id" element={<PitchDeckPage />} />
              <Route path="/project/:id/contribute" element={<Contribute />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </ProjectProvider>
        </BrowserRouter>
      </WalletProvider>
    </SnackbarProvider>
  )
}