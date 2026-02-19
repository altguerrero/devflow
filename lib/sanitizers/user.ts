export const sanitizeUser = <T extends { password?: string; __v?: number }>(user: T) => {
  const { password, __v, ...safeUser } = user;
  void password;
  void __v;
  return safeUser;
};
