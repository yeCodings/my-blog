import { useState } from "react";
import { Avatar, Button, Divider, Input, message } from "antd";
import Link from "next/link";
import { observer } from "mobx-react-lite";
import MarkDown from 'markdown-to-jsx';
import { format } from 'date-fns'

import { prepareConnection } from "db";
import { Article } from "db/entity";
import { IArticle } from "pages/api";
import { useStore } from "store";
import styles from './index.module.scss';
import request from 'service/fetch';


interface IProps {
  article: IArticle;
}

/**
 *在 Next.js 中使用 getServerSideProps 函数获取服务器端渲染所需的数据
 *
 * @export getServerSideProps
 * @return {*} 返回一个含有 articles 的 props对象
 */
export async function getServerSideProps({ params }: any) {

  const articleId = params?.id;

  // 连接数据库
  const db = await prepareConnection();

  const articleRepo = db.getRepository(Article);

  // 从数据库获取 articles数据
  const article = await articleRepo.findOne({
    where: {
      id: articleId
    },
    relations: ['user', 'comments', 'comments.user'], // 把相关的信息都拿过来
  });

  if (article) {
    // 阅读次数+1
    article.views = article.views + 1;
    await articleRepo.save(article);
  }

  return {
    props: {
      article: JSON.parse(JSON.stringify(article)),
    },
  };
}

const ArticleDetail = (props: IProps) => {
  const store = useStore();
  const loginUserInfo = store?.user?.userInfo;
  const { article } = props;
  const { user: { nickname, avatar, id } } = article;
  const [inputValue, setInputValue] = useState('');
  const [comments,setComments] = useState(article?.comments || [])

  const handleComment = () => {
    request.post('/api/comment/publish', {
      articleId: article?.id,
      content: inputValue
    }).then((res: any) => {
      if (res.code === 0) {
        message.success('发表成功');
        const newComments = [{
          id: Math.random(),
          content: inputValue,
          create_time: new Date(),
          update_time: new Date(),
          user: {
            avatar: loginUserInfo?.avatar,
            nickname: loginUserInfo?.nickname,
          }
        }].concat([...comments]);

        setComments(newComments);
        setInputValue('');  // 清空输入框
      } else {
        message.error('发表失败');
      }
    });
  };

  return <div>
    <div className="content-layout">
      <h2 className={styles.title}>{article?.title}</h2>
      <div className={styles.user}>
        <Avatar src={avatar} size={50} />
        <div className={styles.info}>
          <div className={styles.name}>{nickname}</div>
          <div className={styles.date}>
            <div>{format(new Date(article?.update_time), 'yyyy-MM-dd hh:mm:ss')}</div>
            <div>阅读{article?.views}</div>
            {
              Number(loginUserInfo?.userId) === Number(id) && (
                <Link href={`/editor/${article?.id}`}>编辑</Link>
              )
            }
          </div>
        </div>
      </div>
      <MarkDown className={styles.markdown}>{article?.content}</MarkDown>
    </div>
    <div className={styles.divider}></div>
    <div className="content-layout">
      <div className={styles.comment}>
        <h3>评论</h3>
        {
          loginUserInfo?.userId && (
            <div className={styles.enter}>
              <Avatar src={avatar} size={40} />
              <div className={styles.content}>
                <Input.TextArea
                  placeholder='请输入评论'
                  rows={4} value={inputValue}
                  onChange={(event) => setInputValue(event.target.value)}
                />
                <Button className={styles.btn} type="primary" onClick={handleComment} >提交评论</Button>
              </div>
            </div>
          )
        }
        <Divider />
        <div className={styles.display}>
          {
            comments?.map((comment: any) => (
              <div className={styles.wrapper} key={comment.id}>
                <Avatar src={comment?.user?.avatar} size={40} />
                <div className={styles.info}>
                  <div className={styles.name}>
                    <div>{comment?.user?.nickname}</div>
                    <div className={styles.date}>
                      {format(new Date(comment?.update_time), 'yyyy-MM-dd hh:mm:ss')}
                    </div>
                  </div>
                  <div className={styles.content}>{comment?.content}</div>
                </div>
              </div>
            ))
          }
        </div>
      </div>
    </div>
  </div>
};

export default observer(ArticleDetail);
