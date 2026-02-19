const ROUTES = {
  HOME: "/",
  SIGN_IN: "/sign-in",
  SIGN_UP: "/sign-up",
  COMMUNITY: "/community",
  COLLECTIONS: "/collections",
  JOBS: "/jobs",
  TAGS: "/tags",
  PROFILE_BASE: "/profile",
  TAG: (id: string) => `/tags/${id}`,
  PROFILE: (id: string) => `/profile/${id}`,
  QUESTIONS: (id: string) => `/questions/${id}`,
  ASK_QUESTION: "/ask-question",
};

export default ROUTES;
