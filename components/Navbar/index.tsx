import type { NextPage } from "next";
import Link from "next/link";
import { navs } from "./config";
import { useRouter } from "next/router";
import styles from './index.module.scss';

const Navbar: NextPage = ()=> {
    const {pathname} = useRouter();

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
    </div>
  )
}

export default Navbar;