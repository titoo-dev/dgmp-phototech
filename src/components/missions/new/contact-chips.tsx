"use client";

import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X, Plus } from "lucide-react";
import { ContactModel } from "@/models/contact-schema";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

interface ContactChipsProps {
  contacts: ContactModel[];
  selectedContacts: ContactModel[];
  onContactsChange: (contacts: ContactModel[]) => void;
}

export default function ContactChips({
  contacts,
  selectedContacts,
  onContactsChange,
}: ContactChipsProps) {
  const [open, setOpen] = useState(false);

  const handleAddContact = (contact: ContactModel) => {
    if (!selectedContacts.find(c => c.id === contact.id)) {
      onContactsChange([...selectedContacts, contact]);
    }
    setOpen(false);
  };

  const handleRemoveContact = (contactId: string) => {
    onContactsChange(selectedContacts.filter(c => c.id !== contactId));
  };

  const availableContacts = contacts.filter(
    contact => !selectedContacts.find(c => c.id === contact.id)
  );

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {selectedContacts.map((contact) => (
          <Badge
            key={contact.id}
            variant="secondary"
            className="flex items-center gap-1 px-3 py-1"
          >
            <span>{contact.firstName} {contact.lastName}</span>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-4 w-4 p-0 hover:bg-destructive hover:text-destructive-foreground"
              onClick={() => handleRemoveContact(contact.id)}
            >
              <X className="h-3 w-3" />
            </Button>
          </Badge>
        ))}
        
        {availableContacts.length > 0 && (
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-8 border-dashed"
              >
                <Plus className="h-4 w-4 mr-1" />
                Ajouter membre
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0" align="start">
              <Command>
                <CommandInput placeholder="Rechercher un contact..." />
                <CommandList>
                  <CommandEmpty>Aucun contact trouvé.</CommandEmpty>
                  <CommandGroup>
                    {availableContacts.map((contact) => (
                      <CommandItem
                        key={contact.id}
                        onSelect={() => handleAddContact(contact)}
                      >
                        <div className="flex flex-col">
                          <span className="font-medium">
                            {contact.firstName} {contact.lastName}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            {contact.email}
                          </span>
                        </div>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        )}
      </div>

      {/* Hidden inputs to send selected contact IDs */}
      {selectedContacts.map((contact) => (
        <input
          key={contact.id}
          type="hidden"
          name="memberIds"
          value={contact.id}
        />
      ))}
    </div>
  );
}
