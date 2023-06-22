import { ChangeEvent, useState } from 'react';
import styles from './index.module.scss';
import CountDown from 'components/CountDown';

interface LoginProps {
	isShow: boolean;
	onClose: () => void;
}

const Login = (props: LoginProps) => {
	const { isShow = false, onClose } = props;
	const [isShowVerifyCode,setIsShowVerifyCode] = useState(false);

	const [form, setForm] = useState({
		phone: '',
		verify: '',
	});

	const handleClose = () => {
		onClose && onClose();
	};

	const handleGetVerifyCode = () => { 
		setIsShowVerifyCode(true)
	};
	const handleLogin = () => { };
	const handleOAuthLogin = () => { };
	const handleFormChange = (e:ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setForm({
			...form,
			[name]: value
		})
	};
	const handleCountDownEnd = ()=> {
		setIsShowVerifyCode(false)
	};

	return isShow ?
		<div className={styles.LoginArea}>
			<div className={styles.LoginBox}>
				<div className={styles.LoginTitle}>
					<div>手机号登录</div>
					<div className={styles.close} onClick={handleClose}>x</div>
				</div>
				<input
					name="phone"
					type="text"
					placeholder='请输入手机号'
					value={form.phone}
					onChange={handleFormChange}
				/>
				<div className={styles.VerifyArea}>
					<input
						name="verify"
						type="text"
						placeholder='请输入验证码'
						value={form.verify}
						onChange={handleFormChange}
					/>
					<span className={styles.VerifyCode} onClick={handleGetVerifyCode}>
						{isShowVerifyCode? <CountDown time={10} onEnd={handleCountDownEnd} /> : '获取验证码'}
					</span>
				</div>
				<div className={styles.LoginBtn} onClick={handleLogin}>登录</div>
				<div className={styles.OtherLogin} onClick={handleOAuthLogin}>Github登录</div>
				<div className={styles.privacy} >
					注册登录即表示同意
					<a href='https://moco.imooc.com/privacy.html' target='_blank' rel='noreferrer'>隐私政策</a>
				</div>
			</div>
		</div> : null
};

export default Login;
