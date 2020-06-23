/**
 *  2020/6/23/ 11:23 @李 axios封装
 */

import axios from 'axios';
import QS from 'qs';
import store from '@store/index';
 
//环境的切换
if( process.env.NODE_ENV === 'development') {
	axios.defaults.baseURL = 'www.baidu.com';
}else if( process.env.NODE_ENV === 'debug' ) {
	axios.defaults.baseURL = 'www.cashi.com';
}else if ( process.env.NODE_ENV === 'production' ) {
	axios.defaults.baseURL = 'www.production.com' 
}

//设置请求超时
axios.defaults.timeout = 10000;

//post 请求头设置
axios.defaults.herders.post['Content-Type'] = 'application/x-www-from-urlencoded;charse=utf-8';

/**
 *  请求拦截
 *  	每次发送请求之前判断vuex是否存在token
 * 		如果存在，则统一在http的header都加上token，后端根据token来进行判断登录转台
 * 		即使本地存在，也有可能过期，则需要在相应拦截器中对返回转台进行判断
 */
axios.interceptors.request.use(
	config => {
		const token = store.user.state.token
		token && (config.headers.Authorization = token)
		return config;
	},
	error => {
		return Promise.error(error)
	}
)
//响应拦截
axios.interceptors.response.use(
	response => {
		if ( response.state == 200) {
			return Promise.resolve(response)
		}else {
			return Promise.reject(response)
		}
	},
	//服务器状态码不是2开头的情况
	// 状态吗则需要和后端商量
	//一般常见的 403 401 404
	error => {
		if( error.response.status ) {
			switch ( error.response.status ) {
				//401 ： 未登录
				// 未登录则跳转到登录页面，并携带当前页面的路径
				// 登录成功之后跳转回当前页面，这一步需要在登录页面操作
				case 401: {
					router.replace({
						path: '/login',
						query:{
							redirect:router.currentRoute.fullPath
						}
					}, 1000)
					break;
				}
				//403：token过期
				//登录过期对用户提醒
				//清除本地token 和vuex当中的token
				//跳转登录页面
				case 403:{
					Toast({
						message:'登录过期，请重新登录',
						duration:1000,
					}),
					localStorage.removeItem('token');
					store.commit('loginSuccess',null);
					router.replace({
						path:'/login',
						query:{
							redirect:router.currentRoute.fullPath
						}
					},1000)
					break;
				}
				// 404: 请求不存在
				case 404: {
					Toast({
						message:'请求不存在',
						duration:2500,
					})
					break;
				}
				default:{
					Toast({
						message: error.response.data.message,
						duration:2500
					})
				}
			}
		} 
		return Promise.reject(error.response)
	}
)
/** 
 *  get请求
 *  @param {String} url [请求时的url地址]
 * 	@param {Object} params [请求时的携带的参数]
 */

export function get(url, params) {
	return new Promise( (resolve, reject) => {
		axios.get(url,{
			params:params
		})
		.then(res => {
			resolve(res.data);
		})
		.catch( err => {
			reject(err.data)
		})
	})
}
/**
 *  post请求
 * @param {String} url [请求时的url地址]
 * @param {Object} params [请求时携带的参数]
 */
export function post(url, params) {
	return new Promise( (resolve, reject) => {
		axios.post(url, QS.stringify(params))
		.then(res => {
			resolve(res.data);
		})
		.catch( err => {
			reject(err.data)
		})
	})
}

