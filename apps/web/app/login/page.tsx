import { LoginForm } from "./login-form";

export default function LoginPage() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,#1f4d32,transparent_45%),radial-gradient(circle_at_bottom_right,#c46a2b,transparent_40%)] opacity-20" />
      <div className="relative space-y-6">
        <div className="text-center">
          <p className="text-sm uppercase tracking-[0.2em] text-primary">FarmNow Limited</p>
          <h1 className="mt-2 font-serif text-4xl">Broiler Farm ERP</h1>
          <p className="mt-2 text-sm text-muted-foreground">Lusaka, Zambia</p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
