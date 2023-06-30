import dynamic from "next/dynamic";
import { ChangeEvent, useState } from "react";
import { Input,Button, message } from "antd";
import {observer} from 'mobx-react-lite';
import { useRouter } from "next/router";

import request from 'service/fetch';
import "@uiw/react-markdown-preview/markdown.css";
import "@uiw/react-md-editor/markdown-editor.css";
import styles from './index.module.scss';
import { prepareConnection } from "db";
import { Article } from "db/entity";
import { IArticle } from "pages/api";


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

  return {
    props: {
      article: JSON.parse(JSON.stringify(article)),
    },
  };
}


const MDEditor = dynamic(
  () => import("@uiw/react-md-editor"),
  { ssr:false }
);

const ModifyEditor = ({article}:IProps)=> {
  // const store = useStore();
  // const {userId} = store.user.userInfo;
  const { push,query } = useRouter();
  const articleId = Number(query.id);
  const [title,setTitle] = useState(article?.title || '');
  const [content, setContent] = useState(article?.content || '');
  
  // 修改文章
  const handleUpdate = ()=> {
    if(!title) {
      message.warning('请输入文章');
      return;
    }

    request.post('/api/article/update',{
      id: article.id,
      title,
      content,
    }).then((res: any)=> {
      if(res?.code === 0){
        message.success('文章更新成功');

        // 发布成功后跳转主页 
        articleId ? push(`/user/${articleId}`) : push('/');
      }else{
        message.error(res?.msg || '文章更新失败')
      }
    });
  };

  const handleTitleChange = (event:ChangeEvent<HTMLInputElement>)=> {
    setTitle(event?.target?.value);
  };

  const handleContentChange = (content: any)=> { 
    setContent(content);
  };

  return (
    <div className={styles.container}>
      <div className={styles.operation}>
        <Input className={styles.title} placeholder='请输入文章标题' value={title} onChange={handleTitleChange} />
        <Button className={styles.button} type='primary' onClick={handleUpdate}>修改文章</Button>
      </div>
      <MDEditor value={content} height={700} onChange={handleContentChange} />
    </div>
  );
};

(ModifyEditor as any).layout = null;

export default observer(ModifyEditor);