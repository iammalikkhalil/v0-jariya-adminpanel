"use client"

import { useEffect, useState } from "react"
import { AuthGuard } from "@/components/auth-guard"
import { AdminLayout } from "@/components/admin-layout"
import { getQuranPage, deleteQuranLine, getLastQuranLine, type QuranLine } from "@/lib/api/quran"
import { QuranTable } from "@/components/quran-table"

export default function QuranPage() {
  const [lines, setLines] = useState<QuranLine[]>([])
  const [pageNumber, setPageNumber] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | undefined>(undefined)
  const [inputPage, setInputPage] = useState<string>("1")
  const [lastLine, setLastLine] = useState<QuranLine | null>(null)

  // Fetch page lines
  const fetchLines = async (page: number) => {
    setIsLoading(true)
    setError(undefined)
    try {
      const res = await getQuranPage(page)
      if (res.success && res.data) setLines(res.data)
      else setLines([])
    } catch (err: any) {
      setError("Network error occurred")
      setLines([])
    } finally {
      setIsLoading(false)
    }
  }

  // Fetch last line
  useEffect(() => {
    async function fetchLastLine() {
      try {
        const res = await getLastQuranLine()
        if (res.success && res.data) setLastLine(res.data)
      } catch (err) {
        console.error("Failed to fetch last Quran line", err)
      }
    }
    fetchLastLine()
  }, [])

  useEffect(() => {
    fetchLines(pageNumber)
  }, [pageNumber])

  const handleDeleteLine = (line: QuranLine) => {
    setLines((prev) => prev.filter((l) => l.lineNumber !== line.lineNumber))
  }

  const handleRefresh = () => fetchLines(pageNumber)

  const handlePageInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputPage(e.target.value)
  }

  const handleGoToPage = () => {
    const page = Number(inputPage)
    if (!isNaN(page) && page > 0) setPageNumber(page)
  }

  const goToLastLinePage = () => {
    if (lastLine) setPageNumber(lastLine.pageNumber)
  }

  return (
    <AuthGuard>
      <AdminLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-islamic text-primary mb-2">Quran Lines</h1>
            <p className="text-muted-foreground">Manage your Quran lines</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-card border rounded-lg p-4 flex flex-col justify-between">
              <div className="text-2xl font-bold text-primary">{lines.length}</div>
              <div className="text-xs text-muted-foreground">Lines on Page {pageNumber}</div>
            </div>

            {lastLine && (
              <div
                className="bg-card border rounded-lg p-4 flex flex-col justify-between cursor-pointer hover:bg-primary/10 transition"
                onClick={goToLastLinePage}
              >
                <div className="text-2xl font-bold text-primary">{lastLine.lineNumber}</div>
                <div className="text-xs text-muted-foreground">
                  Last Line (Page {lastLine.pageNumber})
                </div>
                <div className="text-sm mt-2 font-arabic truncate">{lastLine.textAr}</div>
              </div>
            )}

            {/* Page Input */}
            <div className="bg-card border rounded-lg p-4 flex items-center space-x-2">
              <input
                type="number"
                value={inputPage}
                onChange={handlePageInputChange}
                className="border border-gray-300 rounded px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-primary"
                min={1}
              />
              <button
                onClick={handleGoToPage}
                className="bg-primary text-white px-3 py-1 rounded hover:bg-primary/90"
              >
                Go
              </button>
            </div>
          </div>

          {/* Quran Table */}
          <QuranTable
            lines={lines}
            pageNumber={pageNumber}
            setPageNumber={setPageNumber}
            onLineDeleted={handleDeleteLine}
            onRefresh={handleRefresh}
            isLoading={isLoading}
            error={error}
          />
        </div>
      </AdminLayout>
    </AuthGuard>
  )
}