'use client'

import { useEffect } from 'react'
import { useServiceWorker } from '@/hooks/useServiceWorker'
import { WifiOff, RefreshCw } from 'lucide-react'

export function ServiceWorkerRegistration() {
  const { isOffline, needsUpdate, updateServiceWorker } = useServiceWorker()

  return (
    <>
      {isOffline && (
        <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-80 bg-yellow-500 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 z-50">
          <WifiOff className="w-5 h-5 flex-shrink-0" />
          <div className="flex-1">
            <p className="font-medium text-sm">离线模式</p>
            <p className="text-xs opacity-90">部分功能可能不可用</p>
          </div>
        </div>
      )}

      {needsUpdate && (
        <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-80 bg-blue-500 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 z-50">
          <RefreshCw className="w-5 h-5 flex-shrink-0" />
          <div className="flex-1">
            <p className="font-medium text-sm">有新版本可用</p>
          </div>
          <button
            onClick={updateServiceWorker}
            className="px-3 py-1 bg-white text-blue-500 rounded text-sm font-medium hover:bg-blue-50 transition-colors"
          >
            更新
          </button>
        </div>
      )}
    </>
  )
}
