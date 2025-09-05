import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { UserPlus, User, Mail, Shield, Lock } from 'lucide-react';

export default function NewUserLoadingSkeleton() {
    return (
        <div className="min-h-screen bg-background">
            {/* Header Skeleton */}
            <div className="border-b bg-card/50 backdrop-blur">
                <div className="mx-auto max-w-7xl px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                                <UserPlus className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <Skeleton className="h-8 w-48 mb-2" />
                                <Skeleton className="h-4 w-64" />
                            </div>
                        </div>
                        <Skeleton className="h-10 w-44" />
                    </div>
                </div>
            </div>

            <div className="mx-auto max-w-7xl px-6 py-8">
                <div className="mx-auto max-w-2xl">
                    {/* User Information Card Skeleton */}
                    <div className="space-y-6">
                        <Card className="border-border/50 shadow-sm">
                            <CardHeader className="pb-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <User className="h-5 w-5 text-primary" />
                                    <Skeleton className="h-6 w-56" />
                                </div>
                                <Skeleton className="h-4 w-80" />
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {/* Full Name Field */}
                                <div className="space-y-2">
                                    <Skeleton className="h-5 w-32" />
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                        <Skeleton className="h-12 w-full" />
                                    </div>
                                </div>

                                {/* Email Field */}
                                <div className="space-y-2">
                                    <Skeleton className="h-5 w-36" />
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                        <Skeleton className="h-12 w-full" />
                                    </div>
                                </div>

                                {/* Role Field */}
                                <div className="space-y-2">
                                    <Skeleton className="h-5 w-44" />
                                    <div className="relative">
                                        <Shield className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground z-10" />
                                        <Skeleton className="h-12 w-full" />
                                    </div>
                                    <div className="bg-muted/50 p-3 rounded-md">
                                        <Skeleton className="h-4 w-full" />
                                    </div>
                                </div>

                                {/* Password Field */}
                                <div className="space-y-2">
                                    <Skeleton className="h-5 w-28" />
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                        <Skeleton className="h-12 w-full" />
                                    </div>
                                </div>

                                {/* Confirm Password Field */}
                                <div className="space-y-2">
                                    <Skeleton className="h-5 w-48" />
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                        <Skeleton className="h-12 w-full" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
