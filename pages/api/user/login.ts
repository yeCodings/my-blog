import { ironOptions } from 'config';
import { prepareConnection } from 'db';
import { User, UserAuth } from 'db/entity';
import { withIronSessionApiRoute } from 'iron-session/next';
import { NextApiRequest, NextApiResponse } from 'next';
import { ISession } from '../index';

export default withIronSessionApiRoute(login, ironOptions);

async function login(req: NextApiRequest, res: NextApiResponse) {
  const { phone = '', verify = '', identity_type = 'phone' } = req.body;
  const session: ISession = req.session;

  const db = await prepareConnection();
  const userRepo = db.getRepository(User);
  const userAuthRepo = db.getRepository(UserAuth);
  const users = await userRepo.find();

  if (String(session.verifyCode) === String(verify)) {
    // 验证码是正确的,在user_auths 表里面查找 identity_type 是否有记录
    const userAuth = await userAuthRepo.findOne(
      {
        identity_type,
        identifier: phone,
      },
      {
        relations: ['user']
      }
    );

    if (userAuth) {
      // 已存在的用户,信息保存到session中
      const user = userAuth.user;
      const {id,nickname,avatar} = user;

      session.id = id;
      session.nickname = nickname;
      session.avatar = avatar;

      await session.save();
      
      // 登录成功,返回data数据
      res?.status(200).send({ code: 0,msg: '登录成功', data: {
        userId: id,
        nickname,
        avatar,
      }});

    } else {
      // 新用户，需要自动注册，信息保存到session中
      const user = new User();
      user.nickname = `用户_${Math.floor(Math.random() * 10000)}`
      user.avatar = '/images/avatar.jpg';
      user.job = '暂无';
      user.introduce = '暂无';
  
      const userAuth = new UserAuth();
      userAuth.identifier = phone;
      userAuth.identity_type = identity_type;
      userAuth.credential = session.verifyCode;
      userAuth.user = user;
      
      // 保存相关信息
      const resUserAuth = await userAuthRepo.save(userAuth);
      
      const {user: {id,nickname,avatar}} = resUserAuth;

      session.id = id;
      session.nickname = nickname;
      session.avatar = avatar;
      // 保存相关信息到 session
      await session.save();

      res?.status(200).send({ code: 0,msg: '登录成功', data: {
        userId: id,
        nickname,
        avatar,
      }});
    }
  }else{
    // 验证码错误
    res?.status(200).send({ code: -1,msg: '验证码错误'});
  }
}