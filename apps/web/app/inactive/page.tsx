"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/client";

export default function InactivePage() {
  const router = useRouter();
  async function signOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <Card className="max-w-md">
        <CardHeader>
          <CardTitle>Account inactive</CardTitle>
          <CardDescription>Your FarmNow account has been deactivated. Ask a Superadmin to restore access.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={signOut}>Sign out</Button>
        </CardContent>
      </Card>
    </div>
  );
}
