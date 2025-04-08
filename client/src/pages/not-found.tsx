import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, Home, ArrowLeft } from "lucide-react";
import { useLocation } from "wouter";

export default function NotFound() {
  const [_, setLocation] = useLocation();

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md shadow-lg border-0">
        <CardContent className="pt-6">
          <div className="flex items-center justify-center mb-6">
            <div className="p-3 rounded-full bg-red-100">
              <AlertCircle className="h-10 w-10 text-red-500" />
            </div>
          </div>
          
          <h1 className="text-3xl font-bold text-center text-gray-900 mb-2">Page Not Found</h1>
          
          <p className="text-center text-gray-600 mb-6">
            We couldn't find the page you're looking for. The page might have been moved
            or doesn't exist.
          </p>
        </CardContent>
        
        <CardFooter className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button 
            variant="outline" 
            onClick={() => window.history.back()}
            className="w-full sm:w-auto flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Go Back
          </Button>
          
          <Button 
            onClick={() => setLocation("/")}
            className="w-full sm:w-auto flex items-center gap-2"
          >
            <Home className="h-4 w-4" />
            Return Home
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
