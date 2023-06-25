import React,{ReactElement, createContext, useContext} from 'react';
import {useLocalObservable,enableStaticRendering} from 'mobx-react-lite'
import createStore, { IStore } from './rootStore';

interface IProps{
  initialValue: Record<any,any>;
  children: ReactElement;
}

// ssr 配置为true；根据是否为浏览器环境 判断是否启用静态渲染模式，以避免服务端渲染时出现问题
// enableStaticRendering(!(typeof window === 'undefined'));
if (typeof window !== 'undefined') {
  // 在浏览器环境下进行操作
  enableStaticRendering(false);
} else {
  // 在其他环境下进行操作
  enableStaticRendering(true);
}

// 创建一个 StoreContext 上下文，并初始化为一个空对象。
const StoreContext = createContext({});

/**
 * 创建StoreProvider 组件，接收 initialValue 和 children 两个属性
 * 
 * 使用 useLocalObservable 和 createStore 函数创建一个 store 对象，将其存储在上下文中，并通过 Provider 将其传递给子组件。
 * @param 
 * @returns 
 */
export const StoreProvider = ({initialValue,children}:IProps) => {
  const store: IStore = useLocalObservable(createStore(initialValue));
  return (
    <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
  )
};

/**
 * 创建 useStore 自定义 Hook，在组件内部使用 useContext 获取上下文中存储的 store 对象，并返回它
 * @returns store
 */
export const useStore = () => {
  const store: IStore = useContext(StoreContext) as IStore;

  if(!store){
    throw new Error('数据不存在')
  }

  return store;
}