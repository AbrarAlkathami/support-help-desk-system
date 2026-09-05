import LoginForm from "@/features/auth/components/login-form";
function LoginPage() {
  return (
    <main>
      <main className="flex min-h-screen items-center justify-center bg-muted/40 px-4">
        <section className="w-full max-w-md rounded-xl border bg-background p-8 shadow-sm">
          <header className="mb-8">
            <h1 className="text-2xl font-semibold">Support Help Desk</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Sign in to continue
            </p>
          </header>
          <LoginForm />
        </section>
      </main>
    </main>
  );
}

export default LoginPage;
