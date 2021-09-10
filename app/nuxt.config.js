import colors from 'vuetify/es5/util/colors';

export default {
    // Global page headers: https://go.nuxtjs.dev/config-head
    head: {
	title: 'Hashgraph Chess',
	htmlAttrs: {
	    lang: 'en'
	},
	meta: [
	    { charset: 'utf-8' },
	    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
	    { hid: 'description', name: 'description', content: '' },
	    { name: 'format-detection', content: 'telephone=no' }
	],
	link: [
	    { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
	]
    },

    // Global CSS: https://go.nuxtjs.dev/config-css
    css: [
	'@/assets/styles.scss'
    ],

    // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
    plugins: [
    ],

    // Auto import components: https://go.nuxtjs.dev/config-components
    components: true,

    serverMiddleware: ["~/serverMiddleware/server.js"],

    // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
    buildModules: [
	// https://go.nuxtjs.dev/vuetify
	'@nuxtjs/vuetify',
    ],

    // Modules: https://go.nuxtjs.dev/config-modules
    modules: [
	'nuxt-socket-io',
	'nuxt-vuex-localstorage'
    ],

    io: {
	sockets: [{     
	    default: true,
	    name: 'main', 
	    url: 'http://localhost:3001',
	    actions: [{ processMessage: 'sessionStorage/PROCESS_MESSAGE' }]
	}],
    },

    // Vuetify module configuration: https://go.nuxtjs.dev/config-vuetify
    vuetify: {
	customVariables: ['~/assets/variables.scss'],
	theme: {
	    dark: true,
	    themes: {
		dark: {
		    primary: colors.blue.darken2,
		    accent: colors.grey.darken3,
		    secondary: colors.amber.darken3,
		    info: colors.teal.lighten1,
		    warning: colors.amber.base,
		    error: colors.deepOrange.accent4,
		    success: colors.green.accent3
		}
	    }
	}
    },

    // Build Configuration: https://go.nuxtjs.dev/config-build
    build: {
    }
};
