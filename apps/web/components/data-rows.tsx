import { EmptyState } from "@/components/page-header";
import { Table, TBody, TD, TH, THead, TR } from "@/components/ui/table";

export function DataRows({ headers, rows, emptyTitle }: { headers: string[]; rows: string[][]; emptyTitle?: string }) {
  if (rows.length === 0) {
    return <EmptyState title={emptyTitle ?? "No records yet."} description="Save an entry to populate this list." />;
  }
  return (
    <div className="overflow-hidden rounded-xl border bg-card">
      <Table>
        <THead>
          <TR>
            {headers.map((h) => (
              <TH key={h}>{h}</TH>
            ))}
          </TR>
        </THead>
        <TBody>
          {rows.map((row, i) => (
            <TR key={i}>
              {row.map((c, j) => (
                <TD key={j}>{c}</TD>
              ))}
            </TR>
          ))}
        </TBody>
      </Table>
    </div>
  );
}
