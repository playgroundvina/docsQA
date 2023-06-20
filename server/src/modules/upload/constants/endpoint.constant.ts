enum Model_API {
  CREATE = '',
  FIND_ALL = '',
  FIND_BY_ID = ':id',
  UPDATE = ':id',
  REMOVE = ':id',
  FIND_BY_OWNER = 'owner/:id',
  FIND_BY_FILE = ':id/:filename',
}

export default Model_API;
