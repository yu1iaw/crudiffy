export type TExpense = {
    id: string;
    description: string;
    amount: number;
    createdAt: number;
}

export type TUserExpenses = {
    shopping: TExpense[];
    food: TExpense[];
    'bills&utilities': TExpense[];
    entetainment: TExpense[];
    others: TExpense[];
}

export type TSelected = {
    id: string;
    date: string;
    index: number;
    category: string;
}

export type TCreated = Omit<TExpense, 'description'> & {
    description: FormDataEntryValue;
    category: FormDataEntryValue;
}

export type TTableRow = TExpense & {
    date: string;
    category: string;
    categoryIndex: number;
}
