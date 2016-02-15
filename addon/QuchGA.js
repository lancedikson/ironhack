
// Copyright Quch.io 2013 -

var QuchGA = function (ua) {

	_this = this;
	this.ua = ua;
	this._lastEvents = {};

	this.event = function (category, action, label) {
		var gaq = window._gaq;
		gaq.push(['_trackEvent', String(category), String(action), String(label)]);
	};

	this.eventOnce = function (category, action, label, threshold) {
		// reports an event only once in a given period of time
		var k = "@" + category + "@@" + action + "@@" + label;

		if (_this._lastEvents[k] && (Date.now() - _this._lastEvents[k]) < threshold) {
			return false;
		}

		_this._lastEvents[k] = Date.now();
		_this.event(category, action, label);
		return true;
	};

	this.init = function () {

		var _gaq = (window._gaq = window._gaq || []);
		_gaq.push(['_setAccount', this.ua]);


		(function() {
			var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
			ga.src = 'https://ssl.google-analytics.com/ga.js';
			var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
		})();
	};

	this.pageview = function (page) {
		window._gaq.push(['_trackPageview', page]);
	};

	this.init();

};
