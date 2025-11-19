import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function ErrorPage({
  searchParams,
}: {
  searchParams: Promise<{ error: string }>;
}) {
  const params = await searchParams;

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">
                Authentication Error
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {params?.error ? (
                  <p className="text-sm text-muted-foreground">
                    {params.error}
                  </p>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    An error occurred during authentication.
                  </p>
                )}
                <Link href="/auth/login">
                  <Button className="w-full">Try Again</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
