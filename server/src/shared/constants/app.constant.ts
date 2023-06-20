export class APP_CONSTANT {
  static VERSION = 1;
  static APP_PREFIX = `api/v${this.VERSION}`;
  static MODULE_API = {
    test: `test/`,
    auth: `${this.APP_PREFIX}/auth/`,
    post: `${this.APP_PREFIX}/posts/`,
    user: `${this.APP_PREFIX}/users`,
    category: `${this.APP_PREFIX}/categories/`,
    role: `${this.APP_PREFIX}/roles/`,
  };
  static TAGS = {
    TEST: {
      title: `Test`,
      description: `Testing...`,
    },
    AUTH: {
      title: `Auth`,
      description: `Authentication for all app`,
    },
    POST: {
      title: `Post`,
      description: `Manage all posts resource`,
    },
    USER: {
      title: `User`,
      description: `Manage all users resource`,
    },
    CATEGORY: {
      title: `Category`,
      description: `Manage all group resource`,
    },
    ROLE: {
      title: `Role`,
      description: `Manage all roles resource`,
    },
  };

  static ROLES = {
    user: `user`,
    admin: `admin`,
  };
}
