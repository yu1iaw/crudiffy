import { createRedisExpense } from "@/actions/redis-actions";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useExpenseMutations } from "@/contexts/expense-mutations-provider";
import { nanoid } from "nanoid";
import Image from "next/image";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "./ui/select";


export const RightSheet = ({ children, setOptimisticData }: { children: React.ReactNode, setOptimisticData: (action: any) => void }) => {
    const { setExpenseSwitch } = useExpenseMutations();


    const formAction = async (formData: FormData) => {
        const { description, amount, category } = Object.fromEntries(formData);
        if (!description || !amount || !category) {
            toast.warning('Incomplete data to create a new expense');
            return;
        }

        const id = nanoid();
        const formattedAmount = parseFloat(amount as string) || 0;
        const createdAt = Date.now();

        setOptimisticData({ type: "create", payload: { id, description, amount: formattedAmount, createdAt } });
        const error = await createRedisExpense({ category, id, description, amount: formattedAmount, createdAt });
        if (error) toast.warning(error);
        setExpenseSwitch(prev => !prev);
    }

    return (
        <Sheet>
            <SheetTrigger asChild>
                {children}
            </SheetTrigger>
            <SheetContent className="flex flex-col">
                <SheetHeader className="pt-8 pb-5">
                    <SheetTitle>Add a new expense</SheetTitle>
                    <SheetDescription>
                        Fill all the fields. Click add when you're done.
                    </SheetDescription>
                </SheetHeader>
                <form action={formAction} className="flex flex-col gap-4 py-8">
                    <div className="flex items-center gap-4">
                        <Label htmlFor="description" className="w-[70px]">Description</Label>
                        <Input
                            id="description"
                            placeholder="a new coat"
                            name="description"
                            autoComplete="off"
                            className="flex-1 hover:bg-slate-300/10 focus:bg-slate-300/20 placeholder:text-slate-400"
                        />
                    </div>
                    <div className="flex items-center gap-4">
                        <Label htmlFor="amount" className="w-[70px]">Amount</Label>
                        <Input
                            id="amount"
                            placeholder="800"
                            name="amount"
                            autoComplete="off"
                            className="flex-1 hover:bg-slate-300/10 focus:bg-slate-300/20 placeholder:text-slate-400"
                        />
                    </div>
                    <Select name="category">
                        <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Categories</SelectLabel>
                                <SelectItem value="shopping">Shopping</SelectItem>
                                <SelectItem value="food">Food</SelectItem>
                                <SelectItem value="bills&utilities">Bills & Utilities</SelectItem>
                                <SelectItem value="entertainment">Entertainment</SelectItem>
                                <SelectItem value="others">Others</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                    <SheetClose asChild className="mt-7">
                        <Button type="submit">Add</Button>
                    </SheetClose>
                </form>
                <SheetFooter className="flex-1">
                    <div className="w-full flex mt-auto items-center justify-center gap-2">
                        <span className="mt-[3px] text-xs text-gray-600 font-[family-name:var(--font-geist-mono)]">made with</span>
                        <Image src='/love.png' alt="love icon" width={22} height={22} className="hover:scale-110 transition" />
                    </div>
                </SheetFooter>
            </SheetContent>
        </Sheet >
    )
}
