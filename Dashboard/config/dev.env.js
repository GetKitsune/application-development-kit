var merge = require('webpack-merge')
var prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
	KITSUNE_API_BASE_URL:'http://api2.kitsunedev.com'
})
