export const sanitizeAccount = <
  T extends {
    accessToken?: string;
    refreshToken?: string;
    idToken?: string;
    __v?: number;
  },
>(
  account: T
) => {
  const { accessToken, refreshToken, idToken, __v, ...safeAccount } = account;
  void accessToken;
  void refreshToken;
  void idToken;
  void __v;

  return safeAccount;
};
