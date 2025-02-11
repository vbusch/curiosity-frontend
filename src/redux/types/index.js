import { appTypes } from './appTypes';
import { graphTypes } from './graphTypes';
import { inventoryTypes } from './inventoryTypes';
import { messageTypes } from './messageTypes';
import { platformTypes } from './platformTypes';
import { queryTypes } from './queryTypes';
import { rhsmTypes } from './rhsmTypes';
import { toolbarTypes } from './toolbarTypes';
import { userTypes } from './userTypes';

const reduxTypes = {
  app: appTypes,
  graph: graphTypes,
  inventory: inventoryTypes,
  message: messageTypes,
  platform: platformTypes,
  query: queryTypes,
  rhsm: rhsmTypes,
  toolbar: toolbarTypes,
  user: userTypes
};

export {
  reduxTypes as default,
  reduxTypes,
  appTypes,
  graphTypes,
  inventoryTypes,
  messageTypes,
  platformTypes,
  queryTypes,
  rhsmTypes,
  toolbarTypes,
  userTypes
};
