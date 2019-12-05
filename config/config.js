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
			target: 'http://192.168.10.11:8082',
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