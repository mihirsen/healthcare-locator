import { Authenticated, Unauthenticated, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { SignInForm } from "./SignInForm";
import { SignOutButton } from "./SignOutButton";
import { Toaster } from "sonner";
import { HospitalLocator } from "./components/HospitalLocator";

function UserProfile() {
  const user = useQuery(api.auth.loggedInUser);
  
  if (!user) return null;
  
  return (
    <div className="flex items-center gap-2">
      <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
        <span className="text-sm font-medium text-gray-600">
          {(user.name || user.email || "U").charAt(0).toUpperCase()}
        </span>
      </div>
      <div className="hidden sm:block">
        <p className="text-sm font-medium text-gray-900">
          {user.name || user.email || "User"}
        </p>
        <p className="text-xs text-gray-500">
          {user.isAnonymous ? "Anonymous" : "Signed in"}
        </p>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="sticky top-0 z-10 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-xl">🏥</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Hospital Locator</h1>
                <p className="text-xs text-gray-500 hidden sm:block">Find nearby medical facilities</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Authenticated>
                <UserProfile />
                <SignOutButton />
              </Authenticated>
            </div>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <Content />
      </main>
      <Toaster />
    </div>
  );
}

function Content() {
  const loggedInUser = useQuery(api.auth.loggedInUser);

  if (loggedInUser === undefined) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="h-full">
      <Authenticated>
        <HospitalLocator />
      </Authenticated>
      
      <Unauthenticated>
        <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-blue-50 via-white to-green-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-16">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left side - Hero content */}
              <div className="text-center lg:text-left">
                <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
                  <span>🏥</span>
                  <span>Healthcare Made Accessible</span>
                </div>
                
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                  Find Nearby
                  <span className="text-primary block">Hospitals</span>
                </h1>
                
                <p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-2xl">
                  Discover hospitals, clinics, and emergency care centers near you.
                </p>
              </div>
              {/* Right side - Sign in form */}
              <div className="flex justify-center lg:justify-end">
                <SignInForm />
              </div>
            </div>
          </div>
        </div>
      </Unauthenticated>
    </div>
  );
}
