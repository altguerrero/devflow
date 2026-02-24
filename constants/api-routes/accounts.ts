const ACCOUNTS_API_ROUTES = {
  ROOT: "/accounts",
  BY_ID: (id: string) => `/accounts/${id}`,
  BY_PROVIDER: "/accounts/provider",
};

export default ACCOUNTS_API_ROUTES;
