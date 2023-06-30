import { Avatar } from "antd";
import Link from "next/link";
import { observer } from "mobx-react-lite";
import MarkDown from 'markdown-to-jsx';
import { format } from 'date-fns'
import { prepareConnection } from "db";
import { Article } from "db/entity";
import { IArticle } from "pages/api";
import { useStore } from "store";
import styles from './index.module.scss';


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
    relations: ['user'],
  });

  if(article){
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

  return <div>
    <div className="content-layout">
      <h2 className={styles.title}>{article?.title}</h2>
      <div className={styles.user}>
        <Avatar src={avatar} size={50} />
        <div className={styles.info}>
          <div className={styles.name}>{nickname}</div>
          <div className={styles.date}>
            <div>{format(new Date(article?.update_time),'yyyy-MM-dd hh:mm:ss')}</div>
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
  </div>
};

export default observer(ArticleDetail);
