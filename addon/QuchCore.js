
var QuchCore = function () {

	var _this = this;
	this.UA = 'UA-45715207-3'; // dev: UA-45715207-3 , stable: UA-45715207-4
	this.GA_ATTACH_THRESHOLD = 30 * 3600;   // delay between sending "attached" event for the same host
	this.CONFIG_UPDATE_INTERVAL = 10 * 60; // how often the addon should load the config
	this.CONFIG_UPDATE_URL = '/public/addon/config.json';

	this.stats = new QuchGA(this.UA);   // init stats engine
	this._updateTimer = null;

	this.run = function (page) {
		this.listen();              // listen for injections' messages
		this.stats.pageview(page);  // count the add-on launch
		this.updateConfig();

		this._updateTimer = window.setInterval(_this.updateConfig, (_this.CONFIG_UPDATE_INTERVAL + 10) * 1000);
	};

	this.listen = function () {
		chrome.runtime.onMessage.addListener(
			function(request, sender, sendResponse) {
				_this.dispatchMessage(request.msg, request.data);
			});
	};

	this.dispatchMessage = function (msg, data) {
//		console.log("dispatching", msg, data);

		switch (msg) {
			case QuchIronConstants.ATTACHED:
				_this.stats.eventOnce("Ironhack", "Attached", data.hostname, _this.GA_ATTACH_THRESHOLD);
				break;
		}

	};


	this.getApiHost = function (localSettings) {
		var apihost = localSettings.local ? "http://local-api.videoly.co" : "https://api.videoly.co";
		apihost = localSettings.testing ? "https://test-api.videoly.co" : apihost;
		return apihost;
	};

	this.updateConfig = function (force) {
		chrome.storage.local.get(null, function( localSettings ) {

			if (!force && localSettings.configUpdated && (Date.now() - localSettings.configUpdated)/1000 < _this.CONFIG_UPDATE_INTERVAL) {
				return;
			}

			_this.loadConfig(localSettings);
		});
	};

	this.loadConfig = function (localSettings) {
		var xhr = new XMLHttpRequest(),
			config = {};

		xhr.onload = function () {
			if (xhr.responseText) {
				try {
					config = JSON.parse(xhr.responseText);
				} catch (e) {
					console.log("Error in parsing loaded config", e);
					return;
				}

				localSettings.config = config;
				chrome.storage.local.set({ config: config, configUpdated: Date.now() }, function () {
					console.log('Config saved.');
				});
			}
		};

		xhr.open("GET", _this.getApiHost(localSettings) + _this.CONFIG_UPDATE_URL, true);
		xhr.send();
	};

	this.setLocal = function (local) {

		if (local == 'test') {
			chrome.storage.local.set({ testing: true }, function () {
				console.log('Testing: Yes');
				_this.updateConfig(true);
			});
		} else {
			chrome.storage.local.set({ local: local }, function () {
				console.log('Local: ', local);
				_this.updateConfig(true);
			});
			chrome.storage.local.set({ testing: false }, function () {
				console.log('Testing: No');
				_this.updateConfig(true);
			});
		}
	};
};
