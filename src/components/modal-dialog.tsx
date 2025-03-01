import { deleteRedisExpenses } from "@/actions/redis-actions";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useExpenseMutations } from "@/contexts/expense-mutations-provider";
import { TSelected } from "@/lib/types";
import { startTransition } from "react";
import { toast } from "sonner";


type ModalDialogProps = {
    children: React.ReactNode;
    selectedToDelete: TSelected[];
    toggleSelected: () => void;
    setOptimisticData: (action: any) => void;
}

export const ModalDialog = ({ children, selectedToDelete, toggleSelected, setOptimisticData }: ModalDialogProps) => {
    const { setExpenseSwitch } = useExpenseMutations();

    const handleDelete = async () => {
        startTransition(() => {
            setOptimisticData({ type: "delete", payload: selectedToDelete.map(i => i.id) })
        })
        toggleSelected();
        const error = await deleteRedisExpenses(selectedToDelete);
        if (error) toast.warning(error);
        setExpenseSwitch(prev => !prev);
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader className="space-y-4">
                    <DialogTitle>You've selected {selectedToDelete.length} {selectedToDelete.length > 1 ? 'expenses' : 'expense'} to delete</DialogTitle>
                    <DialogDescription>
                        This action cannot be undone. Are you sure you want to permanently
                        delete {selectedToDelete.length > 1 ? 'these expenses' : 'this expense'}?
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="gap-1">
                    <DialogClose asChild>
                        <Button variant="ghost" type="button">Cancel</Button>
                    </DialogClose>
                    <DialogClose asChild>
                        <Button
                            type="submit"
                            onClick={handleDelete}
                        >
                            Accept
                        </Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
