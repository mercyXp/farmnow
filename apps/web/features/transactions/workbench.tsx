"use client";

import { cloneElement, useState, type ReactElement } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { DataTable, type DataColumn } from "@/components/data-table";
import { deactivateEntry } from "@/features/transactions/actions";
import type { DeactivateEntry } from "@farmnow/domain";

export function RecordWorkbench<T extends { id: string }>({
  children,
  rows,
  columns,
  canRecord,
  canMutate,
  emptyTitle,
  emptyDescription,
  deleteTable,
}: {
  children: ReactElement;
  rows: T[];
  columns: DataColumn<T>[];
  canRecord: boolean;
  canMutate: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  deleteTable: DeactivateEntry["table"];
}) {
  const [editing, setEditing] = useState<T | null>(null);
  const router = useRouter();
  const [pendingId, setPendingId] = useState<string | null>(null);
  const showForm = (canRecord && !editing) || (canMutate && editing);

  return (
    <div className="space-y-8">
      {showForm ? (
        <div className="space-y-2">
          {editing ? (
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">Editing an existing entry. Historical changes are audited.</p>
              <Button type="button" variant="outline" size="sm" onClick={() => setEditing(null)}>
                Cancel edit
              </Button>
            </div>
          ) : null}
          <div key={editing?.id ?? "create"}>
            {cloneElement(children as ReactElement<{ initial?: T }>, { initial: editing ?? undefined })}
          </div>
        </div>
      ) : null}
      <DataTable
        columns={columns}
        rows={rows}
        rowKeyField="id"
        emptyTitle={emptyTitle}
        emptyDescription={emptyDescription}
        actions={
          canMutate
            ? (row) => (
                <div className="flex gap-2">
                  <Button type="button" size="sm" variant="outline" onClick={() => setEditing(row)}>
                    Edit
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    disabled={pendingId === row.id}
                    onClick={async () => {
                      if (!confirm("Deactivate this entry? It will no longer count in KPIs or stock.")) return;
                      setPendingId(row.id);
                      const result = await deactivateEntry({ table: deleteTable, id: row.id });
                      setPendingId(null);
                      if (!result.ok) {
                        toast.error(result.error);
                        return;
                      }
                      toast.success("Entry deactivated");
                      if (editing?.id === row.id) setEditing(null);
                      router.refresh();
                    }}
                  >
                    Delete
                  </Button>
                </div>
              )
            : undefined
        }
      />
    </div>
  );
}
