"use client"

import * as React from "react"
import { ChevronDownIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"

interface CalendarPopoverProps {
  value?: Date
  onValueChange?: (date: Date | undefined) => void
  placeholder?: string
  id?: string
  className?: string
}

export function CalendarPopover({
  value,
  onValueChange,
  placeholder = "Select date",
  id,
  className,
}: CalendarPopoverProps) {
  const [open, setOpen] = React.useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          id={id}
          className={`w-48 justify-between font-normal ${className || ""}`}
        >
          {value ? value.toLocaleDateString() : placeholder}
          <ChevronDownIcon />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-auto overflow-hidden p-0"
        align="start"
      >
        <Calendar
          mode="single"
          selected={value}
          captionLayout="dropdown"
          onSelect={(date) => {
            onValueChange?.(date)
            setOpen(false)
          }}
        />
      </PopoverContent>
    </Popover>
  )
}

