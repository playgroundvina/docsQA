enum Model_API {
  CREATE = '',
  FIND_ALL = '',
  FIND_ALL_BY_FILE = ':id',
  CHAT = ':id',
  CHATSTREAM = 'stream/:id',
  UPDATE = ':id',
  REMOVE = ':id',
}

export default Model_API;
