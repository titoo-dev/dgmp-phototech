import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Building2, Mail } from 'lucide-react';

export default function NewCompanyLoadingSkeleton() {
    return (
        <div className="min-h-screen bg-background">
            {/* Header Skeleton */}
            <div className="border-b bg-card/50 backdrop-blur">
                <div className="mx-auto max-w-7xl px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                                <Building2 className="h-5 w-5 text-primary" />
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
                <div className="grid gap-8 lg:grid-cols-2">
                    {/* Left Section - Company Information Skeleton */}
                    <div className="space-y-6">
                        <Card className="border-border/50 shadow-none">
                            <CardHeader className="pb-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <Building2 className="h-5 w-5 text-primary" />
                                    <Skeleton className="h-6 w-48" />
                                </div>
                                <Skeleton className="h-4 w-80" />
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {/* Company Name Field */}
                                <div className="space-y-2">
                                    <Skeleton className="h-5 w-56" />
                                    <Skeleton className="h-12 w-full" />
                                </div>

                                {/* NIF Field */}
                                <div className="space-y-2">
                                    <Skeleton className="h-5 w-72" />
                                    <Skeleton className="h-12 w-full" />
                                </div>

                                {/* Employee Count Field */}
                                <div className="space-y-2">
                                    <Skeleton className="h-5 w-48" />
                                    <Skeleton className="h-12 w-full" />
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Section - Contact Information Skeleton */}
                    <div className="space-y-6">
                        <Card className="border-border/50 shadow-none">
                            <CardHeader className="pb-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <Mail className="h-5 w-5 text-primary" />
                                    <Skeleton className="h-6 w-52" />
                                </div>
                                <Skeleton className="h-4 w-68" />
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {/* Email Field */}
                                <div className="space-y-2">
                                    <Skeleton className="h-5 w-32" />
                                    <Skeleton className="h-12 w-full" />
                                </div>

                                {/* Phone Field */}
                                <div className="space-y-2">
                                    <Skeleton className="h-5 w-44" />
                                    <Skeleton className="h-12 w-full" />
                                </div>

                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}