import 'styles/globals.css';
import Layout from 'components/layout';
import type { NextPage } from 'next';
import { StoreProvider } from 'store';
import { IUserInfo } from 'store/userStore';

interface IUser{
  userInfo: IUserInfo;
}

interface IProps{
  initialValue: {
    user: IUser;
  };
  Component: NextPage;
  pageProps: any;
}

// 入口
export default function App({initialValue, Component, pageProps }: IProps) {
  return (
  <StoreProvider initialValue={initialValue}>
    <Layout>
      <Component {...pageProps} />
    </Layout>
  </StoreProvider>
  )
}

App.getInitialProps = async({ctx}:{ctx:any}) => {
  const {userId,nickname,avatar} = ctx?.req.cookies || {};

  return {
    initialValue:{
      user: {
        userInfo: {
          userId,
          nickname,
          avatar
        }
      }
    }
  }
};