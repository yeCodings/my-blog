import { NextApiRequest,NextApiResponse} from 'next';
import { format } from "date-fns";
import md5 from 'md5';
import { encode } from "js-base64";
import {withIronSessionApiRoute} from 'iron-session/next';
import request from 'service/fetch';
import {ironOptions} from 'config/index';
import { ISession } from '..';


export default withIronSessionApiRoute(sendVerifyCode,ironOptions)

async function sendVerifyCode(req:NextApiRequest,res:NextApiResponse){
  const session:ISession = req.session;
  const {to='',templateId= '1' } = req.body;
  const appId = '2c94811c88bf35030188e37ced9e0b2c';
  const AccountId = '2c94811c88bf35030188e37cec510b25';
  const AuthToken = '65916bcc7fdf4cc881f2cd0d54205f77';
  const NowDate = format(new Date(),'yyyyMMddHHmmss');
  const Sigparameter = md5(`${AccountId}${AuthToken}${NowDate}`);
  const Authorization = encode(`${AccountId}:${NowDate}`);
  const url = `https://app.cloopen.com:8883/2013-12-26/Accounts/${AccountId}/SMS/TemplateSMS?sig=${Sigparameter}`;
  const verifyCode = Math.floor(Math.random()*(9999-1000))+1000;
  const expireMinute = '5';

  // 发起获取短信状态码请求
  const response = await request.post(url,{
    to,
    templateId,
    appId,
    datas: [verifyCode, expireMinute],
  },{
    headers:{
      Authorization
    }
  })

  const {statusCode,statusMsg,templateSMS} = response as any;
  if(statusCode === '000000'){
    // 状态码正常，cookie session 状态存储
    session.verifyCode = verifyCode;
    await session.save();

    res.status(200).json(
      {
        code: 0,
        msg: statusMsg,
        data: {
          templateSMS
        }
      }
    )
  }else{
    // 状态码异常，报出异常信息
    res.status(200).json(
      {
        code: statusCode,
        msg: statusMsg
      }
    )
  }
}