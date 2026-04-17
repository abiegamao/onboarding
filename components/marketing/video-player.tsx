"use client"

import { useState } from "react"
import { Play, Maximize2, Volume2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface VideoPlayerProps {
    videoId?: string // YouTube ID
    title?: string
    thumbnail?: string
    className?: string
}

export function VideoPlayer({
    videoId = "oUL3Hbc1yCc",
    title,
    className,
}: VideoPlayerProps) {
    return (
        <div
            className={cn(
                "group relative overflow-hidden rounded-3xl border border-border bg-background shadow-2xl transition-all duration-500",
                className
            )}
        >
            <div className="aspect-video w-full">
                <iframe
                    width="100%"
                    height="100%"
                    src={`https://www.youtube.com/embed/${videoId}`}
                    title={title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="h-full w-full"
                />
            </div>
        </div>
    )
}
