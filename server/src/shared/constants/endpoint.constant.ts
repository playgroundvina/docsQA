export enum AUTH_API {
  REGISTER = 'register',
  LOGIN = 'login',
}

export enum USER_API {
  CREATE = '',
  FIND_ALL = '',
  FIND_BY_ID = ':id',
  FIND_BY_EMAIL = 'email/:email',
  UPDATE = ':id',
  REMOVE = ':id',
}

export enum ROLE_API {
  CREATE = '',
  FIND_ALL = '',
  FIND_BY_ID = ':id',
  UPDATE = ':id',
  REMOVE = ':id',
}
