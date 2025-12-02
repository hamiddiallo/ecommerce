import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
    return (
        <div className="container px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
            {/* Hero Skeleton */}
            <div className="mb-16 space-y-4 text-center">
                <Skeleton className="mx-auto h-12 w-3/4 max-w-2xl" />
                <Skeleton className="mx-auto h-6 w-1/2 max-w-xl" />
                <div className="mt-8 flex justify-center gap-4">
                    <Skeleton className="h-10 w-32" />
                    <Skeleton className="h-10 w-32" />
                </div>
            </div>

            {/* Products Grid Skeleton */}
            <div className="grid gap-6 sm:grid-cols-2 md:gap-8 lg:grid-cols-3 xl:grid-cols-4">
                {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="flex flex-col space-y-3">
                        <Skeleton className="aspect-square w-full rounded-xl" />
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-3/4" />
                            <Skeleton className="h-4 w-1/2" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
