"use server";

import { months } from "@/lib/constants";
import { redis } from "@/lib/redis";
import { getKindeUserInfo } from "@/lib/server-utils";
import { TCreated, TSelected } from "@/lib/types";
import { revalidateTag, unstable_cache } from "next/cache";
import { redirect } from "next/navigation";


let [monthKey, yearKey, userIdKey] = ['', '', ''];

export const getRedisExpenses = unstable_cache(async (month: string, year: number, userId: string): Promise<string | null> => {
    [monthKey, yearKey, userIdKey] = [month, year.toString(), userId];
    
    try {
        const expenses = await redis.call('json.get', `${month.toLowerCase()}:${year}`, `$.user:${userId}`);
        
        return expenses as string | null;
    } catch (error) {
        console.log(error);
        return null;
    }
}, [monthKey, yearKey, userIdKey], { tags: ['user-expenses'], revalidate: 1800 })


export const deleteRedisExpenses = async (array: TSelected[]) => {
    const userData = await getKindeUserInfo();
    if (!userData?.isAuthenticated) redirect('/api/auth/login');
    if (!userData.isPayingMember) redirect('/');


    const modArr = array.sort((a, b) => b.index - a.index);

    try {
        await Promise.all(modArr.map(item => {
            return redis.call('json.del', item.date, `$.user:${userData.user.id}['${item.category}'][${item.index}]`);
        }))

        revalidateTag('user-expenses');
    } catch (error) {
        console.log(error);
        return `Failed to delete ${modArr.length > 1 ? "the expenses" : "an expense"}`;
    }
}

export const editRedisExpense = async (editedItem: { date: string; category: string; index: number; payload: {}}) => {
    const userData = await getKindeUserInfo();
    if (!userData?.isAuthenticated) redirect('/api/auth/login');
    if (!userData.isPayingMember) redirect('/');

    try {
        await redis.call('json.merge', editedItem.date, `$.user:${userData.user.id}['${editedItem.category}'][${editedItem.index}]`, `${JSON.stringify(editedItem.payload)}`)

        revalidateTag('user-expenses');
    } catch (error) {
        console.log(error);
        return 'Failed to update an expense';
    }
}

export const createRedisExpense = async ({ id, description, amount, createdAt, category }: TCreated) => {
    const userData = await getKindeUserInfo();
    if (!userData?.isAuthenticated) redirect('/api/auth/login');
    if (!userData.isPayingMember) redirect('/');

    
    const date = `${months[new Date().getMonth()].toLowerCase()}:${new Date().getFullYear()}`;

    try {
        const isDateExists = await redis.call('json.get', date, `$.user:${userData.user.id}`) as any as string | null;
        if (!isDateExists) {
            await redis.call('json.set', date, "$", '{}');
            await redis.call('json.merge', date, `$.user:${userData.user.id}`, '{"shopping": [], "food": [], "bills&utilities": [], "entertainment": [], "others": []}');
        } else if (!JSON.parse(isDateExists).length) {
            await redis.call('json.merge', date, `$.user:${userData.user.id}`, '{"shopping": [], "food": [], "bills&utilities": [], "entertainment": [], "others": []}');
        }

        await redis.call('json.arrinsert', date, `$.user:${userData.user.id}['${category}']`, 0, `${JSON.stringify({ id, description, amount, createdAt })}`);

        revalidateTag('user-expenses');
    } catch (error) {
        console.log(error);
        return 'Failed to create a new expense';
    }

}
