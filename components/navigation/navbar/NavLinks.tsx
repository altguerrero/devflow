"use client";

import { sidebarLinks } from "@/constants";
import ROUTES from "@/constants/routes";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { SheetClose } from "@/components/ui/sheet";
import React from "react";

interface NavLinksProps {
  isMobileNav?: boolean;
  userId?: string | null;
}

const NavLinks = ({ isMobileNav = false, userId = "1" }: NavLinksProps) => {
  const pathName = usePathname();
  const profilePath = ROUTES.PROFILE_BASE;

  const getHref = (href: string) => {
    if (href !== profilePath) return href;
    if (!userId) return null;
    return ROUTES.PROFILE(userId);
  };

  return (
    <>
      {sidebarLinks.map((link) => {
        const href = getHref(link.href);
        if (!href) return null;

        const isActive = (pathName.includes(href) && href.length > 1) || pathName === href;

        const LinkComponent = (
          <Link
            href={href}
            key={link.name}
            className={cn(
              isActive ? "primary-gradient text-light-900 rounded-lg" : "text-dark300_light900",
              "flex items-center justify-start gap-4 bg-transparent p-4"
            )}
          >
            <Image
              src={link.imgURL}
              width={20}
              height={20}
              alt={`${link.name} icon`}
              className={cn({ "invert-colors": !isActive })}
            />
            <p className={cn(isActive ? "base-bold" : "base-medium", !isMobileNav && "max-lg:hidden")}>{link.name}</p>
          </Link>
        );

        return isMobileNav ? (
          <SheetClose asChild key={link.name}>
            {LinkComponent}
          </SheetClose>
        ) : (
          <React.Fragment key={link.name}>{LinkComponent}</React.Fragment>
        );
      })}
    </>
  );
};

export default NavLinks;
