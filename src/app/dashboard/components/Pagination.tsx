interface PaginationProps {
  page: number
  total: number
  limit: number
  onPageChange: (page: number) => void
}

export default function Pagination({ page, total, limit, onPageChange }: PaginationProps) {
  return (
    <div className="mt-4 flex items-center justify-between">
      <button
        className="rounded bg-gray-100 px-4 py-2 text-sm disabled:opacity-50"
        onClick={() => onPageChange(Math.max(1, page - 1))}
        disabled={page === 1}
      >
        Previous
      </button>
      <span className="text-sm text-gray-500">
        Page {page} of {Math.ceil(total / limit)}
      </span>
      <button
        className="rounded bg-gray-100 px-4 py-2 text-sm disabled:opacity-50"
        onClick={() => onPageChange(page + 1)}
        disabled={page >= Math.ceil(total / limit)}
      >
        Next
      </button>
    </div>
  )
}
