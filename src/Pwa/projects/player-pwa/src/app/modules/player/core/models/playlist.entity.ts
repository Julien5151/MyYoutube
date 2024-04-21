import { uuid } from '../../../shared/types/uuid.type';
import { Music } from './music.entity';

export interface Playlist {
  id: uuid;
  userId: uuid;
  title: string;
  musics: Array<Music>;
}
