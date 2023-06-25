import { ironOptions } from 'config';
import { withIronSessionApiRoute } from 'iron-session/next';
import { NextApiRequest, NextApiResponse } from 'next';
import { ISession } from '..';
import { Cookie } from 'next-cookie';
import { clearCookie } from 'utils';


export default withIronSessionApiRoute(logout, ironOptions);


/**
 *  logout 清除session 和 cookie
 *
 * @param {NextApiRequest} req
 * @param {NextApiResponse} res
 */
async function logout(req: NextApiRequest, res: NextApiResponse) {
  const session: ISession = req.session;
  const cookies = Cookie.fromApiRoute(req,res);

  // 使用session的 destroy方法 清除 session
  await session.destroy();

  // 清除cookie
  clearCookie(cookies);

  res.status(200).json({
    code: 0,
    msg: '退出成功',
    data: {},
  })

}