const USERS_API_ROUTES = {
  ROOT: "/users",
  BY_ID: (id: string) => `/users/${id}`,
  BY_EMAIL: "/users/email",
};

export default USERS_API_ROUTES;
