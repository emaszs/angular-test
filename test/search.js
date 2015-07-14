function displayTaskInfo() {
	var searchPhrase = $("#task-search-form-input").val();
	var xmlhttp = new XMLHttpRequest();
	var url = "https://mmascher-mon.cern.ch/crabserver/dev/task?subresource=search&workflow=";

	xmlhttp.onreadystatechange = function () {
		if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
			var data = JSON.parse(xmlhttp.response);

			// Emptying table in case of previous request
			$("#task-info-table tbody").empty();
			// Creating table contents
			insertDataToView(data);

			// Show table now that info has been loaded and inserter
			$("#task-info-table").css("display", "inline");
		}
	}

	xmlhttp.open("GET", url + searchPhrase, true);
	xmlhttp.send();

	function insertDataToView(data) {
		for (i = 0; i < data.desc.columns.length; i++) {
			// Appending column names and data to task-info-table
			$("#task-info-table tbody")
				.append("<tr><td>" + data.desc.columns[i] + "</td><td>" + data.result[i] + "</td></tr>");
		}
	}
}

$("#task-search-form").submit(function () {
	displayTaskInfo();
	return false;
});