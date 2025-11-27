"use client"

import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"

interface PaginationControlsProps {
    totalPages: number
    currentPage: number
}

export function PaginationControls({ totalPages, currentPage }: PaginationControlsProps) {
    const router = useRouter()
    const searchParams = useSearchParams()

    const handlePageChange = (page: number) => {
        const params = new URLSearchParams(searchParams.toString())
        params.set("page", page.toString())
        router.push(`?${params.toString()}`)
    }

    if (totalPages <= 1) return null

    return (
        <div className="flex items-center justify-center gap-2 mt-8">
            <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage <= 1}
            >
                <ChevronLeft className="h-4 w-4 mr-2" />
                Précédent
            </Button>

            <div className="text-sm font-medium">
                Page {currentPage} sur {totalPages}
            </div>

            <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage >= totalPages}
            >
                Suivant
                <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
        </div>
    )
}
