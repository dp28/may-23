import { generateId } from './id';

export const buildAction = (type, data) =>  ({
  id: generateId(),
  type,
  data
});
