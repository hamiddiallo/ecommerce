"use client"

import { useState } from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"

interface ProductGalleryProps {
    images: string[]
    name: string
}

export function ProductGallery({ images, name }: ProductGalleryProps) {
    // Ensure we have at least one image or placeholder
    const galleryImages = images && images.length > 0 ? images : ["/placeholder.svg"]
    const [selectedImage, setSelectedImage] = useState(galleryImages[0])

    return (
        <div className="flex flex-col gap-4">
            {/* Main Image */}
            <div className="relative aspect-square overflow-hidden rounded-lg bg-muted border">
                <Image
                    src={selectedImage}
                    alt={name}
                    fill
                    className="object-cover"
                    priority
                />
            </div>

            {/* Thumbnails */}
            {galleryImages.length > 1 && (
                <div className="flex gap-4 overflow-x-auto pb-2">
                    {galleryImages.map((image, index) => (
                        <button
                            key={index}
                            onClick={() => setSelectedImage(image)}
                            className={cn(
                                "relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border-2 bg-muted transition-all hover:opacity-100",
                                selectedImage === image ? "border-primary opacity-100" : "border-transparent opacity-70"
                            )}
                        >
                            <Image
                                src={image}
                                alt={`${name} - Image ${index + 1}`}
                                fill
                                className="object-cover"
                            />
                        </button>
                    ))}
                </div>
            )}
        </div>
    )
}
