import { create } from "zustand";

type TicketUiStore = {
    selectedTicketId: string | null;
    openTicket: (id: string) => void;
    closeTicket: () => void;
  };
  
  export const useTicketUiStore = create<TicketUiStore>((set) => ({
    selectedTicketId: null,
  
    openTicket: (id) => {
      set({ selectedTicketId: id });
    },
  
    closeTicket: () => {
      set({ selectedTicketId: null });
    },
  }));