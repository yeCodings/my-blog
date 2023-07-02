import { withIronSessionApiRoute } from 'iron-session/next';

import { ironOptions } from "config";
import { NextApiRequest, NextApiResponse } from "next";
import { ISession } from "..";
import { prepareConnection } from "db";
import { Tag } from 'db/entity';

export default withIronSessionApiRoute(get,ironOptions); // 处理与 Iron Session API 相关的路由

async function get(req: NextApiRequest, res: NextApiResponse){
  const session:ISession = await req.session;
  const {userId = 0} = session;
  
  // 使用 await 等待 prepareConnection() 函数返回一个 Promise 对象
  const db = await prepareConnection();

  // 从数据库中获取指定用户 ID 的标签仓库
  const tagRepo = db.getRepository(Tag);

  // 获取所有关注的标签
  const followTags = await tagRepo.find({
    relations: ['users'],
    where:(qb: any)=> {
      qb.where('user_id =:id',{
        id: Number(userId),
      })
    }
  })
  
  // 所有标签
  const allTags = await tagRepo.find({
    relations: ['users']
  })

  res?.status(200)?.json({
    code: 0,
    msg: '',
    data: {
      followTags,
      allTags,
    }
  })
}