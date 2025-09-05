import React from 'react';

export default function Loading() {
    return (
        <div className="flex-1 space-y-6 p-6">
            {/* Header Section */}
            <div className="flex items-center justify-between">
                <div className="space-y-2">
                    <div className="h-8 w-48 bg-muted animate-pulse rounded"></div>
                    <div className="h-4 w-72 bg-muted animate-pulse rounded"></div>
                </div>
                <div className="h-10 w-44 bg-muted animate-pulse rounded"></div>
            </div>

            {/* Table Section */}
            <div className="border rounded-lg shadow-none">
                <div className="p-6 border-b">
                    <div className="flex items-center gap-4">
                        <div className="h-10 w-80 bg-muted animate-pulse rounded"></div>
                        <div className="flex items-center gap-2">
                            <div className="h-4 w-4 bg-muted animate-pulse rounded"></div>
                            <div className="h-10 w-44 bg-muted animate-pulse rounded"></div>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="h-4 w-4 bg-muted animate-pulse rounded"></div>
                            <div className="h-10 w-44 bg-muted animate-pulse rounded"></div>
                        </div>
                    </div>
                </div>
                <div className="p-6">
                    {/* Table Header */}
                    <div className="grid grid-cols-6 gap-4 pb-4 border-b">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <div key={i} className="h-4 bg-muted animate-pulse rounded"></div>
                        ))}
                    </div>
                    {/* Table Rows */}
                    {Array.from({ length: 8 }).map((_, i) => (
                        <div key={i} className="grid grid-cols-6 gap-4 py-4 border-b last:border-b-0">
                            <div className="space-y-2">
                                <div className="h-4 w-32 bg-muted animate-pulse rounded"></div>
                                <div className="h-3 w-20 bg-muted animate-pulse rounded"></div>
                            </div>
                            <div className="flex items-center space-x-2">
                                <div className="h-4 w-4 bg-muted animate-pulse rounded"></div>
                                <div className="h-3 w-40 bg-muted animate-pulse rounded"></div>
                            </div>
                            <div className="h-6 w-24 bg-muted animate-pulse rounded-full"></div>
                            <div className="h-6 w-20 bg-muted animate-pulse rounded-full"></div>
                            <div className="h-4 w-20 bg-muted animate-pulse rounded"></div>
                            <div className="h-8 w-8 bg-muted animate-pulse rounded"></div>
                        </div>
                    ))}
                </div>

                {/* Pagination Section */}
                <div className="p-6 border-t">
                    <div className="flex items-center justify-between">
                        <div className="h-4 w-64 bg-muted animate-pulse rounded"></div>
                        <div className="flex items-center space-x-2">
                            <div className="h-8 w-20 bg-muted animate-pulse rounded"></div>
                            {Array.from({ length: 5 }).map((_, i) => (
                                <div key={i} className="h-8 w-8 bg-muted animate-pulse rounded"></div>
                            ))}
                            <div className="h-8 w-20 bg-muted animate-pulse rounded"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
