import React from 'react'

type AppCallsProps = {
  openModal: boolean
  setModalState: React.Dispatch<React.SetStateAction<boolean>>
}

const AppCalls: React.FC<AppCallsProps> = ({ openModal, setModalState }) => {
  if (!openModal) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
        <div className="mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Contract Interactions (Demo)</h2>
          <p className="text-sm text-gray-600">
            Wire these actions to your Algorand app calls (opt-in, call, close-out, etc.).
          </p>
        </div>

        <div className="space-y-3">
          <button
            className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-800 hover:bg-gray-50"
            onClick={() => alert('Stub: opt-in ASA / app')}
          >
            Opt-in (stub)
          </button>
          <button
            className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-800 hover:bg-gray-50"
            onClick={() => alert('Stub: application call')}
          >
            Application Call (stub)
          </button>
          <button
            className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-800 hover:bg-gray-50"
            onClick={() => alert('Stub: close-out')}
          >
            Close-out (stub)
          </button>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            className="rounded-lg bg-gray-900 px-4 py-2 text-white hover:bg-gray-800"
            onClick={() => setModalState(false)}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

export default AppCalls
