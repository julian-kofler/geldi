export interface Expense {
  id: number;
  title: string;
  amount: string;
  date: string;
  payedby: string;
}
export interface ExpenseParams {
  id?: number;
  groupId?: number;
  title: string;
  amount: number;
  timestamp: Date;
  payedBy: number;
  payedFor: number[];
  tagId?: number;
  picPath?: string;
}