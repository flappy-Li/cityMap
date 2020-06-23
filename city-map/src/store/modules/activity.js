const state = () => ({
	cityData:{}
})
const mutations = {
	CHANGE_CITYDATA(state, payload){
			state.cityData = payload;
	}
}
const actions = {
	//initCity({state, commit}, id){
			// const {data, ok} = await city.getCityData(id)
			// if(!ok) return
			// commit('CHANGE_CITYDATA', data.data)
	//}
}
export default {
	namespaced:true,
	state,
	mutations,
	actions
}