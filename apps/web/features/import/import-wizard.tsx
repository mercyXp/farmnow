"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { previewExcelImport, confirmExcelImport, type ImportPreview } from "@/features/import/actions";

async function fileToBase64(file: File): Promise<string> {
  const buf = await file.arrayBuffer();
  const bytes = new Uint8Array(buf);
  let binary = "";
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]!);
  return btoa(binary);
}

export function ImportWizard() {
  const [fileB64, setFileB64] = useState<string | null>(null);
  const [preview, setPreview] = useState<ImportPreview | null>(null);
  const [pending, setPending] = useState(false);

  return (
    <div className="space-y-4">
      <form
        className="space-y-3 rounded-xl border bg-card p-6"
        onSubmit={async (e) => {
          e.preventDefault();
          const file = (e.currentTarget.elements.namedItem("file") as HTMLInputElement).files?.[0];
          if (!file) return;
          setPending(true);
          const b64 = await fileToBase64(file);
          setFileB64(b64);
          const result = await previewExcelImport(b64);
          setPending(false);
          if (!result.ok) {
            toast.error(result.error);
            return;
          }
          setPreview(result.preview);
        }}
      >
        <p className="text-sm text-muted-foreground">
          Upload a FarmNow workbook. Existing document numbers are skipped, so you can re-run after a partial import.
        </p>
        <input name="file" type="file" accept=".xlsx,.xlsm" required />
        <Button type="submit" disabled={pending}>
          {pending ? "Parsing…" : "Parse & validate"}
        </Button>
      </form>
      {preview ? (
        <div className="space-y-3 rounded-xl border bg-card p-6">
          <h3 className="font-serif text-lg">Preview</h3>
          <ul className="grid gap-1 text-sm sm:grid-cols-2">
            {Object.entries(preview.counts).map(([k, v]) => (
              <li key={k}>
                {k}: {v} rows
              </li>
            ))}
          </ul>
          {preview.errors.length > 0 ? (
            <div className="text-sm text-destructive">
              {preview.errors.map((err) => (
                <p key={err}>{err}</p>
              ))}
            </div>
          ) : (
            <Button
              disabled={pending || !fileB64}
              onClick={async () => {
                if (!fileB64) return;
                setPending(true);
                const result = await confirmExcelImport(fileB64);
                setPending(false);
                if (!result.ok) toast.error(result.error);
                else toast.success(`Import complete (${Object.values(result.inserted).reduce((a, n) => a + n, 0)} new rows)`);
              }}
            >
              Confirm import
            </Button>
          )}
        </div>
      ) : null}
    </div>
  );
}
