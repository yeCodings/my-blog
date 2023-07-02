import { ironOptions } from 'config';
import { prepareConnection } from 'db';
import { User } from 'db/entity';
import { withIronSessionApiRoute } from 'iron-session/next';
import { NextApiRequest, NextApiResponse } from 'next';
import { ISession } from '../index';
import { EXCEPTION_USER } from '../config/code';

export default withIronSessionApiRoute(detail, ironOptions);

// 修改用户信息接口api
async function detail(req: NextApiRequest, res: NextApiResponse) {
  const session: ISession = req.session;
  const { userId } = session;

  const db = await prepareConnection();
  const userRepo = db.getRepository(User);

  const user =await userRepo.findOne({
    where: {
      id: userId,
    }
  })
  
  if(user){
    res?.status(200)?.json({
      code: 0,
      msg: '',
      data: {
        userInfo: user
      }
    })
  }else {
    res?.status(200)?.json({
      ...EXCEPTION_USER.NOT_FOUND
    })
  }

}