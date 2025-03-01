"use client"
import { useDateFilter } from "@/contexts/date-filter-provider";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "./ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { ScrollArea } from "./ui/scroll-area";


const data = {
    months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    years: ['2024', '2025', '2026', '2027', '2028', '2029', '2030', '2031', '2032', '2033',]
}

export const Combobox = ({ category }: { category: 'months' | 'years' }) => {
    const { setMonth, setYear, month, year } = useDateFilter();
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(category === 'months' ? month : String(year));
    const singleCategory = category.slice(0, -1);
    

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className={cn("w-[160px] h-7 justify-between", { 'w-24': category === 'years' })}
                >
                    {value
                        ? data[category].find((i) => i === value)
                        : singleCategory}
                    <ChevronsUpDown className="opacity-50" />
                </Button>
            </PopoverTrigger>

            <PopoverContent className="w-[160px] p-0">
                <Command>
                    <CommandInput placeholder={`Search ${singleCategory}...`} className="h-9" />
                    <CommandList>
                        <ScrollArea className="h-[135px] py-1">
                            <CommandEmpty>{`${singleCategory} not found`}</CommandEmpty>
                            <CommandGroup>
                                {data[category].map((i) => (
                                    <CommandItem
                                        key={i}
                                        value={i}
                                        onSelect={(currentValue) => {
                                            setValue(currentValue);
                                            category === "months" ? setMonth(currentValue) : setYear(+currentValue)
                                            setOpen(false)
                                        }}
                                    >
                                        {i}
                                        <Check
                                            className={cn(
                                                "ml-auto",
                                                value === i ? "opacity-100" : "opacity-0"
                                            )}
                                        />
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </ScrollArea>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}
