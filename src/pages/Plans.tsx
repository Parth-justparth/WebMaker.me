import { useEffect, useState } from "react";
import { api, isAuthenticated } from "@/lib/api";
import { Plan } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Check, Loader2, Sparkles, Zap, ArrowLeft, Crown, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { ThemeToggle } from "@/components/ThemeToggle";

interface Subscription {
  plan: { id: number; name: string; maxProjects: number; maxTokensPerDay: number; unlimitedAi: boolean; price: string };
  status: string;
  currentPeriodEnd: string;
  tokensUsedThisCycle: number;
}

const getPlanPrice = (name: string) => {
  if (name.includes("Ultra Plan")) return "$1,499.00";
  if (name.includes("Pro Plan")) return "₹10.00";
  if (name.toLowerCase().includes("free")) return "$0";
  return "$99";
};

export default function PlansPage() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<number | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate("/login");
      return;
    }

    const plansFetch = api.getPlans()
      .then(setPlans)
      .catch((err) => toast.error(err.message || "Failed to load plans"));

    const subFetch = api.getCurrentSubscription()
      .then(setSubscription)
      .catch(() => { /* No subscription yet, that's fine */ });

    Promise.all([plansFetch, subFetch]).finally(() => setLoading(false));
  }, [navigate]);

  const handleCheckout = async (plan: Plan) => {
    if (plan.name.toLowerCase().includes("free")) {
      toast.info("You are already on the free plan!");
      return;
    }
    if (processingId) return;
    setProcessingId(plan.id);
    try {
      const { url } = await api.checkout(plan.id);
      window.location.href = url;
    } catch (error: any) {
      toast.error(error.message || "Checkout failed. Please try again.");
      setProcessingId(null);
    }
  };

  const handleManageSubscription = async () => {
    try {
      const { url } = await api.createPortalSession();
      window.location.href = url;
    } catch (error: any) {
      if (error.message?.includes("400")) {
        toast.error("No active subscription to manage.");
      } else {
        toast.error("Failed to open billing portal. Please try again.");
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const isCurrentPlan = (plan: Plan) => subscription?.plan?.id === plan.id;
  const hasActiveSub = !!subscription && (!subscription.status || !['canceled', 'incomplete_expired'].includes(subscription.status.toLowerCase()));

  return (
    <div className="min-h-screen bg-background text-foreground py-20 px-4 relative overflow-hidden">
      {/* Header Navigation */}
      <div className="fixed top-0 left-0 w-full p-4 flex justify-between items-center z-50 bg-background/80 backdrop-blur-xl border-b border-border/30">
        <Button variant="ghost" onClick={() => navigate("/projects")} className="gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back to Projects
        </Button>
        <ThemeToggle />
      </div>

      {/* Background Effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-primary/[0.08] blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-blue-900/[0.05] blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10 mt-8">
        <div className="text-center mb-10 space-y-3">
          <h1 className="text-4xl md:text-6xl font-extrabold font-heading gradient-text">
            Choose Your Power Level
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Scale your distributed architecture effortlessly.
          </p>
        </div>

        {/* Current Subscription Banner */}
        {hasActiveSub && subscription?.plan && (
          <div className="mb-10 max-w-2xl mx-auto">
            <div className="rounded-2xl border border-primary/30 bg-primary/[0.08] p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4 backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-primary/20">
                  <Crown className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Your Current Plan</p>
                  <p className="text-lg font-bold text-foreground">{subscription.plan.name}</p>
                  {subscription.currentPeriodEnd && (
                    <p className="text-xs text-muted-foreground">
                      Renews {new Date(subscription.currentPeriodEnd).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </p>
                  )}
                </div>
              </div>
              <div className="sm:ml-auto">
                <Button
                  onClick={handleManageSubscription}
                  variant="outline"
                  className="border-primary/30 text-primary hover:bg-primary/10 gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  Manage Subscription
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Plans Grid */}
        <div className={`grid gap-8 max-w-5xl mx-auto ${plans.filter(p => p.active !== false).length === 2 ? 'md:grid-cols-2 max-w-3xl' : 'md:grid-cols-3'}`}>
          {plans.filter(p => p.active !== false).map((plan) => {
            const isCurrent = isCurrentPlan(plan);
            const isFeatured = plan.name.toLowerCase().includes('pro') || plan.name.includes('Ultra');

            return (
              <div
                key={plan.id}
                className={`relative group rounded-3xl p-0.5 transition-all duration-300 hover:scale-[1.02] ${
                  isCurrent
                    ? 'bg-gradient-to-b from-emerald-400 via-emerald-500 to-teal-600'
                    : isFeatured
                      ? 'bg-gradient-to-b from-blue-400 via-blue-600 to-blue-900'
                      : 'bg-border hover:bg-border/80'
                }`}
              >
                {/* Badge */}
                {isCurrent ? (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-emerald-400 to-teal-500 text-white px-4 py-1 rounded-full text-sm font-semibold flex items-center gap-1 shadow-lg whitespace-nowrap">
                    <Crown className="w-3.5 h-3.5" /> Current Plan
                  </div>
                ) : isFeatured ? (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-400 to-blue-700 text-white px-4 py-1 rounded-full text-sm font-semibold flex items-center gap-1 shadow-lg">
                    <Sparkles className="w-3.5 h-3.5" /> Recommended
                  </div>
                ) : null}

                <div className="h-full bg-card rounded-[23px] p-8 flex flex-col border border-transparent">
                  <div className="mb-8">
                    <h3 className="text-2xl font-bold text-card-foreground mb-2 flex items-center gap-2 font-heading">
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

                  <div className="space-y-3 flex-1">
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
                    onClick={() => isCurrent ? handleManageSubscription() : handleCheckout(plan)}
                    disabled={processingId !== null && processingId !== plan.id}
                    className={`w-full mt-8 h-12 rounded-xl font-semibold transition-all duration-300 ${
                      isCurrent
                        ? 'bg-gradient-to-r from-emerald-400 to-teal-500 hover:from-emerald-300 hover:to-teal-400 text-white shadow-lg border-0'
                        : plan.name.toLowerCase().includes('free')
                          ? 'bg-secondary hover:bg-secondary/80 text-secondary-foreground border-0'
                          : 'bg-gradient-to-r from-blue-400 via-blue-600 to-blue-900 hover:from-blue-300 hover:via-blue-500 hover:to-blue-800 text-white shadow-lg shadow-blue-500/20 border-0'
                    }`}
                  >
                    {processingId === plan.id ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : isCurrent ? (
                      "Manage Plan"
                    ) : plan.name.toLowerCase().includes('free') ? (
                      "Free Forever"
                    ) : (
                      "Select Plan"
                    )}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Warning if no subscription and tried portal */}
        {!hasActiveSub && (
          <div className="mt-8 max-w-xl mx-auto flex items-start gap-3 p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-sm text-amber-600 dark:text-amber-400">
            <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span>You don't have an active paid subscription yet. Select a plan above to get started!</span>
          </div>
        )}
      </div>
    </div>
  );
}

function Feature({ text, highlight = false }: { text: string; highlight?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <div className={`p-1 rounded-full flex-shrink-0 ${highlight ? 'bg-gradient-to-r from-blue-400 to-blue-800 text-white' : 'bg-secondary text-secondary-foreground'}`}>
        <Check className="w-3 h-3" />
      </div>
      <span className={highlight ? 'text-primary dark:text-blue-300 font-medium' : 'text-muted-foreground'}>
        {text}
      </span>
    </div>
  );
}
