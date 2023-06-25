export interface ICookieInfo{
  id: number;
  avatar: string;
  nickname: string;
}


/**
 * setCookie 函数
 * 
 * @param cookies
 * @param {userId,avatar,nickname}
 * @returns cookies.set(保存cookie数据)
 */
export const setCookie = (
  cookies: any,
  {id,avatar,nickname}: ICookieInfo
) =>{
  // 设置cookie过期时间
  const expires = new Date(Date.now()+ 24*60*60*1000);

  // 设置路径
  const path = '/';
  
  // 保存cookie数据
  cookies.set('userId',id,{
    path,
    expires,
  })

  cookies.set('avatar',avatar,{
    path,
    expires,
  });

  cookies.set('nickname',nickname,{
    path,
    expires,
  });

};