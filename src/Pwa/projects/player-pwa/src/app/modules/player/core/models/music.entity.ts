import { uuid } from '../../../shared/types/uuid.type';

export interface Music {
  id: uuid;
  oid: number;
  title: string;
  ownerId: uuid;
}
