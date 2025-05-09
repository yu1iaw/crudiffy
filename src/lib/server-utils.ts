import "server-only";

import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redis } from "./redis";


export const getKindeUserInfo = async () => {
    const { isAuthenticated, getUser } = getKindeServerSession();
    
    try {
        const [isAuth, user] = await Promise.all([isAuthenticated(), getUser()]);
        const isPayingMember = await redis.sismember('membership', user?.id ?? '');

        return { isAuthenticated: isAuth, user, isPayingMember };
    } catch (error) {
        console.log(error);
    }
}

export const getRedisLoggedInfo = async (userId: string) => {
    const { getAccessToken } = getKindeServerSession();

    try {
        // const idToken = await getIdToken();
        const accessToken = await getAccessToken();
        if (!accessToken) throw Error(`Access token is ${accessToken}`);

        await redis.zadd(`set:${userId}`, "NX", accessToken?.iat * 1000, String(accessToken?.iat * 1000));

        const loggedIn = await redis.zrange(`set:${userId}`, 0, -1);
        if (loggedIn.length > 2) await redis.zpopmin(`set:${userId}`);

        return { loggedIn };
    } catch (error) {
        console.log(error);
        return { error: true };
    }
}