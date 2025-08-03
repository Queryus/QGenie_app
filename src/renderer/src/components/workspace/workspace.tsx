import { DbSchemaPanel } from './db-schema-panel'
import { AiChatPanel } from './ai-chat-panel'
import { QueryPanel } from './query-panel'

const WorkSpace = (): React.JSX.Element => {
  return (
    <main className="flex flex-1 h-full bg-zinc-900 pt-2 pr-2 pb-2">
      {/* DB Schema Panel (Left) */}
      <DbSchemaPanel />

      {/* Main Content (Center & Right) */}
      <div className="flex flex-1 h-full ml-2 gap-2">
        {/* AI Chat Panel (Center) */}
        <AiChatPanel />

        {/* Query & Results Panel (Right) */}
        <QueryPanel />
      </div>
    </main>
  )
}

export default WorkSpace
