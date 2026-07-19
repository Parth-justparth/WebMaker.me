import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { isAuthenticated } from "@/lib/api";
import { Loader2 } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect based on auth status
    if (isAuthenticated()) {
      // If authenticated, redirect to projects dashboard
      navigate("/projects");
    } else {
      navigate("/login");
    }
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background relative overflow-hidden">
      {/* Ambient gradient background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/3 left-1/3 w-[500px] h-[500px] bg-primary/[0.06] rounded-full blur-[120px] animate-float" />
        <div
          className="absolute bottom-1/3 right-1/3 w-[500px] h-[500px] bg-blue-900/[0.04] rounded-full blur-[120px] animate-float"
          style={{ animationDelay: "-3s" }}
        />
      </div>

      <div className="relative flex flex-col items-center animate-fade-in">
        {/* Logo Icon */}
        <img
          src="/webmaker-logo.png"
          alt="WebMaker"
          className="w-20 h-20 mb-6 drop-shadow-xl animate-glow-pulse"
        />
        <h1 className="text-3xl font-bold mb-4 font-heading">
          <span className="gradient-text">WebMaker</span>
        </h1>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span className="text-sm">Loading...</span>
        </div>
      </div>
    </div>
  );
};

export default Index;
