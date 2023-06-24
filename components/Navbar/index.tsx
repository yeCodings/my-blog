import type { NextPage } from "next";
import Link from "next/link";
import { navs } from "./config";
import { useRouter } from "next/router";
import styles from './index.module.scss';
import { Avatar, Button, Dropdown, Menu } from "antd";
import { useState } from "react";
import Login from "components/Login";
import { useStore } from "store";
import { HomeOutlined, LoginOutlined } from "@ant-design/icons";

const Navbar: NextPage = () => {
  const { pathname } = useRouter();
  const [isShowLogin, setIsShowLogin] = useState(false);
  
  const store = useStore();
  const {userId,avatar} = store.user.userInfo;

  const handleGotoEditorPage = () => {

  };

  const handleLogin = () => {
    setIsShowLogin(true);
  };

  const handleClose = () => {
    setIsShowLogin(false);
  };

  const renderDropDownMenu = () => {
    return (
      <Menu>
        <Menu.Item><HomeOutlined/>&nbsp; 个人主页</Menu.Item>
        <Menu.Item><LoginOutlined />&nbsp; 退出系统</Menu.Item>
      </Menu>
    )
  };

  return (
    <div className={styles.navbar}>
      <section className={styles.logoArea}>BLOG</section>
      <section className={styles.linkArea}>
        {
          navs?.map(nav => (
            <Link key={nav?.label} href={nav.value} legacyBehavior>
              <a className={pathname === nav?.value ? styles.active : ''}>
                {nav?.label}
              </a>
            </Link>
          ))
        }
      </section>
      <section className={styles.operationArea}>
        <Button onClick={handleGotoEditorPage}>写文章</Button>
        {
          userId 
          ? (
            <>
              <Dropdown overlay={renderDropDownMenu} placement="bottomLeft">
                <Avatar src={avatar} size={32} />
              </Dropdown>
            </>
          ) 
          : <Button type="primary" onClick={handleLogin}>登录</Button>
        }
       
      </section>
      <Login isShow={isShowLogin} onClose={handleClose} />
    </div>
  )
}

export default Navbar;