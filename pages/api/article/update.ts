import { withIronSessionApiRoute } from 'iron-session/next';
import { ironOptions } from 'config';
import { prepareConnection } from 'db';
import { Article } from 'db/entity';
import { NextApiRequest, NextApiResponse } from 'next';
import { EXCEPTION_ARTICLE } from '../config/code';

export default withIronSessionApiRoute(update, ironOptions);

async function update(req: NextApiRequest, res: NextApiResponse) {

  // 从req.body 获取当前的 title 和 content
  const { title = '', content = '',id = 0} = req.body;

  // 和数据库建立连接
  const db = await prepareConnection();

  const articleRepo = db.getRepository(Article);

  // 查找article数据
  const article = await articleRepo.findOne({
    where: {
      id
    },
    relations: ['user']
  });

  if(article){
    article.title = title;
    article.content = content;
    article.update_time = new Date();

      // 保存已修改的文章
    const resArticle = await articleRepo.save(article);

    if (resArticle) {
      res.status(200).json({ code: 0, msg: '更细成功', data: resArticle });
    } else {
      res.status(200).json({ ...EXCEPTION_ARTICLE.UPDATE_FAILED });
    }
  }else {
    res.status(200).json({ ...EXCEPTION_ARTICLE.NOT_FOUND });
  }

}