import { useEffect, useState } from "react";
import { api, isAuthenticated } from "@/lib/api";
import { Plan } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Check, Loader2, Sparkles, Zap, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { ThemeToggle } from "@/components/ThemeToggle";

const getPlanPrice = (name: string) => {
  if (name.includes("Ultra Plan")) return "$1,499.00";
  if (name.includes("Pro Plan")) return "₹10.00";
  if (name.toLowerCase().includes("free")) return "$0";
  if (name.toLowerCase().includes("pro")) return "$29";
  return "$99";
};

export default function PlansPage() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<number | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate("/login");
      return;
    }
    
    api.getPlans()
      .then(setPlans)
      .catch((err) => toast.error(err.message || "Failed to load plans"))
      .finally(() => setLoading(false));
  }, [navigate]);

  const handleCheckout = async (plan: Plan) => {
    if (processingId) return;
    setProcessingId(plan.id);
    try {
      const { url } = await api.checkout(plan.id);
      window.location.href = url; // Redirect to Stripe
    } catch (error: any) {
      toast.error(error.message || "Checkout failed. Please try again.");
      setProcessingId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground py-20 px-4 relative overflow-hidden">
      {/* Header Navigation */}
      <div className="absolute top-0 left-0 w-full p-6 flex justify-between items-center z-50">
        <Button variant="ghost" onClick={() => navigate("/projects")} className="gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back to Projects
        </Button>
        <ThemeToggle />
      </div>

      {/* Background Effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-primary/20 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="max-w-6xl mx-auto relative z-10 mt-8">
        <div className="text-center mb-16 space-y-4">
          <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
            Choose Your Power Level
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Scale your distributed architecture effortlessly. Select a plan that matches your ambition.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan) => (
            <div 
              key={plan.id}
              className={`relative group rounded-3xl p-1 transition-all duration-300 hover:scale-[1.02] ${
                plan.name.toLowerCase().includes('pro') || plan.name.includes('Ultra') 
                  ? 'bg-gradient-to-b from-indigo-500 via-purple-500 to-pink-500' 
                  : 'bg-white/10 hover:bg-white/20'
              }`}
            >
              {(plan.name.toLowerCase().includes('pro') || plan.name.includes('Ultra')) && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-4 py-1 rounded-full text-sm font-semibold flex items-center gap-1 shadow-lg">
                  <Sparkles className="w-4 h-4" /> Recommended
                </div>
              )}
              
              <div className="h-full bg-card backdrop-blur-xl rounded-[23px] p-8 flex flex-col shadow-lg border border-border/50">
                <div className="mb-8">
                  <h3 className="text-2xl font-bold text-card-foreground mb-2 flex items-center gap-2">
                    {plan.name}
                    {plan.unlimitedAi && <Zap className="w-5 h-5 text-yellow-500" />}
                  </h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-extrabold text-card-foreground">
                      {getPlanPrice(plan.name)}
                    </span>
                    <span className="text-muted-foreground">/month</span>
                  </div>
                </div>

                <div className="space-y-4 flex-1">
                  <Feature text={`${plan.maxProjects} Projects`} />
                  <Feature text={`${plan.maxPreviews} Live Previews`} />
                  <Feature 
                    text={plan.unlimitedAi ? 'Unlimited AI Tokens' : `${plan.maxTokensPerDay} AI Tokens/Day`} 
                    highlight={plan.unlimitedAi}
                  />
                  <Feature text="Global Edge Caching" />
                  <Feature text="Community Support" />
                </div>

                <Button 
                  onClick={() => handleCheckout(plan)}
                  disabled={processingId !== null}
                  className={`w-full mt-8 h-12 rounded-xl font-semibold transition-all ${
                    plan.name.toLowerCase().includes('pro') || plan.name.includes('Ultra')
                      ? 'bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-400 hover:to-purple-400 text-white shadow-lg shadow-indigo-500/25 border-0'
                      : 'bg-secondary hover:bg-secondary/80 text-secondary-foreground border-0'
                  }`}
                >
                  {processingId === plan.id ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    "Select Plan"
                  )}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Feature({ text, highlight = false }: { text: string, highlight?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <div className={`p-1 rounded-full ${highlight ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white' : 'bg-secondary text-secondary-foreground'}`}>
        <Check className="w-3 h-3" />
      </div>
      <span className={highlight ? 'text-indigo-500 dark:text-indigo-300 font-medium' : 'text-muted-foreground'}>
        {text}
      </span>
    </div>
  );
}
