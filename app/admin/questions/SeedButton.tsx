"use client"

import { useState } from "react"
import { Database } from "lucide-react"
import { toast } from "sonner"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export default function SeedButton() {
    const [loading, setLoading] = useState(false)

    async function handleSeed() {
        setLoading(true)
        try {
            const res = await fetch("/api/admin/questions", { method: "POST" })
            const data = await res.json()
            if (!res.ok) throw new Error(data.error ?? "Seed failed")
            toast.success(`Seeded ${data.seeded} of ${data.total} steps`, {
                description: "Default questions are now in the database. You can edit each step.",
            })
        } catch (err: any) {
            toast.error("Seed failed", { description: err.message })
        } finally {
            setLoading(false)
        }
    }

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <button className="flex items-center gap-2 rounded-xl border border-[#b6954a]/25 bg-[#b6954a]/8 px-4 py-2 text-sm font-medium text-[#b6954a] transition-colors hover:bg-[#b6954a]/15">
                    <Database className="h-4 w-4" />
                    Seed Defaults
                </button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Seed Default Questions?</AlertDialogTitle>
                    <AlertDialogDescription asChild>
                        <div className="space-y-3 text-sm text-muted-foreground">
                            <p>
                                This will write the built-in default questions for all 17 onboarding
                                steps into the database.
                            </p>
                            <ul className="list-disc space-y-1.5 pl-4">
                                <li>Steps that have <strong className="text-foreground">already been edited</strong> will not be overwritten — existing customizations are safe.</li>
                                <li>Steps with <strong className="text-foreground">no DB record yet</strong> will be created with the default questions.</li>
                                <li>After seeding, every step becomes individually editable from this page.</li>
                            </ul>
                            <p className="text-xs text-muted-foreground/60">
                                Safe to run multiple times — uses upsert with insert-only logic.
                            </p>
                        </div>
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        disabled={loading}
                        onClick={handleSeed}
                        className="bg-[#b6954a] text-white hover:bg-[#b6954a]/90"
                    >
                        {loading ? "Seeding…" : "Seed Defaults"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
