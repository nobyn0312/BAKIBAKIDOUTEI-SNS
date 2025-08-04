"use client";

import { Home, Search, Bell, User } from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";

export default function Navbar() {
	const pathname = usePathname();

	const isActive = (path: string) => {
		return pathname === path;
	};

	return (
		<nav className='fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 md:hidden'>
			<div className='flex justify-around items-center h-16'>
				<Link
					href='/'
					className={`flex flex-col items-center justify-center w-full h-full transition-colors ${
						isActive("/")
							? "text-blue-600"
							: "text-gray-600 hover:text-blue-600"
					}`}
				>
					<Home className='h-6 w-6 mb-1' />
					<span className='text-xs'>ホーム</span>
				</Link>
				<Link
					href='/search'
					className={`flex flex-col items-center justify-center w-full h-full transition-colors ${
						isActive("/search")
							? "text-blue-600"
							: "text-gray-600 hover:text-blue-600"
					}`}
				>
					<Search className='h-6 w-6 mb-1' />
					<span className='text-xs'>検索</span>
				</Link>
				<Link
					href='/notifications'
					className={`flex flex-col items-center justify-center w-full h-full transition-colors ${
						isActive("/notifications")
							? "text-blue-600"
							: "text-gray-600 hover:text-blue-600"
					}`}
				>
					<Bell className='h-6 w-6 mb-1' />
					<span className='text-xs'>通知</span>
				</Link>
				<Link
					href='/profile'
					className={`flex flex-col items-center justify-center w-full h-full transition-colors ${
						isActive("/profile")
							? "text-blue-600"
							: "text-gray-600 hover:text-blue-600"
					}`}
				>
					<User className='h-6 w-6 mb-1' />
					<span className='text-xs'>プロフィール</span>
				</Link>
			</div>
		</nav>
	);
}
