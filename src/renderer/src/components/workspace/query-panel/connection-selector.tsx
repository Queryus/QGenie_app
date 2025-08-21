import React from 'react'
import { ConnectionProfile } from '../../../types/database'
import { ChevronDown } from 'lucide-react'

interface ConnectionSelectorProps {
  connections: ConnectionProfile[]
  activeConnection: ConnectionProfile | null
  setActiveConnection: (connection: ConnectionProfile | null) => void
}

const ConnectionSelector: React.FC<ConnectionSelectorProps> = ({
  connections,
  activeConnection,
  setActiveConnection
}) => {
  const handleSelectionChange = (event: React.ChangeEvent<HTMLSelectElement>): void => {
    const selectedId = event.target.value
    const selectedConnection = connections.find((c) => c.id === selectedId) || null
    console.log('[ConnectionSelector] DB 연결 변경:', selectedConnection)
    setActiveConnection(selectedConnection)
  }

  return (
    <div className="relative inline-flex items-center">
      <select
        value={activeConnection?.id || ''}
        onChange={handleSelectionChange}
        className="appearance-none bg-neutral-700 border border-neutral-600 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 pr-8"
        disabled={connections.length === 0}
      >
        {connections.length === 0 ? (
          <option>연결 없음</option>
        ) : (
          connections.map((connection) => (
            <option key={connection.id} value={connection.id}>
              {connection.view_name || connection.name || connection.id}
            </option>
          ))
        )}
      </select>
      <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
    </div>
  )
}

export default ConnectionSelector
