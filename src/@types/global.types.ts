export enum Role {
  user = "USER",
  admin = "ADMIN",
}

export const onlyAdmin = [Role.admin];
export const onlyUser = [Role.user];
export const allUser = [Role.user, Role.admin];
