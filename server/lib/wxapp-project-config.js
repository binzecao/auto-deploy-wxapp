var Schema = require('validate');

class WxAppProjectConfig {
	static createInstance() {
		return new WxAppProjectConfig();
	}

	constructor() {
		this.appId = true;
		this.projectName = true;
		this.urlCheck = true;
		this.libVersion = true;
	}

	setUrlCheck(urlCheck) {
		this.urlCheck = !!urlCheck;
		return this;
	}

	setAppId(appId) {
		this.appId = appId || '';
		return this;
	}

	setLibVersion(libVersion) {
		this.libVersion = libVersion || '';
		return this;
	}

	setProjectName(projectName) {
		this.projectName = projectName || '';
		return this;
	}

	checkOptions() {
		// 检查appid是否正确
		let checkAppId = val => /^wx[a-zA-Z0-9]{5,20}$/.test(val);
		// 检查小程序版本号格式
		let checkLibVersion = val => (!val && val !== 0) || /^\d+\.\d+\.\d+$/.test(val);

		let configValidationSchema = new Schema({
			appId: {
				type: 'string',
				required: true,
				length: { min: 10 },
				use: { checkAppId }
			},
			projectName: {
				type: 'string',
				required: true
			},
			libVersion: {
				type: 'string',
				required: false,
				use: { checkLibVersion }
			},
			urlCheck: {
				type: 'boolean',
				required: true
			}
		});

		configValidationSchema.message({
			checkAppId: (path, obj) => `appId is invalid, it must be more than 10 letters, and start with 'wx'.`,
			checkLibVersion: (path, obj) => `lib version must be in the format like 'x.x.x'`
		});

		let errors = configValidationSchema.validate(this);

		if (errors && errors.length > 0) {
			throw new Error(errors[0] + '');
		}
	}

	getConfig() {
		this.checkOptions();

		let config = {
			"description": "小程序项目配置文件",
			"setting": {
				"urlCheck": !!this.urlCheck,
				"es6": true,
				"postcss": true,
				"minified": true,
				"newFeature": true
			},
			"compileType": "miniprogram",
			"libVersion": (this.libVersion || ''),
			"appid": this.appId,
			"projectname": this.projectName
		}
		return config;
	}

	getConfigString() {
		return JSON.stringify(this.getConfig(), null, 2);
	}
}

module.exports = WxAppProjectConfig;