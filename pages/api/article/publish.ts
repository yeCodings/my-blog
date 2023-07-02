import { withIronSessionApiRoute } from 'iron-session/next';
import { ironOptions } from 'config';
import { prepareConnection } from 'db';
import { Article, Tag, User } from 'db/entity';
import { NextApiRequest, NextApiResponse } from 'next';
import { ISession } from '../index';
import { EXCEPTION_ARTICLE } from '../config/code';

export default withIronSessionApiRoute(publish, ironOptions);

async function publish(req: NextApiRequest, res: NextApiResponse) {
  // 登录后，可以直接从 req.session 获取当前session
  const session: ISession = req.session;

  // 从req.body 获取当前的 title 和 content
  const { title = '', content = '', tagIds = [] } = req.body;

  // 和数据库建立连接
  const db = await prepareConnection();

  const userRepo = db.getRepository(User);
  const articleRepo = db.getRepository(Article);
  const tagRepo = db.getRepository(Tag);

  // 查找发布文章的用户
  const user = await userRepo.findOne({
    id: session.userId,
  })

  const tags = await tagRepo.find({
    where: tagIds.map((tagId: number) =>  ({id: tagId}))
  })


  // 创建新article数据
  const article = new Article();
  article.title = title;
  article.content = content;
  article.create_time = new Date();
  article.update_time = new Date();
  article.is_delete = 0;
  article.views = 0;

  // 绑定发布文章用户
  if (user) {
    article.user = user;
  }

  if(tags) {
   const newTags = tags?.map(tag => {
      tag.article_count = tag?.article_count + 1;
      return tag;
   });

    article.tags = newTags;
  }

  // 保存发布的文章
  const resArticle = await articleRepo.save(article);

  if (resArticle) {
    res.status(200).json({ code: 0, msg: '发布成功', data: resArticle });
  } else {
    res.status(200).json({ ...EXCEPTION_ARTICLE.PUBLISH_FAILED });
  }

}