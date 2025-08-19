interface QueryEditorProps {
  query: string
  setQuery: (query: string) => void
}

/**
 * @author nahyeongjin1
 * @summary 쿼리 편집기 패널
 * @returns JSX.Element
 */
export default function QueryEditor({ query, setQuery }: QueryEditorProps): React.JSX.Element {
  return (
    <div className="h-full p-5">
      <textarea
        name="query"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full h-full bg-transparent text-genie-100 font-code text-code resize-none focus:outline-none"
        spellCheck="false"
      />
    </div>
  )
}
