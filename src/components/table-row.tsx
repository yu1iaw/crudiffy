import { editRedisExpense } from "@/actions/redis-actions";
import { useExpenseMutations } from "@/contexts/expense-mutations-provider";
import { TTableRow } from "@/lib/types";
import { Cell, flexRender, Row } from "@tanstack/react-table";
import { CheckCircle2, XCircle } from "lucide-react";
import { Dispatch, SetStateAction, startTransition, useEffect, useState } from "react";
import { toast } from "sonner";
import { Input } from "./ui/input";
import { TableCell, TableRow } from "./ui/table";


type DashboardTableRowProps = {
    row: Row<TTableRow>;
    editMode: boolean;
    setOptimisticData: (action: any) => void;
}

export const DashboardTableRow = ({ row, editMode, setOptimisticData }: DashboardTableRowProps) => {
    const [description, setDescription] = useState(row.original.description);
    const [amount, setAmount] = useState(String(row.original.amount));
    const { setExpenseSwitch } = useExpenseMutations();

    useEffect(() => {
        setDescription(row.original.description);
        setAmount(String(row.original.amount));
    }, [row.original])


    const handleSubmit = async () => {
        if (!description) return;

        startTransition(() => {
            setOptimisticData({ type: "edit", payload: { ...row.original, description, amount } })
        })
        row.toggleSelected();

        const error = await editRedisExpense({
            date: row.original.date,
            category: row.original.category,
            index: row.original.categoryIndex,
            payload: { description, amount: parseFloat(amount) || 0 }
        })
        if (error) toast.warning(error);
        setExpenseSwitch(prev => !prev);
    }

    return (
        <TableRow
            key={row.id}
            data-state={row.getIsSelected() && "selected"}
            className="bg-slate-50"
        >
            {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                    {row.getIsSelected() && editMode ? (
                        cell.id.includes('select') ? (
                            <div className="flex gap-2">
                                <CheckCircle2
                                    size={18}
                                    stroke="darkgreen"
                                    onClick={handleSubmit}
                                    className="cursor-pointer"
                                />
                                <XCircle
                                    size={18}
                                    stroke="#334155"
                                    onClick={() => {
                                        row.toggleSelected();
                                    }}
                                    className="cursor-pointer"
                                />
                            </div>
                        ) : (
                            <CellInput
                                cell={cell}
                                description={description}
                                amount={amount}
                                setDescription={setDescription}
                                setAmount={setAmount}
                                onKeyPress={handleSubmit}
                            />
                        )
                    ) : (
                        flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext())
                    )}
                </TableCell>
            ))}
        </TableRow>
    )
}

type CellInputProps = {
    cell: Cell<TTableRow, unknown>;
    description: string;
    setDescription: Dispatch<SetStateAction<string>>;
    amount: string;
    setAmount: Dispatch<SetStateAction<string>>;
    onKeyPress: () => Promise<void>;
}

const CellInput = ({ cell, description, amount, setDescription, setAmount, onKeyPress }: CellInputProps) => {
    return (
        <Input
            value={cell.id.includes('description') ? description : amount}
            onChange={(e) => {
                cell.id.includes('description')
                    ? setDescription(e.target.value)
                    : setAmount(parseFloat(e.target.value) !== null ? e.target.value : "")
            }}
            onKeyDown={e => cell.id.includes('amount') ? e.key === "Enter" && onKeyPress() : undefined}
            className="h-[30px] py-0 hover:bg-white/10 focus:bg-white/20"
        />
    )
}