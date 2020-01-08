import routerConfig from './router.config';


export default {
	routes: routerConfig,
	plugins: [
		['umi-plugin-react', {
			antd: true,
			dva: true,
      dynamicImport: {
        webpackChunkName: true,
        level: 3
      }
		}]
	],
	proxy: {
		'/api/': {
			target: 'http://ymhx.f3322.net:8124/api/',
			changeOrigin: true,
			pathRewrite: {
				'^/api': ''
			}
		}
	},
	targets: {
		ie: 11
	},
	hash: true
};