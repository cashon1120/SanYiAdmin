const ymhxCookie = {
	setCookie: function (key, value) {
		key = window.location.port + '_' + key;
		var exp = new Date();
		exp.setTime(exp.getTime() + 60 * 24 * 60 * 60 * 1000);
		document.cookie = key + '=' + escape(value) + ';expires=' + exp.toGMTString() + ';path=/;';
	},
	getCookie: function (key) {
		key = window.location.port + '_' + key;
		let arr, reg = new RegExp('(^| )' + key + '=([^;]*)(;|$)');
		if (arr = document.cookie.match(reg))
			return unescape(arr[2]);
		else
			return null;
	},
	delCookie: function (key) {
		var exp = new Date();
		exp.setTime(exp.getTime() - 1);
		var cval = this.getCookie(key);
		if (cval != null) {
			key = window.location.port + '_' + key;
			document.cookie = key + '=' + cval + ';expires=' + exp.toGMTString() + ';path=/;';
		}
	}
}

export default ymhxCookie