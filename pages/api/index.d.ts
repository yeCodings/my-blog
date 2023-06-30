import { IronSession } from 'iron-session';
import {IUserInfo} from 'store/userStore'

export type ISession = IronSession & Record<string, any>;

export type IComment = {
  id: number;
  content: string;
  create_time: Date;
  update_time: Date;
  user: {
    avatar: string | undefined;
    nickname: string | undefined;
  };
}

export type IArticle = {
  id: number;
  views: number;
  title: string;
  content: string;
  create_time: Date;
  update_time: Date;
  user: IUserInfo;
  comments?: IComment[]; 
}