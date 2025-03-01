"use server"

import { cookies } from "next/headers";


export const cookiesAction = async (token: string) => {
    const cookiesStore = await cookies();

    let newLoggedIn: string[] = [];
    const loggedIn = cookiesStore.get('logged_in');
    console.log('data : ', loggedIn);

    if (loggedIn) {
        newLoggedIn = [token, ...JSON.parse(loggedIn.value).filter((i: string) => i !== token)].slice(0, 2);
    } else {
        newLoggedIn.push(token);
    }
    cookiesStore.set('logged_in', JSON.stringify(newLoggedIn), { maxAge: 60 * 60 * 24 * 90 });
    
    const data = cookiesStore.get('logged_in');

    return JSON.parse(data?.value || null as any as string);
}