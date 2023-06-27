import { IronSession } from 'iron-session';
import {IUserInfo} from 'store/userStore'

export type ISession = IronSession & Record<string, any>;

export type IArticle = {
  id: number;
  views: number;
  title: string;
  content: string;
  create_time: Date;
  update_time: Date;
  user: IUserInfo;
}