export type IUserInfo = {
  userId?: number | null;
  nickname?: string;
  avatar?: string;
}

export interface IUserStore{
  userInfo: IUserInfo;
  // eslint-disable-next-line no-unused-vars
  setUserInfo: (value: IUserInfo) => void;
}

/**
 *  定义一个userStore 函数
 *  返回 userInfo 对象 和 setUserInfo 函数
 * @return {*}  {IUserStore}
 */
const userStore = (): IUserStore => {
  return {
    userInfo: {},
    setUserInfo: function (value: IUserInfo){
      this.userInfo = value;
    }
  }
};

export default userStore;