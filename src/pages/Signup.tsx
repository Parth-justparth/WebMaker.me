import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Loader2, Mail, User, Lock } from "lucide-react";
import { api, setAuthToken, setUserInfo } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

export default function Signup() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const { toast } = useToast();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!name || !email || !password) {
            toast({
                title: "Missing details",
                description: "Please fill in all fields",
                variant: "destructive",
            });
            return;
        }

        setIsLoading(true);

        try {
            const response = await api.signup({ name, username: email, password });
            setAuthToken(response.token);
            setUserInfo(response.user);
            toast({
                title: "Welcome!",
                description: "Account created successfully",
            });
            navigate("/plans");
        } catch (error) {
            toast({
                title: "Signup failed",
                description: error instanceof Error ? error.message : "Could not create account",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-background relative overflow-hidden">
            {/* Animated gradient background orbs */}
            <div className="absolute inset-0 overflow-hidden">
                <div
                    className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-primary/[0.07] rounded-full blur-[120px] animate-float"
                />
                <div
                    className="absolute bottom-1/4 left-1/3 w-[400px] h-[400px] bg-blue-400/[0.05] rounded-full blur-[100px] animate-float"
                    style={{ animationDelay: "-3s" }}
                />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-900/[0.04] rounded-full blur-[150px]" />
            </div>

            {/* Grid pattern overlay */}
            <div className="absolute inset-0 bg-grid-pattern" />

            <div className="relative w-full max-w-md animate-fade-in">
                {/* Card with gradient border effect */}
                <div className="relative rounded-2xl p-[1px] bg-gradient-to-b from-primary/25 via-border/50 to-border/20">
                    <div className="bg-card rounded-2xl p-8 backdrop-blur-xl shadow-2xl">
                        {/* Logo & Branding */}
                        <div className="text-center mb-8">
                            <img
                                src="/webmaker-logo.png"
                                alt="WebMaker"
                                className="w-16 h-16 mb-5 drop-shadow-lg"
                            />
                            <h1 className="text-2xl font-bold text-foreground mb-2 font-heading">
                                Create your <span className="gradient-text">WebMaker</span> account
                            </h1>
                            <p className="text-muted-foreground text-sm">Start building your next big idea</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="space-y-2">
                                <Label htmlFor="name" className="text-sm font-medium text-foreground">
                                    Full Name
                                </Label>
                                <div className="relative premium-input rounded-xl">
                                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <Input
                                        id="name"
                                        type="text"
                                        placeholder="John Doe"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="pl-10 h-12 bg-muted/30 border-border/40 focus:border-primary/60 rounded-xl text-sm transition-all duration-300"
                                        disabled={isLoading}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-sm font-medium text-foreground">
                                    Email
                                </Label>
                                <div className="relative premium-input rounded-xl">
                                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="you@example.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="pl-10 h-12 bg-muted/30 border-border/40 focus:border-primary/60 rounded-xl text-sm transition-all duration-300"
                                        disabled={isLoading}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password" className="text-sm font-medium text-foreground">
                                    Password
                                </Label>
                                <div className="relative premium-input rounded-xl">
                                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <Input
                                        id="password"
                                        type="password"
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="pl-10 h-12 bg-muted/30 border-border/40 focus:border-primary/60 rounded-xl text-sm transition-all duration-300"
                                        disabled={isLoading}
                                    />
                                </div>
                            </div>

                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="w-full h-12 rounded-xl text-sm font-semibold text-white border-0 bg-gradient-to-r from-blue-400 via-blue-600 to-blue-900 hover:from-blue-300 hover:via-blue-500 hover:to-blue-800 shadow-lg shadow-primary/20 transition-all duration-300 hover:shadow-xl hover:shadow-primary/30"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Creating account...
                                    </>
                                ) : (
                                    "Create account"
                                )}
                            </Button>
                        </form>

                        {/* Divider */}
                        <div className="relative my-6">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-border/30" />
                            </div>
                        </div>

                        <p className="text-center text-sm text-muted-foreground">
                            Already have an account?{" "}
                            <Link to="/login" className="text-primary hover:text-primary/80 font-semibold transition-colors">
                                Sign in
                            </Link>
                        </p>
                    </div>
                </div>

                {/* Bottom tagline */}
                <p className="text-center text-xs text-muted-foreground/50 mt-6 tracking-widest uppercase font-medium">
                    Build · Create · Deploy
                </p>
            </div>
        </div>
    );
}
