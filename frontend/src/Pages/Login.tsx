import { LoginForm } from "../components/auth/LoginForm";
import PageNavigation from "../components/navigation/PageNavigation";

const Login = () => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-muted/30 to-primary/5">
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,_hsl(var(--primary))_1px,_transparent_0)] bg-[length:20px_20px] opacity-20" />
      </div>

      <div className="relative w-full max-w-md">
        <div className="absolute -top-10 -left-10 w-20 h-20 bg-primary/10 rounded-full blur-xl" />
        <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-secondary/10 rounded-full blur-xl" />

        <LoginForm />
      </div>
      <PageNavigation showBack={false} showNext nextLabel="Register" nextPath="/register" />
    </div>
  );
};

export default Login;
