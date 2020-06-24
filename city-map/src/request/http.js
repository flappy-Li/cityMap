/**
 *  2020/6/23/ last 15:30 @李 axios封装
 */

import axios from 'axios';
import router from '../router';
import store from '../store/index';
// import QS from 'qs';

/**
 *  提示函数
 *  禁止点击蒙层，一秒之后消失
 */
const tip = msg => {
	Toast({
		message:msg,
		duration:1000,
		forbidClick:true
	})
}

/**
 *  跳转登录页面
 */

const toLogin = () => {
	router.replace({
		path: '/login',
		query:{
			redirect:router.currentRoute.fullPath
		}
	})
}

/**
 *  请求错误时统一处理
 */
const errorhandle = (status, other) => {
	switch(status) {
		//401 ： 未登录
		// 未登录则跳转到登录页面，并携带当前页面的路径
		// 登录成功之后跳转回当前页面，这一步需要在登录页面操作
		case 401:{
			toLogin()
			break;
		}
		//403：token过期
		//登录过期对用户提醒
		//清除本地token 和vuex当中的token
		//跳转登录页面
		case 403:{
			tip('登录过期，请重新登录');
			localStorage.removeItem('token');
			store.commit('loginSuccess',null);
			setTimeout(() => {
				toLogin();
			},1000)
			break;
		}
		case 404: {
			tip('请求不存在');
			break;
		}
		default:{
			console.log(other);   
		}
	}
}

//设置请求超时
var instance = axios.create( {timeout: 1000 * 12} );

//post 请求头设置
instance.defaults.herders.post['Content-Type'] = 'application/x-www-form-urlencoded';

/**
 *  请求拦截
 *  	每次发送请求之前判断vuex是否存在token
 * 		如果存在，则统一在http的header都加上token，后端根据token来进行判断登录转台
 * 		即使本地存在，也有可能过期，则需要在相应拦截器中对返回转台进行判断
 */
instance.interceptors.request.use(
	config => {
		const token = store.user.state.token
		token && (config.headers.Authorization = token)
		return config;
	},
	error =>  Promise.error(error)
)


//响应拦截
axios.interceptors.response.use(
	res => res.status === 200 ? Promise.resolve(res) : Promise.reject(res),
	error => {
		const { response } = error;
		if(response) {
			//请求已发出，但不是2开头的
			errorhandle(response.status, response.data.message);
			return Promise.reject(response)
		}else {
			//处理断网的情况
			//store.commit('changeNetwork', false);
		}
	}
)

/** 
 *  get请求
 *  @param url
 * 	@param params
 */

export function get(url, params = {}) {
	return new Promise( (resolve, reject) => {
		axios.get(url,{
			params:params
		})
		.then(res => {
			resolve(res.data);
		})
		.catch( err => {
			reject(err)
		})
	})
}

/**
 *  post请求
 *	@param url
 * 	@param data
 */
export function post(url, data = {}) {
	return new Promise( (resolve, reject) => {
		axios.post(url, data)
		.then(res => {
			resolve(res.data)
		},err => {
			reject(err.data)
		})
	})
}
