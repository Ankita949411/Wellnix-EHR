import { useState } from "react";
import { Eye, EyeOff, Mail, Lock, Activity } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

export const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("http://localhost:3005/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || "Login failed");
      }

      const data = await response.json();
      
      // Decode JWT to get user info (simple decode for demo)
      const tokenPayload = JSON.parse(atob(data.data.access_token.split('.')[1]));
      const user = {
        id: tokenPayload.sub,
        email: tokenPayload.email,
        role: tokenPayload.role
      };
      
      // Use auth context to login
      login(data.data.access_token, user);
      
      // Redirect to dashboard
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <Card className="medical-card medical-shadow w-full max-w-md fade-in">
      <CardHeader className="space-y-2 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="p-2 rounded-full medical-gradient">
            <Activity className="h-6 w-6 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold text-foreground">
            Wellnix
          </CardTitle>
        </div>
        <CardDescription className="text-muted-foreground">
          Sign in to access your patient records and medical dashboard
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium">
              Email Address
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="doctor@hospital.com"
                value={formData.email}
                onChange={handleInputChange}
                className="pl-10 h-12 transition-all duration-200 focus:shadow-[var(--shadow-glow)]"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium">
              Password
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleInputChange}
                className="pl-10 pr-10 h-12 transition-all duration-200 focus:shadow-[var(--shadow-glow)]"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          {error && <p className="text-red-500 text-sm font-medium">{error}</p>}

          <Button
            type="submit"
            className="w-full h-12 medical-gradient hover:opacity-90 transition-all duration-200 font-semibold text-base"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign In"}
          </Button>
        </form>

        <div className="text-center text-sm text-muted-foreground">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-primary hover:text-primary/80 transition-colors font-medium"
          >
            Register here
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};
