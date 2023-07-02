import { withIronSessionApiRoute } from 'iron-session/next';

import { ironOptions } from "config";
import { NextApiRequest, NextApiResponse } from "next";
import { ISession } from "..";
import { prepareConnection } from "db";
import { Tag,User } from 'db/entity';
import { EXCEPTION_TAG, EXCEPTION_USER } from '../config/code';

export default withIronSessionApiRoute(follow,ironOptions); // 处理与 Iron Session API 相关的路由

async function follow(req: NextApiRequest, res: NextApiResponse){
  const session:ISession = await req.session;
  const {userId = 0} = session;
  const {tagId,type} = req.body;
  // 使用 await 等待 prepareConnection() 函数返回一个 Promise 对象
  const db = await prepareConnection();

  // 从数据库中获取指定用户 ID 的标签仓库
  const tagRepo = db.getRepository(Tag);
  const userRepo = db.getRepository(User);

  const user = await userRepo.findOne({
    where: {
      id: userId
    }
  })

  const tag = await tagRepo.findOne({
    relations: ['users'],
    where: {
      id: tagId
    }
  });

  if(!user){
    res?.status(200).json({
      ...EXCEPTION_USER.NOT_LOGIN,
    })
  }

  if(tag?.users){
    if(type === 'follow'){
      tag.users = tag?.users?.concat([user])
      tag.follow_count += 1
    }else if(type === 'unfollow') {
      tag.users = tag?.users?.filter((user)=> user.id !== userId);
      tag.follow_count -= 1
    }
  }

  if(tag) {
    const resTag =await tagRepo.save(tag);
    res.status(200).json({
      code: 0,
      msg: '',
      data: resTag,
    })
  }else {
    res?.status(200).json({
      ...EXCEPTION_TAG.FOLLOW_FAILED
    });
  }

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