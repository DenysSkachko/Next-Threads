'use client'

import { sidebarLinks } from '@/constants'
import { SignedIn, SignedOut, SignOutButton, useAuth } from '@clerk/nextjs'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import ButtonSmall from '@/components/ui/button-small'

import { FiLogIn, FiUserPlus, FiEdit, FiLogOut } from 'react-icons/fi'

const LeftSidebar = () => {
  const pathname = usePathname()
  const { userId } = useAuth()

  return (
    <section className="custom-scrollbar leftsidebar">
      <div className="flex flex-1 flex-col gap-4 px-6">
        {sidebarLinks.map(link => {
          const route = link.route === '/profile' && userId ? `/profile/${userId}` : link.route

          const isActive = (pathname.includes(route) && route.length > 1) || pathname === route

          return (
            <Link
              href={route}
              key={link.label}
              className={`leftsidebar_link hover:bg-primary-500 ${
                isActive ? 'bg-primary-500' : ''
              }`}
            >
              <Image src={link.imgURL} alt={link.label} width={25} height={24} />
              <p className="text-light-1 max-lg:hidden">{link.label}</p>
            </Link>
          )
        })}
      </div>

      <div className="flex gap-2 px-6 mt-4">
        <SignedIn>
          <SignOutButton redirectUrl="/sign-in">
            <ButtonSmall className="bg-primary-500">
              <FiLogOut size={25} className="text-light-1" />
            </ButtonSmall>
          </SignOutButton>

          <Link href="/profile/edit">
            <ButtonSmall className="bg-primary-500">
              <FiEdit size={25} className="text-light-1" />
            </ButtonSmall>
          </Link>
        </SignedIn>

        <SignedOut>
          <Link href="/sign-in">
            <ButtonSmall className="bg-primary-500">
              <FiLogIn size={25} className="text-light-1" />
            </ButtonSmall>
          </Link>

          <Link href="/sign-up">
            <ButtonSmall className="bg-primary-500">
              <FiUserPlus size={25} className="text-light-1" />
            </ButtonSmall>
          </Link>
        </SignedOut>
      </div>
    </section>
  )
}

export default LeftSidebar
