import React, { useEffect, useState } from 'react';
import { observer } from "mobx-react-lite";
import { Button, Tabs, message } from 'antd';
import * as AND_ICONS from '@ant-design/icons';

import { useStore } from "store";
import request from 'service/fetch';
import styles from './index.module.scss';

interface IUser {
  id: number;
  nickname: string;
  avatar: string;
}

interface ITag {
  id: number;
  title: string;
  icon: string;
  follow_count: number;
  article_count: number;
  users: IUser[];
}

const Tag = () => {
  const store = useStore();
  const [followTags, setFollowTags] = useState<ITag[]>();
  const [allTags, setAllTags] = useState<ITag[]>();
  const { userId } = store?.user?.userInfo || {};
  const [needRefresh,setNeedRefresh] = useState(false);

  useEffect(() => {
    request('/api/tag/get').then((res: any) => {
      if (res?.code === 0) {
        const { followTags = [], allTags = [] } = res?.data || {}; 
        setFollowTags(followTags);
        setAllTags(allTags);
      }
    })
  }, [needRefresh]);

  const onChange = (key: string) => {
    console.log(key);
  };

  // 取消关注
  const handleUnFollow = (tagId:number)=> {
    request.post('/api/tag/follow',{
      type: 'unfollow',
      tagId,
    }).then((res: any) => {
      if (res?.code === 0) {
        message.success('取关成功');
        setNeedRefresh(!needRefresh);
      }else {
        message.error(res.msg || '取关失败')
      }
    })
  };

  // 关注
  const handleFollow = (tagId:number)=> {
    request.post('/api/tag/follow',{
      type: 'follow',
      tagId,
    }).then((res: any) => {
      if (res?.code === 0) {
        message.success('关注成功');
        setNeedRefresh(!needRefresh);
      }else {
        message.error(res.msg || '关注失败')
      }
    })
  };

  return (
    <div className="content-layout">
      <Tabs defaultActiveKey="all" onChange={onChange}>
        <Tabs.TabPane tab="已关注标签" key="fellow" className={styles.tags}>
          {
            followTags?.map((tag) => (
              <div className={styles.tagWrapper} key={tag?.title}>
                <div>{(AND_ICONS as any)[tag?.icon]?.render()}</div>
                <div className={styles.title}>{tag?.title}</div>
                <div>{tag?.follow_count} 关注 {tag?.article_count} 文章</div>
                {
                  tag?.users?.find((user)=> Number(user?.id) === Number(userId)) ?(
                  <Button type='primary' onClick={()=>handleUnFollow(tag?.id)}>已关注</Button>) : 
                    (<Button onClick={()=>handleFollow(tag?.id)}>关注</Button>)
                }
              </div>)
            )
          }
        </Tabs.TabPane>
        <Tabs.TabPane tab="全部标签" key="all" className={styles.tags}>
        {
            allTags?.map((tag) => (
              <div className={styles.tagWrapper} key={tag?.title}>
                <div>{(AND_ICONS as any)[tag?.icon]?.render()}</div>
                <div className={styles.title}>{tag?.title}</div>
                <div>{tag?.follow_count} 关注 {tag?.article_count} 文章</div>
                {
                  tag?.users?.find((user)=> Number(user?.id) === Number(userId)) ?(
                  <Button type='primary' onClick={()=>handleUnFollow(tag?.id)}>已关注</Button>) : 
                    (<Button onClick={()=>handleFollow(tag?.id)}>关注</Button>)
                }
              </div>)
            )
          }
        </Tabs.TabPane>
      </Tabs>
    </div>
  )
}

export default observer(Tag);