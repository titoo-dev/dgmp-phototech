import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail } from "lucide-react";

const VerifyEmailPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <Card className="border-0 shadow-none">
          <CardHeader className="space-y-1">
            <div className="flex items-center justify-center mb-4">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Mail className="w-6 h-6 text-primary" />
              </div>
            </div>
            <CardTitle className="text-center text-2xl font-bold">
              PhotoTech
            </CardTitle>
            <CardDescription className="text-center text-base">
              Secure Photo Management System
            </CardDescription>
          </CardHeader>
          
          <CardContent className="pb-8 text-center space-y-6">
            <div className="space-y-3">
              <p className="text-lg text-muted-foreground max-w-md mx-auto leading-relaxed">
                We've sent a verification link to your email address. Please check your inbox and click the link to verify your account.
              </p>
            </div>
          </CardContent>
        </Card>
        
        <div className="mt-8 text-center">
          <p className="text-xs text-muted-foreground">
            © 2024 PhotoTech DGMP. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmailPage;

