const ROUTES = {
  HOME: "/",
  SIGN_IN: "/sign-in",
  SIGN_UP: "/sign-up",
  COMMUNITY: "/community",
  COLLECTIONS: "/collections",
  JOBS: "/jobs",
  TAGS: "/tags",
  TAG: (id: string) => `/tags/${id}`,
  PROFILE: "/profile",
  QUESTIONS: (id: string) => `/questions/${id}`,
  ASK_QUESTION: "/ask-question",
};

export default ROUTES;
