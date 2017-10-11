new function() {
	var _self = this;
	_self.width = 640;// 设置默认最大宽度
	_self.fontSize = 100;// 默认字体大小
	_self.widthProportion = function() {
		var p = (document.body && document.body.clientWidth || document.getElementsByTagName("html")[0].offsetWidth)/_self.width;
		return p < 0.5 ? 0.5 : (p > 0.75 ? 0.75 : p);
	};

	_self.changePage = function() {
		document.getElementsByTagName("html")[0].setAttribute("style","font-size:" + _self.widthProportion() * _self.fontSize + "px !important");
	}

	_self.changePage();
	window.addEventListener("resize", function() {
		_self.changePage();
	}, false);
};

/* 提示，弹窗 */
// tips('数据错误','tips_center',1500);
// tips('数据错误','tips_left',1500);
function tips(msg, className, time) {
	var tipsDiv = $('<div class="tips ' + className + '"></div>');
	$('body').append(tipsDiv);
	tipsDiv.html(msg).addClass('tips_show');
	setTimeout(function() {
		tipsDiv.removeClass('tips_show').remove();
	}, time);
}

/* 获取验证码 */
function getCodefun(obj, time, sendCodeFun) {
	var me = {};
	me.obj = obj;
	me.wait = time;
	me.time = function(obj) {
		addClass(obj, 'disable');
		if (me.wait == 0) {
			obj.innerHTML = "获取";
			me.wait = time;
			removeClass(obj, 'disable');
		} else {
			obj.innerHTML = me.wait + "s";
			me.wait--;
			setTimeout(function() {
				me.time(obj);
			}, 1000);
		}
	}
	if (!hasClass(me.obj, 'disable')) {
		me.time(me.obj);
		sendCodeFun();
	}
	return me;
}
/* 操作Class */
function hasClass(obj, cls) {
	return obj.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));
}
function addClass(obj, cls) {
	if (!this.hasClass(obj, cls))
		obj.className += " " + cls;
}
function removeClass(obj, cls) {
	if (hasClass(obj, cls)) {
		var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
		obj.className = obj.className.replace(reg, ' ');
	}
}
function toggleClass(obj, cls) {
	if (hasClass(obj, cls)) {
		removeClass(obj, cls);
	} else {
		addClass(obj, cls);
	}
}

// register user info.
function register(phone, identify) {
	$.ajax({
		type : "post",
		url : Config.url + "/register",
		data : {
			openid : JSON.parse(xiaoyuerUserMes).openid,
			mobilephone : phone,
			identifyCode : identify,
			subscribe : JSON.parse(xiaoyuerUserMes).subscribe,
			nickname : JSON.parse(xiaoyuerUserMes).nickname,
			sex : JSON.parse(xiaoyuerUserMes).sex,
			country : JSON.parse(xiaoyuerUserMes).country,
			province : JSON.parse(xiaoyuerUserMes).province,
			language : JSON.parse(xiaoyuerUserMes).language,
			headimgurl : JSON.parse(xiaoyuerUserMes).headimgurl,
			subscribe_time : JSON.parse(xiaoyuerUserMes).subscribe_time,
			unionid : JSON.parse(xiaoyuerUserMes).unionid,
			remark : JSON.parse(xiaoyuerUserMes).remark,
			groupid : JSON.parse(xiaoyuerUserMes).groupid,
			city : JSON.parse(xiaoyuerUserMes).city,
		},
		success : function(data, status, xhr) {
			if (data.resultCode == "1111") {
				layer.open({
					content : '注册失败',
					btn : "确定"
				});
			} else {
				layer.open({
					content : '注册成功',
					btn : "确定",
					end : function() {
						var ref = '';
						if (document.referrer.length > 0) {
							ref = document.referrer;
						}
						try {
							if (ref.length == 0
									&& opener.location.href.length > 0) {
								ref = opener.location.href;
							}
						} catch (e) {
						}
						location.href = ref;
					}
				});

			}
		},
		error : function(xhr, errorType, error) {
		},
	})
}

// 检查是否注册用户 如果未注册调转至注册页面 如果已注册跳转对应页面
function checkRegisterUser(url) {
	if (Cookie.get("xiaoyuerUserMes")) {
		var xiaoyuerUserMes = Cookie.get("xiaoyuerUserMes");
		var openid = JSON.parse(Cookie.get("xiaoyuerUserMes")).openid;
		if (openid) {
			$.ajax({
				type : "post",
				url : Config.url + "/checkRegisterUser",
				async : false,
				data : {
					openId : openid,
				},
				success : function(data, status, xhr) {
					if (data) {
						//console.log(data.object.userid)
						console.log(data)
						if (data.resultCode == '0000') {
							Cookie.set('usermobilephone', data.object.mobilephone);
							Cookie.set('usersex', data.object.sex);
							
							Cookie.set('userId', data.object.userid);
							if (url != null && url != undefined) {
								location.href = url;
							}
						} else if (data.resultCode == '9999') {
							// throws exception.
						} else if (data.resultCode == '1111') {
							location.href = "./register.html";
						}
					}
				},
				error : function(xhr, errorType, error) {
				}
			})
		}
	}
}

function getUser(user) {
	$.ajax({
		type : "post",
		url : Config.url + "/getUser",
		async : false,
		data : {
			userId : user,
		},
		success : function(data, status, xhr) {
			if (data) {
				Cookie.set('xiaoyuerUserMes', JSON.stringify(data));
			}
		},
		error : function(xhr, errorType, error) {
			console.log(000)
		}
	})
}

// Cookie 操作
var Cookie = {
	getExpiresDate : function(days, hours, minutes) {
		var ExpiresDate = new Date();
		if (typeof days == "number" && typeof hours == "number"
				&& typeof hours == "number") {
			ExpiresDate.setDate(ExpiresDate.getDate() + parseInt(days));
			ExpiresDate.setHours(ExpiresDate.getHours() + parseInt(hours));
			ExpiresDate
					.setMinutes(ExpiresDate.getMinutes() + parseInt(minutes));
			return ExpiresDate.toGMTString();
		}
	},
	_getValue : function(offset) {
		var endstr = document.cookie.indexOf(";", offset);
		if (endstr == -1) {
			endstr = document.cookie.length;
		}
		return unescape(document.cookie.substring(offset, endstr));
	},
	get : function(name) {
		var arg = name + "=";
		var alen = arg.length;
		var clen = document.cookie.length;
		var i = 0;
		while (i < clen) {
			var j = i + alen;
			if (document.cookie.substring(i, j) == arg) {
				return this._getValue(j);
			}
			i = document.cookie.indexOf(" ", i) + 1;
			if (i == 0)
				break;
		}
		return "";
	},
	set : function(name, value, expires, path, domain, secure) {
		document.cookie = name + "=" + escape(value)
				+ ((expires) ? ";expires=" + expires : "")
				+ ((path) ? ";path=" + path : "")
				+ ((domain) ? ";domain=" + domain : "")
				+ ((secure) ? ";secure" : "");
	},
	remove : function(name, path, domain) {
		if (this.get(name)) {
			document.cookie = name + "=" + ((path) ? ";path=" + path : "")
					+ ((domain) ? ";domain=" + domain : "")
					+ ";expires=Thu, 01-Jan-70 00:00:01 GMT";
		}
	},
	clear : function() {
		var cookies = document.cookie.split(';');
		for (var i = 0; i < cookies.length; i++) {
			var cookieName = cookies[i].split('=')[0];
			if (cookieName.trim()) {
				this.remove(cookieName.trim());
			}
		}
	}
}
// Cookie.set('kk','45');
// console.log(Cookie.get());