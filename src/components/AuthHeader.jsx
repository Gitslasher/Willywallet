import { ShieldCheck } from "lucide-react";

export default function AuthHeader() {
  return (
    <div className="flex items-center gap-3">
      <div className="h-10 w-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-md">
        <ShieldCheck className="h-6 w-6" />
      </div>
      <div>
        <h1 className="text-2xl font-semibold leading-tight">Monarch Money</h1>
        <p className="text-sm text-muted-foreground">Sign in to your dashboard</p>
      </div>
    </div>
  );
}
