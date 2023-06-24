import userStore, {IUserStore} from "./userStore";

export interface IStore {
  user: IUserStore
}

/**
 * 创建一个全局的根 store
 * @export
 * @param {*} initialValue 默认参数
 * @return {*}  {()=>IStore}
 */
export default function createStore(initialValue: any): ()=>IStore{
  return ()=> {
    return {
      user: {...userStore(),...initialValue?.user},
    }
  }
}