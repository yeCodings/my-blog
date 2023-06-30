import 'reflect-metadata';
import { Connection, getConnection, createConnection } from 'typeorm';
import { User, UserAuth, Article, Comment } from './entity/index';

const host = process.env.DATABASE_HOST;
const port = Number(process.env.DATABASE_PORT);
const username = process.env.DATABASE_USERNAME;
const password = process.env.DATABASE_PASSWORD;
const database = process.env.DATABASE_NAME;

let connectReadyPromise: Promise<Connection> | null = null;

/**
 * 创建一个数据库连接实例函数
 * @returns  返回 Promise 对象，以便获取连接实例
 */
export const prepareConnection = () => {
  // 如果还没有创建过数据库连接，则新建一个 Promise 对象来连接数据库
  if (!connectReadyPromise) {
    connectReadyPromise = (async () => {
      try {
        // 先尝试获取已存在的连接实例，并关闭它
        const staleConnection = getConnection();
        await staleConnection.close();
      } catch (error) {
        console.log(error);
      }

      // 创建一个新的数据库连接实例
      const connection = await createConnection({
        type: 'mysql',
        host,
        port,
        username,
        password,
        database,
        entities: [User, UserAuth, Article,Comment], // 把这几张表注册进去
        synchronize: false,
        logging: true
      });

      // 返回连接实例
      return connection;
    })();
  }

  // 返回 Promise 对象，以便在其他地方通过 then() 或 async/await 来获取连接实例
  return connectReadyPromise;
};


