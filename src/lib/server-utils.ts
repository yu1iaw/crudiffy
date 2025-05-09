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
    const { getIdToken } = getKindeServerSession();

    try {
        let authTime;
        const idToken = await getIdToken();
        if (idToken) {
            authTime = idToken.updated_at;
            redis.set(`user:${userId}`, idToken.updated_at);
        } else {            
            const redisIdToken = await redis.get(`user:${userId}`);
            if (redisIdToken) {
                authTime = +redisIdToken;
            }
        }
        
        if (!authTime) throw Error(`Token is undefined!`);
        await redis.zadd(`set:${userId}`, "NX",  authTime * 1000, String(authTime * 1000));

        const loggedIn = await redis.zrange(`set:${userId}`, 0, -1);
        if (loggedIn.length > 2) await redis.zpopmin(`set:${userId}`);

        return { loggedIn };
    } catch (error) {
        console.log(error);
        return { error: true };
    }
}