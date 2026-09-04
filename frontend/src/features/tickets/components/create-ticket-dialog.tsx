"use client";

import { useState } from "react";
import { PlusIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { CreateTicketForm } from "@/features/tickets/components/create-ticket-form";

export function CreateTicketDialog() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button>
            <PlusIcon />
            New Ticket
          </Button>
        }
      />

      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Create a new ticket</DialogTitle>

          <DialogDescription>
            Tell the support team what you need help with.
          </DialogDescription>
        </DialogHeader>

        <CreateTicketForm onSuccess={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
