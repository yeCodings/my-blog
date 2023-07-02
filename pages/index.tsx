import { prepareConnection } from 'db';
import { Divider } from 'antd';
import { Article } from 'db/entity';
import ListItem from 'components/ListItem';
import { IArticle } from 'pages/api';

interface IProps {
  articles: IArticle[];
}

/**
 *在 Next.js 中使用 getServerSideProps 函数获取服务器端渲染所需的数据
 *
 * @export getServerSideProps
 * @return {*} 返回一个含有 articles 的 props对象
 */
export async function getServerSideProps() {
  // 连接数据库
  const db = await prepareConnection();

  // 从数据库获取 articles数据
  const articles = await db.getRepository(Article).find({
    relations: ['user'],
  });

  return {
    props: {
      articles: JSON.parse(JSON.stringify(articles)),
    },
  };
}

const Home = (props: IProps) => {
  const { articles } = props;

  return (
    <div>
      <div className='content-layout'>
        {
          articles.map((article) => (
            <>
              <ListItem article={article} key={article.id} />
              <Divider />
            </>
          ))
        }
      </div>
    </div>
  )
};

export default Home;
