"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AuthGuard } from "@/components/auth-guard";
import { AdminLayout } from "@/components/admin-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { getLastQuranLine, addQuranLine } from "@/lib/api/quran";

interface QuranLine {
  pageNumber: number;
  lineNumber: number;
  textAr: string;
}

export default function AddQuranLinePage() {
  const router = useRouter();
  const [lastLine, setLastLine] = useState<QuranLine | null>(null);
  const [form, setForm] = useState({ pageNumber: "", lineNumber: "", textAr: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchLastLine() {
      try {
        const res = await getLastQuranLine();
        if (res.success && res.data) setLastLine(res.data);
      } catch (err) {
        console.error("Failed to fetch last Quran line", err);
      }
    }
    fetchLastLine();
  }, []);

  const handleChange = (field: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await addQuranLine({
        pageNumber: Number(form.pageNumber),
        lineNumber: Number(form.lineNumber),
        textAr: form.textAr,
      });
    } catch (err: any) {
      setError(err.message || "Failed to add Quran line");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthGuard>
      <AdminLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-islamic text-primary mb-2">Add Quran Line</h1>
            <p className="text-muted-foreground">Insert a new line of the Quran with context reference</p>
          </div>

          {lastLine && (
            <Card className="bg-gray-50 border">
              <CardContent>
                <div className="font-semibold">Last Line Added:</div>
                <div className="mb-1">Page: {lastLine.pageNumber}, Line: {lastLine.lineNumber}</div>
                <div className="text-lg font-islamic">{lastLine.textAr}</div>
              </CardContent>
            </Card>
          )}

          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="font-islamic">New Quran Line</CardTitle>
              <CardDescription>Fill in the details for the new Quran line</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <Label htmlFor="pageNumber">Page Number</Label>
                  <Input
                    id="pageNumber"
                    type="number"
                    required
                    value={form.pageNumber}
                    onChange={(e) => handleChange("pageNumber", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lineNumber">Line Number</Label>
                  <Input
                    id="lineNumber"
                    type="number"
                    required
                    value={form.lineNumber}
                    onChange={(e) => handleChange("lineNumber", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="textAr">Text (Arabic)</Label>
                  <Textarea
                    id="textAr"
                    required
                    value={form.textAr}
                    onChange={(e) => handleChange("textAr", e.target.value)}
                    rows={3}
                    className="font-islamic text-right"
                    dir="rtl"
                  />
                </div>

                <div className="flex gap-4 pt-2">
                  <Button type="submit" disabled={loading}>
                    {loading ? "Adding..." : "Add Line"}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => router.push("/admin/quran")} disabled={loading}>
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </AdminLayout>
    </AuthGuard>
  );
}