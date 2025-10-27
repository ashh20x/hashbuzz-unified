export interface TransactionResponse {
  nodeId: string;
  transactionHash: string;
  transactionId: string;
}

export interface AdminTransaction {
  id: string;
  transaction_id: string;
  transaction_type: string;
  network: string;
  amount: string;
  status: 'pending' | 'success' | 'failed' | 'processing';
  transaction_data: Record<string, unknown>;
  created_at: string;
  updated_at?: string;
}

export interface TransactionStats {
  totalTransactions: number;
  pendingTransactions: number;
  successfulTransactions: number;
  failedTransactions: number;
}

export interface TransactionFilters {
  page?: number;
  limit?: number;
  status?: string;
  type?: string;
  network?: string;
}
