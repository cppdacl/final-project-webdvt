export interface User {
  _id: string;
  username: string;
  fullName: string;
  balance: number;
  role: 'user'|'admin';
  status: 'active'|'suspended';
  createdAt: string;
}

export interface Transaction {
  _id: string;
  type: 'deposit'|'withdrawal'|'transfer_out'|'transfer_in';
  amount: number;
  balanceAfter: number;
  userId: string;
  counterpartyId: string|null;
  counterpartyUsername: string|null;
  note: string;
  createdAt: string;
}

export interface Paginated<T> {
  total: number;
  page: number;
  pages: number;
  transactions?: T[];
  users?: T[];
}