'use client'

import { sidebarLinks } from '@/constants'
import { SignedIn, SignOutButton, useAuth } from '@clerk/nextjs'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const LeftSidebar = () => {
  const pathname = usePathname()
  const { userId } = useAuth()

  return (
    <section className="custom-scrollbar leftsidebar">
      <div className="flex flex-1 flex-col gap-6 px-6">
        {sidebarLinks.map(link => {
          const route = link.route === '/profile' && userId 
            ? `/profile/${userId}` 
            : link.route

          const isActive =
            (pathname.includes(route) && route.length > 1) || pathname === route

          return (
            <Link
              href={route}
              key={link.label}
              className={`leftsidebar_link hover:bg-primary-500 ${isActive && 'bg-primary-500'}`}
            >
              <Image src={link.imgURL} alt={link.label} width={25} height={24} />
              <p className="text-light-1 max-lg:hidden">{link.label}</p>
            </Link>
          )
        })}
      </div>

      <div className="mt-10 px-6">
        <SignedIn>
          <SignOutButton redirectUrl="/sign-in">
            <div className="flex cursor-pointer gap-4 p-4">
              <Image src="/logout.svg" alt="logout" width={24} height={24} />
              <p className="text-light-2 max-lg:hidden">Log Out</p>
            </div>
          </SignOutButton>
        </SignedIn>
      </div>
    </section>
  )
}

export default LeftSidebar
