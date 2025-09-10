"use client"

import * as React from "react"
import { Check, ChevronsUpDown, Building } from "lucide-react"
import type { ProjectWithCompany } from "@/actions/project/get-projects-action"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface ProjectComboboxProps {
  projects: ProjectWithCompany[];
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  name?: string;
  className?: string;
}

export function ProjectCombobox({ 
  projects, 
  value = "", 
  onValueChange, 
  placeholder = "Sélectionner un projet...",
  name,
  className 
}: ProjectComboboxProps) {
  const [open, setOpen] = React.useState(false)
  const [selectedValue, setSelectedValue] = React.useState(value)

  // Sync internal state with prop value
  React.useEffect(() => {
    setSelectedValue(value)
  }, [value])

  const handleSelect = (currentValue: string) => {
    const newValue = currentValue === selectedValue ? "" : currentValue
    setSelectedValue(newValue)
    onValueChange?.(newValue)
    setOpen(false)
  }

  const selectedProject = projects.find((project) => project.id === selectedValue)

  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn("w-full justify-between", className)}
          >
            <div className="flex items-center gap-2">
              <Building className="h-4 w-4 text-muted-foreground" />
              {selectedProject ? (
                <span className="truncate">{selectedProject.title}</span>
              ) : (
                placeholder
              )}
            </div>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <Command>
            <CommandInput placeholder="Rechercher un projet..." className="h-9" />
            <CommandList>
              <CommandEmpty>Aucun projet trouvé.</CommandEmpty>
              <CommandGroup>
                {projects.map((project) => (
                  <CommandItem
                    key={project.id}
                    value={project.id}
                    onSelect={handleSelect}
                  >
                    <div className="flex flex-col flex-1">
                      <span className="font-medium">{project.title}</span>
                      <span className="text-sm text-muted-foreground">{project.company.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {project.status} • {project.nature}
                      </span>
                    </div>
                    <Check
                      className={cn(
                        "ml-auto h-4 w-4",
                        selectedValue === project.id ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      {name && (
        <input
          type="hidden"
          name={name}
          value={selectedValue}
        />
      )}
    </>
  )
}
