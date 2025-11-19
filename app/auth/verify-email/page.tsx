import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Mail } from "lucide-react";
import { useRouter } from "next/navigation";

export default function VerifyEmailPage() {
  const router = useRouter();

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <Card>
          <CardHeader>
            <div className="flex justify-center mb-4">
              <Mail className="h-12 w-12 text-primary" />
            </div>
            <CardTitle className="text-2xl text-center">
              Verify Your Email
            </CardTitle>
            <CardDescription className="text-center">
              We&apos;ve sent you a verification email
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground text-center">
                Please check your inbox and click the verification link to
                activate your account.
              </p>
              <p className="text-sm text-muted-foreground text-center">
                If you don&apos;t see the email, check your spam folder.
              </p>
            </div>
            <Button
              className="w-full"
              onClick={() => router.push("/auth/login")}
            >
              Login
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
