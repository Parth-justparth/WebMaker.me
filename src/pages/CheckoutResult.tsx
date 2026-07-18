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
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center space-y-6 animate-fade-in">
        <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto">
          <CheckCircle className="w-10 h-10 text-green-500" />
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Payment Successful! 🎉</h1>
          <p className="text-muted-foreground">
            Your subscription has been activated. You'll be redirected to your projects in 5 seconds.
          </p>
          {sessionId && (
            <p className="text-xs text-muted-foreground/60 font-mono">Session: {sessionId.slice(0, 20)}...</p>
          )}
        </div>
        <Button
          onClick={() => navigate("/projects")}
          className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:from-indigo-400 hover:to-purple-400"
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
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center space-y-6 animate-fade-in">
        <div className="w-20 h-20 rounded-full bg-destructive/20 flex items-center justify-center mx-auto">
          <XCircle className="w-10 h-10 text-destructive" />
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Payment Cancelled</h1>
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
            className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:from-indigo-400 hover:to-purple-400"
          >
            View Plans
          </Button>
        </div>
      </div>
    </div>
  );
}
