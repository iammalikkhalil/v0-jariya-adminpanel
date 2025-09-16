"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { updateQuranLine } from "@/lib/api/quran"

interface Props {
  line: {
    pageNumber: number
    lineNumber: number
    textAr: string
  }
  mode: "edit" | "create"
}

export function QuranLineForm({ line, mode }: Props) {
  const [form, setForm] = useState({ textAr: line.textAr })
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)
    try {
      await updateQuranLine({
        pageNumber: line.pageNumber,
        lineNumber: line.lineNumber,
        textAr: form.textAr,
      })
      router.push("/admin/quran")
    } catch (err: any) {
      setError(err.message || "Failed to update line")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="bg-white shadow-md rounded-lg p-6 max-w-xl mx-auto border border-gray-200">
      <h2 className="text-2xl font-islamic text-primary mb-4">
        {mode === "edit" ? "Edit Quran Line" : "Add Quran Line"}
      </h2>
      <p className="text-muted-foreground mb-6">
        {mode === "edit"
          ? "Update the Arabic text for this Quran line."
          : "Add a new Quran line with its Arabic text."}
      </p>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="flex flex-col">
          <label htmlFor="textAr" className="mb-2 font-medium text-gray-700">
            Text (Arabic)
          </label>
          <textarea
            id="textAr"
            name="textAr"
            value={form.textAr}
            onChange={handleChange}
            required
            rows={4}
            className="border border-gray-300 rounded-lg px-3 py-2 w-full resize-none
                       focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition"
          />
        </div>

        {error && <p className="text-red-600 font-medium">{error}</p>}

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-primary text-white font-semibold px-5 py-2 rounded-lg
                       hover:bg-primary/90 active:bg-primary/80 disabled:opacity-50 transition"
          >
            {isSubmitting
              ? mode === "edit"
                ? "Updating..."
                : "Adding..."
              : mode === "edit"
              ? "Update Line"
              : "Add Line"}
          </button>
        </div>
      </form>
    </div>
  )
}