// import Image from 'next/image'

import siteMetadata from '@/data/siteMetadata'
import headerNavLinks from '@/data/headerNavLinks'
import Link from 'next/link'
import MobileNav from './MobileNav'
import ThemeSwitch from './ThemeSwitch'
import UserBtn from './UserBtn'
// import SearchButton from './SearchButton'
import { cn } from '@/lib/utils'
const Header = () => {
  let headerClass =
    'flex items-center w-full bg-white dark:bg-gray-950 justify-between py-5 border-b'
  if (siteMetadata.stickyNav) {
    headerClass += ' sticky top-0 z-50'
  }

  return (
    <header className={headerClass}>
      <Link href="/" aria-label={siteMetadata.headerTitle}>
        <div className="flex items-center justify-between">
          {/* <div className="mr-3">
            <Image src={Logo} alt="Rednote Logo" width={40} height={40} />
          </div> */}
          {typeof siteMetadata.headerTitle === 'string' ? (
            <div className="hidden h-6 text-2xl font-semibold text-primary-500 sm:block">
              {siteMetadata.headerTitle}
            </div>
          ) : (
            siteMetadata.headerTitle
          )}
        </div>
      </Link>
      <div className="flex items-center space-x-4 leading-5 sm:space-x-6">
        <div className="no-scrollbar hidden max-w-40 items-center space-x-4 overflow-x-auto pr-2 sm:flex sm:space-x-6 md:max-w-72 lg:max-w-96">
          {headerNavLinks
            // .filter((link) => link.href !== '/')
            .map((link) => (
              <Link
                key={link.title}
                href={link.href}
                className={cn(
                  'm-1 block font-medium text-gray-900 hover:text-primary-500 dark:text-gray-100 dark:hover:text-primary-400'
                )}
              >
                {link.title}
              </Link>
            ))}
          <Link
            href="/dashboard"
            className={cn(
              'm-1 block font-medium text-gray-900 hover:text-primary-500 dark:text-gray-100 dark:hover:text-primary-400'
            )}
          >
            Dashboard
          </Link>
        </div>
        {/* <SearchButton /> */}
        <UserBtn />
        <ThemeSwitch />
        <MobileNav />
      </div>
    </header>
  )
}

export default Header
