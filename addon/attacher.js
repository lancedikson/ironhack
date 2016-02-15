

var QuchIron = {

	ready: false,
	debug: true,

	remoteScript: "ironhack.js",

	init: function() {
		chrome.storage.local.get(null, function( localSettings ) {

			localSettings.config = {
				shops: {
					'www.k-rauta.fi': {
						shopId: 291
					},
					'www.k-rauta.se': {
						shopId: 291
					}
				}
			};

			var hostname_path = QuchIron.getHostname(),
				supportedHosts = (localSettings.config || {}).shops;

			if (QuchIron.ready || !supportedHosts || !supportedHosts[hostname_path]) return;
			var settings = supportedHosts[hostname_path];

			QuchIron.onReady( QuchIron.attach, settings, localSettings );
		});
	},

	onReady: function ( callback, settings, localSettings ) {

		if (["interactive", "complete"].indexOf(document.readyState) < 0) {
			var addListener = document.addEventListener || document.attachEvent,
				removeListener =  document.removeEventListener || document.detachEvent,
				eventName = document.addEventListener ? "DOMContentLoaded" : "onreadystatechange";

			addListener.call(document, eventName, function() {
				removeListener( eventName, arguments.callee, false );
				QuchIron.ready = true;
				callback(settings, localSettings);
			}, false )

		} else {
			QuchIron.ready = true;
			callback(settings, localSettings);
		}
	},

	getHostname: function () {
		return window.location.hostname;
	},

	getRemoteURL: function (settings, localSettings) {

		var url,
			shopId = settings.shopId || 0;

		var apihost = localSettings.local ? "//local-api.videoly.co" : "//api.videoly.co";
		apihost = localSettings.testing ? "//test-api.videoly.co" : apihost;

		if (shopId) {
			url = apihost + "/1/ironhack/0/" + shopId + "/widget1.js";
		} else {
			url = null;
		}

		return url;
	},

	attach: function ( settings, localSettings ) {
		var _this = QuchIron;
		var script = settings && settings.ignore ? "" : "window.IronboxSettings=JSON.parse('" + JSON.stringify(settings) + "');";

		// populate settings globally so Quchbox can read them
		try {
			var remoteURL = null,
				quchSettings = document.createElement('script');
			quchSettings.type = 'text/javascript';
			quchSettings.innerText = script;

			var quchbox = document.createElement('script');
			quchbox.type = 'text/javascript';
			quchbox.async = true;
			remoteURL = _this.getRemoteURL(settings, localSettings);
			if (remoteURL) {
				quchbox.src = remoteURL;
				var s = document.getElementsByTagName('script')[0];
				if (script) {
					s.parentNode.insertBefore(quchSettings, s);
				}

				s.parentNode.insertBefore(quchbox, s);

				_this.reportAttached(_this.getHostname());
			} else {
				console.warn("Ironhack-box remote url is empty");
			}

		} catch (e) {
			// silence, please
		}
	},

	reportAttached: function (hostname) {
		chrome.runtime.sendMessage({msg: QuchIronConstants.ATTACHED, data: {hostname: hostname}}, function(response) {});
	}
};

QuchIron.init();
