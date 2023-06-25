import { ChangeEvent, useState } from 'react';
import styles from './index.module.scss';
import CountDown from 'components/CountDown';
import request from 'service/fetch';
import { message } from 'antd';
import { useStore } from 'store';
import { observer } from 'mobx-react-lite';

interface LoginProps {
	isShow: boolean;
	onClose: () => void;
}

const Login = (props: LoginProps) => {
	const store = useStore();
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
		if(!form?.phone){
			message.warning('请输入手机号');
			return;
		}
		request.post('/api/user/sendVerifyCode',{
			to: form?.phone,
			templateID: 1,
		})
		.then((res: any)=>{
			if(res?.code === 0){
				setIsShowVerifyCode(true)
			}else{
				message.error(res?.msg || '未知错误');
			}
		})
	};

	// 点击登录发起请求
	const handleLogin = () => {
		request.post('/api/user/login',{
			...form,
			identity_type: 'phone',
		}).then((res:any)=> {	
			if(res?.code === 0){
				// 登录成功
				store.user.setUserInfo(res.data);
				
				// 关闭弹窗
				onClose && onClose();
			}else{
				message.error(res?.msg || '未知错误');
			}
		});
	};

		// clientID 145758f3c3704f70bbe7
		// Client secrets  3bd6b2b53aee6eb175686673cdd9a10e83f66ee7

	const handleOAuthGithub = () => { 
		const githubClientid = '145758f3c3704f70bbe7';
		const redirectUrl = 'http://localhost:3000/api/oauth/redirect';
		
		window.open(`https://github.com/login/oauth/authorize?client_id=${githubClientid}&redirect_url=${redirectUrl}`);
	};

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
				<div className={styles.OtherLogin} onClick={handleOAuthGithub}>Github登录</div>
				<div className={styles.privacy} >
					注册登录即表示同意
					<a href='https://moco.imooc.com/privacy.html' target='_blank' rel='noreferrer'>隐私政策</a>
				</div>
			</div>
		</div> : null
};

export default observer(Login);
