import { Toaster } from "./components/ui/toaster";
import { Toaster as Sonner } from "./components/ui/sonner";
import { TooltipProvider } from "./components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import Index from "./Pages/Index";
import NotFound from "./Pages/NotFound";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import Dashboard from "./Pages/Dashboard";
import UserList from "./Pages/UserList";
import PatientList from "./Pages/PatientList";
import AddPatient from "./Pages/AddPatient";
import EditPatient from "./Pages/EditPatient";
import ViewPatient from "./Pages/ViewPatient";
import EncounterList from "./Pages/EncounterList";
import AddEncounter from "./Pages/AddEncounter";
import ViewEncounter from "./Pages/ViewEncounter";
import EditEncounter from "./Pages/EditEncounter";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/users" element={
              <ProtectedRoute requireAdmin>
                <UserList />
              </ProtectedRoute>
            } />
            <Route path="/patients" element={
              <ProtectedRoute>
                <PatientList />
              </ProtectedRoute>
            } />
            <Route path="/patients/add" element={
              <ProtectedRoute>
                <AddPatient />
              </ProtectedRoute>
            } />
            <Route path="/patients/edit/:id" element={
              <ProtectedRoute>
                <EditPatient />
              </ProtectedRoute>
            } />
            <Route path="/patients/:id" element={
              <ProtectedRoute>
                <ViewPatient />
              </ProtectedRoute>
            } />
            <Route path="/encounters" element={
              <ProtectedRoute>
                <EncounterList />
              </ProtectedRoute>
            } />
            <Route path="/encounters/add" element={
              <ProtectedRoute>
                <AddEncounter />
              </ProtectedRoute>
            } />
            <Route path="/encounters/:id" element={
              <ProtectedRoute>
                <ViewEncounter />
              </ProtectedRoute>
            } />
            <Route path="/encounters/edit/:id" element={
              <ProtectedRoute>
                <EditEncounter />
              </ProtectedRoute>
            } />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
