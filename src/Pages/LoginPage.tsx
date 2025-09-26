import * as React from "react";
import { LogIn, Mail, KeyRound, Settings2 } from "lucide-react";
import { useNavigate } from "react-router-dom"; 


export type LoginFormValues = {
  email: string;
  password: string;
  role: string;
};

export type LoginPageProps = {
  title?: string;
  initialEmail?: string;
  initialPassword?: string;
  initialRole?: string;
  roles?: string[];
  onSubmit?: (values: LoginFormValues) => void;
  showDemoHint?: boolean;
  expectedPassword?: string;
};

const DEFAULT_ROLES = ["SW", "QA", "PM", "DP", "IT"];

export default function LoginPage({
  title = "Sign in",
  initialEmail = "alexandru.paval@ipsos.com",
  initialPassword = "12345",
  initialRole = "SW",
  roles = DEFAULT_ROLES,
  onSubmit,
  showDemoHint = true,
  expectedPassword = "12345",
}: LoginPageProps) {
  const [email, setEmail] = React.useState(initialEmail);
  const [password, setPassword] = React.useState(initialPassword);
  const [role, setRole] = React.useState(initialRole);
  const [error, setError] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [showPass, setShowPass] = React.useState(false);
  const navigate = useNavigate(); 

  function validate(): string | null {
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Please enter a valid email.";
    if (!password) return "Please enter your password.";
    if (expectedPassword && password !== expectedPassword) return "Invalid password. Use demo password: 12345";
    if (!role) return "Please choose a role.";
    return null;
  }

  function handleSubmit(e?: React.FormEvent) {
    e?.preventDefault?.();
    const err = validate();
    if (err) { setError(err); return; }
    setError("");
    setLoading(true);

    setTimeout(() => {
      onSubmit?.({ email, password, role });
      setLoading(false);
      navigate("/search"); // <-- Navigate after submit
    }, 250);
  }

  function handleSSO() {

    handleSubmit();
  }

  return (
    <div className="min-h-screen w-full grid place-items-center bg-gradient-to-b from-neutral-950 via-neutral-950 to-neutral-900 text-neutral-100">
      <div className="w-full max-w-md rounded-2xl border border-neutral-800 bg-neutral-900/60 p-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-blue-500 grid place-items-center font-bold">IH</div>
          <div>
            <div className="text-sm uppercase tracking-widest text-neutral-300">Ipsos Hub</div>
            <div className="text-lg font-semibold">{title}</div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3" noValidate>

          <label className="block">
            <span className="sr-only">Email</span>
            <div className="rounded-xl border border-neutral-800 bg-neutral-950/60 px-3 py-2 flex items-center gap-2">
              <Mail className="h-4 w-4 text-neutral-400"/>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@ipsos.com"
                className="w-full bg-transparent outline-none text-sm"
                autoComplete="username"
                aria-label="Email"
              />
            </div>
          </label>

          <label className="block">
            <span className="sr-only">Password</span>
            <div className="rounded-xl border border-neutral-800 bg-neutral-950/60 px-3 py-2 flex items-center gap-2">
              <KeyRound className="h-4 w-4 text-neutral-400"/>
              <input
                type={showPass ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full bg-transparent outline-none text-sm"
                autoComplete="current-password"
                aria-label="Password"
              />
              <button
                type="button"
                className="text-xs opacity-70 hover:opacity-100"
                onClick={() => setShowPass(v => !v)}
                aria-label={showPass ? "Hide password" : "Show password"}
              >
                {showPass ? "Hide" : "Show"}
              </button>
            </div>
          </label>

          <label className="block">
            <span className="sr-only">Role</span>
            <div className="rounded-xl border border-neutral-800 bg-neutral-950/60 px-3 py-2 flex items-center gap-2">
              <Settings2 className="h-4 w-4 text-neutral-400 bg-neutral-950bg"/>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="rounded-xl bg-black outline-none text-sm w-full "
                aria-label="Role"
              >
                {roles.map(r => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>
          </label>

          {error && (
            <div role="alert" className="text-xs text-red-400">{error}</div>
          )}

          <div className="grid grid-cols-1 gap-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl border border-neutral-700 px-3 py-2 hover:bg-neutral-800 flex items-center justify-center gap-2 disabled:opacity-60"
            >
              <LogIn className="h-4 w-4"/> {loading ? "Signing in…" : "Sign in"}
            </button>
            <button
              type="button"
              onClick={handleSSO}
              className="w-full rounded-xl border border-blue-700/50 bg-blue-500/10 px-3 py-2 hover:bg-blue-500/20 flex items-center justify-center gap-2"
            >
              <LogIn className="h-4 w-4"/> Continue with Ipsos Account
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
