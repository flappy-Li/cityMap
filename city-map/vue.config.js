module.exports = {
    publicPath:'/',
    outputDir:'dist',
    pages:{
        entry:'src/index/main.js',
        template:'public/index.html'
    },
    lintOnSave:true,
    productionSourceMap:true,
    integrity:true,
    css: {
        requireModuleExtension:false
    },
    devServer:{
        
    }
}