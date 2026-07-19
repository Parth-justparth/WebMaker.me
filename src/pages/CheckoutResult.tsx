import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CheckoutSuccess() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");

  useEffect(() => {
    // After 5 seconds, redirect to projects
    const timer = setTimeout(() => navigate("/projects"), 5000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 relative overflow-hidden">
      {/* Ambient background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-emerald-500/[0.06] rounded-full blur-[120px]" />
      </div>

      <div className="max-w-md w-full text-center space-y-6 animate-fade-in relative">
        <div className="w-20 h-20 rounded-full bg-emerald-500/15 flex items-center justify-center mx-auto ring-1 ring-emerald-500/20">
          <CheckCircle className="w-10 h-10 text-emerald-500" />
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground font-heading">Payment Successful! 🎉</h1>
          <p className="text-muted-foreground">
            Your subscription has been activated. You'll be redirected to your projects in 5 seconds.
          </p>
          {sessionId && (
            <p className="text-xs text-muted-foreground/60 font-mono">Session: {sessionId.slice(0, 20)}...</p>
          )}
        </div>
        <Button
          onClick={() => navigate("/projects")}
          className="bg-gradient-to-r from-blue-400 via-blue-600 to-blue-900 text-white hover:from-blue-300 hover:via-blue-500 hover:to-blue-800 shadow-lg shadow-primary/20 border-0"
        >
          Go to Projects
        </Button>
      </div>
    </div>
  );
}

export function CheckoutCancel() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 relative overflow-hidden">
      {/* Ambient background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-destructive/[0.05] rounded-full blur-[120px]" />
      </div>

      <div className="max-w-md w-full text-center space-y-6 animate-fade-in relative">
        <div className="w-20 h-20 rounded-full bg-destructive/15 flex items-center justify-center mx-auto ring-1 ring-destructive/20">
          <XCircle className="w-10 h-10 text-destructive" />
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground font-heading">Payment Cancelled</h1>
          <p className="text-muted-foreground">
            Your payment was cancelled. No charges were made. You can try again whenever you're ready.
          </p>
        </div>
        <div className="flex gap-3 justify-center">
          <Button variant="outline" onClick={() => navigate("/projects")}>
            Back to Projects
          </Button>
          <Button
            onClick={() => navigate("/plans")}
            className="bg-gradient-to-r from-blue-400 via-blue-600 to-blue-900 text-white hover:from-blue-300 hover:via-blue-500 hover:to-blue-800 shadow-lg shadow-primary/20 border-0"
          >
            View Plans
          </Button>
        </div>
      </div>
    </div>
  );
}
