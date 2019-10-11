import auth0 from 'auth0-js';
import { AUTH_CONFIG } from './auth0-variables';

export default class Auth {
	auth0 = new auth0.WebAuth({
		domain: AUTH_CONFIG.domain,
		clientID: AUTH_CONFIG.clientId,
		redirectUri: AUTH_CONFIG.callbackUrl,
		responseType: 'token id_token',
		scope: 'openid email profile'
	});

	userProfile;

	constructor() {
		this.login = this.login.bind(this);
		this.logout = this.logout.bind(this);
		this.handleAuthentication = this.handleAuthentication.bind(this);
		this.isAuthenticated = this.isAuthenticated.bind(this);
		this.getAccessToken = this.getAccessToken.bind(this);
		this.getProfile = this.getProfile.bind(this);
	}

	login() {
		this.auth0.authorize();
	}

	handleAuthentication() {
		return new Promise((resolve, reject) => {
			this.auth0.parseHash((err, authResult) => {
				if (authResult && authResult.accessToken && authResult.idToken) {
					this.setSession(authResult);
					resolve(authResult);
				} else if (err) {
					reject(err);
				}
			});
		});
	}

	setSession(authResult) {
		// Set the time that the access token will expire at
		let expiresAt = JSON.stringify(( authResult.expiresIn * 1000 ) + new Date().getTime());
		localStorage.setItem('access_token', authResult.accessToken);
		localStorage.setItem('id_token', authResult.idToken);
		localStorage.setItem('expires_at', expiresAt);
	}

	getAccessToken() {
		const accessToken = localStorage.getItem('access_token');
		if (!accessToken) {
			throw new Error('No access token found');
		}
		return accessToken;
	}

	getProfile(cb) {
		let accessToken = this.getAccessToken();
		this.auth0.client.userInfo(accessToken, (err, profile) => {
			if (profile) {
				this.userProfile = profile;
			}
			cb(err, profile);
		});
	}

	logout() {
		// Clear access token and ID token from local storage
		localStorage.removeItem('access_token');
		localStorage.removeItem('id_token');
		localStorage.removeItem('expires_at');
	}

	isAuthenticated() {
		// Check whether the current time is past the
		// access token's expiry time
		let expiresAt = JSON.parse(localStorage.getItem('expires_at'));
		return new Date().getTime() < expiresAt;
	}
}