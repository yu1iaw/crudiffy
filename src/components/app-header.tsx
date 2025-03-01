"use client"

import { LogoutLink } from '@kinde-oss/kinde-auth-nextjs';
import { Coins, LogOut } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from './ui/button';


const routes = [
    { label: 'Dashboard', path: '/app/dashboard' },
    { label: 'Account', path: '/app/account' },
]

export const AppHeader = () => {
    const pathname = usePathname();

    return (
        <header className='flex justify-between items-center py-2'>
            <Link href='/app/dashboard'>
                <Coins size={40} color='white' fill='#e6c300' />
            </Link>
            <nav className='flex gap-2 items-center'>
                <ul className='flex gap-2 items-center text-sm'>
                    {routes.map(route => (
                        <li key={route.label}>
                            <Button
                                asChild
                                variant={route.path === pathname ? "outline" : "ghost"}
                                className='h-8 p-2'
                            >
                                <Link href={route.path}>
                                    {route.label}
                                </Link>
                            </Button>
                        </li>
                    ))}
                    <li className='ml-5 p-2 cursor-pointer'>
                        <LogoutLink>
                            <LogOut color='#1e293b'/>
                        </LogoutLink>
                    </li>
                </ul>
            </nav>
        </header>
    )
}