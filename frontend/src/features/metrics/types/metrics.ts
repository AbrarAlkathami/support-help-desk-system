export type Metrics = {
    totalTickets: number;
  
    byStatus: {
      status: string;
      count: number;
    }[];
  
    byCategory: {
      category: string;
      count: number;
    }[];
  };