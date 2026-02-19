import ROUTES from "./routes";

export const sidebarLinks = [
  {
    name: "Home",
    href: ROUTES.HOME,
    imgURL: "/icons/home.svg",
  },
  {
    name: "Community",
    href: ROUTES.COMMUNITY,
    imgURL: "/icons/users.svg",
  },
  {
    name: "Collections",
    href: ROUTES.COLLECTIONS,
    imgURL: "/icons/star.svg",
  },
  {
    name: "Find Jobs",
    href: ROUTES.JOBS,
    imgURL: "/icons/suitcase.svg",
  },
  {
    name: "Tags",
    href: ROUTES.TAGS,
    imgURL: "/icons/tag.svg",
  },
  { name: "Profile", href: ROUTES.PROFILE_BASE, imgURL: "/icons/user.svg" },
  { name: "Ask a Question", href: ROUTES.ASK_QUESTION, imgURL: "/icons/question.svg" },
];
