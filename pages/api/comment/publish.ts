import { ironOptions } from 'config';
import { prepareConnection } from 'db';
import { Article, User, Comment} from 'db/entity';
import { withIronSessionApiRoute } from 'iron-session/next';
import { NextApiRequest, NextApiResponse } from 'next';
import { ISession } from '../index';
import { EXCEPTION_COMMENT } from '../config/code';

export default withIronSessionApiRoute(publish, ironOptions);

async function publish(req: NextApiRequest, res: NextApiResponse) {
  const {articleId = 0, content = ''} = req.body;
  const session: ISession = req.session;

  const db = await prepareConnection(); // 连接数据库
  const commentRepo = db.getRepository(Comment); // 定义一个 commentRepo
  const comment = new Comment(); // 新建一个comment

  comment.content = content;
  comment.create_time = new Date();
  comment.update_time = new Date();

  const user = await db.getRepository(User).findOne({
    where: {
      id: session.userId,
    }
  });

  const article = await db.getRepository(Article).findOne({
    where: {
      id: articleId,
    }
  });

  if(user) comment.user = user;
  if(article) comment.article = article;

  const resComment = await commentRepo.save(comment);

  if(resComment){
    res.status(200).json({
      code: 0,
      msg: '发表成功',
      data: resComment
    })
  }else {
    res.status(200).json({
      ...EXCEPTION_COMMENT.PUBLISH_FAILED
    })
  }

}
  