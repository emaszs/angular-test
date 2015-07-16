$(document).ready(function () {

	var searchPhrase = $("#task-search-form-input").val();

	/**
	 * Called on task info search form submission. It then fetches JSON data
	 * and inserts it into the task_info.html #task-info-table.
	 */
	 function displayTaskInfo() {
	 	var xmlhttp = new XMLHttpRequest();
	 	var url = "https://mmascher-mon.cern.ch/crabserver/dev/task?subresource=search&workflow=";

		// Response processing
		xmlhttp.onreadystatechange = function () {
			// Emptying table in case of previous request
			$("#task-info-table tbody").empty();

			if (xmlhttp.readyState == 4) {
				if (xmlhttp.status == 200) {
					console.log("OK");
					var data = JSON.parse(xmlhttp.response);

					// Creating table contents
					insertDataToView(data);

					$("#task-search-error-message").css("display", "none");
					// Show table now that info has been loaded and inserted
					$("#task-info-table").css("display", "inline");
				} else {
					// Displaying error message from response
					console.log("Error");
					$("#task-search-error-message").css("display", "inline")
					.text(xmlhttp.status + " " + xmlhttp.statusText);
				}
			}
		};

		// Helper function.
		// Inserts task info column names and values into #task-info-table.
		function insertDataToView(data) {
			for (i = 0; i < data.desc.columns.length; i++) {
				$("#task-info-table tbody")
				.append("<tr><td>" + data.desc.columns[i] + "</td><td>" + data.result[i] + "</td></tr>");
			}
		}

		// Sends get request for JSON data
		xmlhttp.open("GET", url + searchPhrase, true);
		xmlhttp.send();
	}

	function displayTaskWorkerLog() {
		var searchPhrase = $("#task-search-form-input").val();
	}

	/**
	* Task info search form listener
	*/
	$("#task-search-form").submit(function () {
		displayTaskInfo();
		// displayTaskWorkerLog();
		// displayGraphs();
		// displayConfigs();
		return false;
	});
})


function untarTest() {
	GZip.load("/crabserver/ui/static?test/sandbox.tar.gz",
		function (h) {
			var tar = new TarGZ;
			tar.parseTar(h.data.join(''));
			tar.files.forEach(console.log("success"));
		}, null, null);
}

$.ajax({  
   url: "https://mmascher-mon.cern.ch/crabcache/logfile?name=150714_090340:erupeika_crab_tutorial_May2015_MC_analysis_TaskWorker.log&username=erupeika",  
   dataType: "text",  
   success: function(data) { console.log(data); }  
});  