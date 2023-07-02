
import { Avatar, Button, Divider } from "antd";
import Link from "next/link";
import { observer } from "mobx-react-lite";
import { CodeOutlined, FireOutlined, FundViewOutlined } from "@ant-design/icons";

import { prepareConnection } from "db";
import { Article, User } from "db/entity";
import { IArticle } from "pages/api";
import styles from './index.module.scss';
import ListItem from "components/ListItem";


/**
 *在 Next.js 中使用 getServerSideProps 函数获取服务器端渲染所需的数据
 *
 * @export getServerSideProps
 * @return {*} 返回一个含有 articles 的 props对象
 */
export async function getServerSideProps({ params }: any) {

  const userId = params?.id;

  // 连接数据库
  const db = await prepareConnection();

  const userRepo = db.getRepository(User);
  const articleRepo = db.getRepository(Article);

  // 从数据库获取 articles数据
  const user = await userRepo.findOne({
    where: {
      id: Number(userId)
    }
  });

  const articles = await articleRepo.find({
    where: {
      user: {
        id: Number(userId)
      }
    },
    relations: ['user', 'tags'],
  })

  return {
    props: {
      userInfo: JSON.parse(JSON.stringify(user)),
      articles: JSON.parse(JSON.stringify(articles)),
    },
  };
}

const UserDetail = (props: any) => {
  const { userInfo = {}, articles = [] } = props;
  const viewsCount = articles?.reduce((prev: any, next: any) => prev + next?.views, 0);


  return (
    <div className={styles.userDetail}>
      <div className={styles.left}>
        <div className={styles.userInfo}>
          <Avatar className={styles.avatar} src={userInfo?.avatar} size={90} />
          <div>
            <div className={styles.nickname}>{userInfo?.nickname}</div>
            <div className={styles.desc}>
              <CodeOutlined /> {userInfo?.job}
            </div>
            <div className={styles.desc}>
              <FireOutlined /> {userInfo?.introduce}
            </div>
          </div>
          <Link href='/user/profile'>
            <Button>编辑个人资料</Button>
          </Link>
        </div>
        <Divider />
        <div className={styles.article}>
          {
            articles?.map((article: IArticle) => (
              <div key={article?.id}>
                <ListItem article={article} />
                <Divider />
              </div>
            ))
          }
        </div>
      </div>
      <div className={styles.right}>
        <div className={styles.achievement}>
          <div className={styles.header}>个人成就</div>
          <div className={styles.number}>
            <div className={styles.wrapper}>
              <FundViewOutlined />
              <span>共创作{articles.length}文章</span>
            </div>
            <div className={styles.wrapper}>
              <FundViewOutlined />
              <span>文章被阅读{viewsCount}次</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
};

export default observer(UserDetail);
