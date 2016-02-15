
(function(){

	// add to quch.io pages hidden element to signal that user has the add-on

	var addon_installed_id = "quch-installed",
		elem = document.getElementById(addon_installed_id);
	if (!elem) {
		var body = document.getElementsByTagName("body");
		if (body && body[0]) {
			elem = document.createElement("div");
			elem.setAttribute("style", "display: none;");
			elem.setAttribute("id", addon_installed_id);
			body[0].appendChild(elem);
		}
	}

})();
