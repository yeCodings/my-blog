import { ironOptions } from 'config';
import { prepareConnection } from 'db';
import { User, UserAuth } from 'db/entity';
import { withIronSessionApiRoute } from 'iron-session/next';
import { NextApiRequest, NextApiResponse } from 'next';
import { ISession } from '../index';
import request from 'service/fetch';
import { Cookie } from 'next-cookie';
import { setCookie } from 'utils';

export default withIronSessionApiRoute(redirect, ironOptions);
// clientID 145758f3c3704f70bbe7
// Client secrets  3bd6b2b53aee6eb175686673cdd9a10e83f66ee7
async function redirect(req: NextApiRequest, res: NextApiResponse) {
  const session: ISession = req.session;
  const { code } = req?.query || {};
  const githubClientID = '145758f3c3704f70bbe7';
  const githubSecret = '3bd6b2b53aee6eb175686673cdd9a10e83f66ee7';
  const url = `https://github.com/login/oauth/access_token?client_id=${githubClientID}&client_secret=${githubSecret}&code=${code}`;

  const result = await request.post(url, {}, {
    headers: {
      accept: 'application/json',
    }
  });

  const { access_token } = result as any;

  // 登录成功，拿到githubUserInfo 信息
  const githubUserInfo = await request.get('https://api.github.com/user', {
    headers: {
      accept: 'application/json',
      Authorization: `token ${access_token}`
    }
  })

  // 拿到cookies
  const cookies = Cookie.fromApiRoute(req, res);

  // 建立数据库连接
  const db = await prepareConnection();

  // 从UserAuth里面查找，看是否是通过UserAuth登录 
  const userAuth = await db.getRepository(UserAuth).findOne({
      identity_type: 'github',
      identifier: githubClientID,
    }, {
      relations: ['user'] // 把关联的user 也拿过来
    }
  );
  
  if(userAuth){
    // userAuth 存在，之前登陆过的用户，直接从 user中获取用户信息，并更新 credential
    const user = userAuth?.user;
    const {id,nickname,avatar} = user;

    // 更新 credential
    userAuth.credential = access_token;

    // session 中设置相应的信息
    session.userId = id;
    session.nickname = nickname;
    session.avatar = avatar;

    await session.save();

    setCookie(cookies,{id,nickname,avatar});

    // 登录成功后，302 重定向到首页
    res.writeHead(302,{Location:'/'});
  }else{
    // 创建一个新用户，包括 user 和 user_auth
    const {login = '', avatar_url = ''} = githubUserInfo as any;

    // 新建 user
    const user = new User();
    user.nickname = login;
    user.avatar = avatar_url;

    // 新建 userAuth
    const userAuth = new UserAuth();
    userAuth.identity_type = 'github';
    userAuth.identifier = githubClientID;
    userAuth.credential = access_token;
    userAuth.user = user;

    // 保存
    const userAuthRepo = db.getRepository(UserAuth);
    const resUserAuth = userAuthRepo.save(userAuth);

    const {id,nickname,avatar} = (await resUserAuth)?.user || {};

    session.userId = id;
    session.nickname = nickname;
    session.avatar = avatar;

    await session.save();

    setCookie(cookies,{id,nickname,avatar});

   // 登录成功后，302 重定向到首页
   res.writeHead(302,{Location:'/'});

  }

}