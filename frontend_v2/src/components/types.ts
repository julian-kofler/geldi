export interface GroupParams {
    id?: number;
    name: string;
    completed?: number;
    memberEmails: string[];
  }
  
  export interface GroupMember {
    userId: number; //different in backend: 'id'
    nickname: string;
  }
  
  export interface GroupResponse {
    id: number;
    name: string;
    completed: number;
    members: GroupMember[];
  }
  export interface ExpenseParams {
    id?: number;
    groupId: number;
    title: string;
    amount: number;//backend returns amount as string on GET /expenses
    timestamp: string; //in backend type: Date ,   but returns date as string in ISO format
    payedBy: number;
    payedFor: number[];
    tagId?: number;
    picPath?: string;
  }