import { useEffect, useState } from "react";
import styles from './index.module.scss';

interface CountDownProps {
  time: number;
  onEnd: () => void;
}

const CountDown = (props: CountDownProps) => {
  const {time,onEnd} = props;
  const [count,setCount] = useState(time || 60);

  useEffect(() => { 
    const timer = setInterval(()=> {

      setCount((count)=> {
        if(count === 0) {
          clearInterval(timer);
          onEnd && onEnd();
          return count;
        }

        return count -1;
      })
    },1000);

    return ()=> { clearInterval(timer)}
  },[time,onEnd])

  return (
    <div className={styles.countDown}>
      {count}
    </div>
  )
};

export default CountDown;
