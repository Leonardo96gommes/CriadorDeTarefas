"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Clock } from "lucide-react"
import { Input } from "@/components/ui/input"

interface TimePickerProps {
  value?: string
  onChange?: (value: string) => void
}

export function TimePickerDemo({ value, onChange }: TimePickerProps) {
  const [time, setTime] = useState<string>(value || "")

  useEffect(() => {
    if (value) {
      setTime(value)
    }
  }, [value])

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTime(e.target.value)
    onChange?.(e.target.value)
  }

  return (
    <div className="flex items-center gap-2">
      <Clock className="h-4 w-4 text-muted-foreground" />
      <Input type="time" value={time} onChange={handleTimeChange} className="w-[120px]" />
    </div>
  )
}

