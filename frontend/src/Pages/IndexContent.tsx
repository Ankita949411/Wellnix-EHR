import { Activity, Shield, Users, FileText } from "lucide-react";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-primary/5">
      {/* Navigation */}
      <nav className="flex items-center justify-between p-6 border-b border-border/50 bg-background/80 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg medical-gradient">
            <Activity className="h-6 w-6 text-white" />
          </div>
          <span className="text-xl font-bold text-foreground">Wellnix</span>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/login">
            <Button variant="ghost" className="font-medium">
              Sign In
            </Button>
          </Link>
          <Link to="/register">
            <Button className="medical-gradient hover:opacity-90 font-medium">
              Get Started
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="container mx-auto px-6 py-20">
        <div className="text-center max-w-4xl mx-auto mb-16">
          <h1 className="text-5xl font-bold text-foreground mb-6 fade-in">
            Modern Healthcare
            <span className="block text-primary">Record Management</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 slide-up">
            Streamline patient care with our comprehensive Electronic Health
            Records system. Secure, efficient, and designed for healthcare
            professionals.
          </p>
          <div className="flex items-center justify-center gap-4 slide-up">
            <Link to="/register">
              <Button
                size="lg"
                className="medical-gradient hover:opacity-90 font-semibold text-lg px-8 py-6"
              >
                Start Free Trial
              </Button>
            </Link>
            <Link to="/login">
              <Button
                size="lg"
                variant="outline"
                className="font-semibold text-lg px-8 py-6"
              >
                Sign In
              </Button>
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <Card className="medical-card medical-shadow fade-in hover:scale-105 transition-transform duration-300">
            <CardHeader className="text-center pb-4">
              <div className="w-12 h-12 rounded-lg medical-gradient mx-auto mb-4 flex items-center justify-center">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <CardTitle className="text-xl">HIPAA Compliant</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center leading-relaxed">
                Bank-level security with end-to-end encryption to protect
                sensitive patient data
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="medical-card medical-shadow fade-in hover:scale-105 transition-transform duration-300">
            <CardHeader className="text-center pb-4">
              <div className="w-12 h-12 rounded-lg bg-secondary mx-auto mb-4 flex items-center justify-center">
                <Users className="h-6 w-6 text-white" />
              </div>
              <CardTitle className="text-xl">Team Collaboration</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center leading-relaxed">
                Real-time collaboration between doctors, nurses, and healthcare
                staff
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="medical-card medical-shadow fade-in hover:scale-105 transition-transform duration-300">
            <CardHeader className="text-center pb-4">
              <div className="w-12 h-12 rounded-lg bg-accent mx-auto mb-4 flex items-center justify-center">
                <FileText className="h-6 w-6 text-white" />
              </div>
              <CardTitle className="text-xl">Smart Records</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center leading-relaxed">
                AI-powered insights and automated documentation to save time
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
