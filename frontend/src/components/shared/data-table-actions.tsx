"use client";

import type { ReactNode } from "react";

import { MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface DataTableActionsProps {
  children: ReactNode;
  isPending?: boolean;
  label?: string;
}

export function DataTableActions({
  children,
  isPending = false,
  label = "Actions",
}: DataTableActionsProps) {
  return (
    <div onClick={(event) => event.stopPropagation()}>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="size-8 text-muted-foreground hover:text-foreground"
              aria-label={label}
            />
          }
        >
          {isPending ? (
            <Spinner className="size-4" />
          ) : (
            <MoreHorizontal className="size-4" />
          )}
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-48">
          {children}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
