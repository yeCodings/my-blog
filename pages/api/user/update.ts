import { ironOptions } from 'config';
import { prepareConnection } from 'db';
import { User } from 'db/entity';
import { withIronSessionApiRoute } from 'iron-session/next';
import { NextApiRequest, NextApiResponse } from 'next';
import { ISession } from '../index';
import { EXCEPTION_USER } from '../config/code';

export default withIronSessionApiRoute(update, ironOptions);

// 修改用户信息接口api
async function update(req: NextApiRequest, res: NextApiResponse) {
  const session: ISession = req.session;
  const { userId } = session;
  const {nickname ='',job = '',introduce = ''} = req.body;

  const db = await prepareConnection();
  const userRepo = db.getRepository(User);

  const user =await userRepo.findOne({
    where: {
      id: userId,
    }
  })
  
  if(user){
    user.nickname = nickname;
    user.job = job;
    user.introduce = introduce;

    const resUser = await userRepo.save(user);

    res?.status(200)?.json({
      code: 0,
      msg: '',
      data: resUser,
    })
  }else {
    res?.status(200)?.json({
      ...EXCEPTION_USER.NOT_FOUND
    })
  }

}