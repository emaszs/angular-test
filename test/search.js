$(document).ready(function() {
    // Task name that was entered by the user, is set on form submission
    var inputTaskName = "";

    // Task info is stored upon displaying it. Required for the tm_user_webdir field, which is needed
    // for loading the config and pset files.
    var taskInfo = "";

    /**
     * Called on task info search form submission. It then fetches JSON data
     * and inserts it into the task_info.html #task-info-table.
     */
    function displayTaskInfo() {
        var xmlhttp = new XMLHttpRequest();
        var url = "https://mmascher-mon.cern.ch/crabserver/dev/task?subresource=search&workflow=";

        // Response processing
        xmlhttp.onreadystatechange = function() {
            // Emptying table in case of previous request
            $("#task-info-table tbody").empty();

            if (xmlhttp.readyState == 4) {
                if (xmlhttp.status == 200) {
                    console.log("OK");
                    var data = JSON.parse(xmlhttp.response);

                    // Storing the data for the use of other display functions
                    taskInfo = data;
                    
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

        // Synchronous request.
        // Sends get request for JSON data
        xmlhttp.open("GET", url + inputTaskName, false);
        xmlhttp.send();
    }

    /**
     * Fetches and displays TaskWorker log for given task
     */
    function displayTaskWorkerLog() {
        var xmlhttp = new XMLHttpRequest();

        // Match alphanumerics after a semicolon, until any non-alphanumeric character.
        var usernameRegExp = /.*:([a-zA-Z0-9]+)/;
        var username = usernameRegExp.exec(inputTaskName)[1];
        var url = "https://" + document.domain + "/crabcache/logfile?name=" +
            inputTaskName + "_TaskWorker.log&username=" + username;
        //console.log(url);

        var log = "";

        xmlhttp.onreadystatechange = function() {

            if (xmlhttp.readyState == 4) {
                if (xmlhttp.status == 200) {
                    // console.log(xmlhttp.response);
                    log = xmlhttp.response;
                     console.log(log);
                    $("#taskworker-log-paragraph").text(log);
                }
            }
        }

        // Synchronous request.

        xmlhttp.open("GET", url, false);
        xmlhttp.send();

        // $.ajax({
        // 	url: url,
        // 	dataType: "text",
        // 	success: function(data) {
        // 		console.log(data);
        // 	}
        // });
    }

    /**
    * Fetches and displays the config file for given task.
    */
    function displayConfigAndPset() {
    	var userWebDir = "";

    	// Searching for the user webdir field in stored TaskInfo data.
    	for (var i = 0; i < taskInfo.desc.columns.length; i++) {
    		if (taskInfo.desc.columns[i] == "tm_user_webdir") {
    			userWebDir = taskInfo.result[i];
    		}
    	}

    	console.log(userWebDir);

    	var urlEnd = "/sandbox.tar.gz";
    	var urlMiddle = userWebDir.split("mon")[1];
    	var urlStart = "https://mmascher-mon.cern.ch/scheddmon/5";

    	var url = urlStart + urlMiddle + urlEnd;

    	var tgz = TarGZ.stream(url, function(f, h) {
    		console.log(f.filename);
    		if (f.filename == "debug/crabConfig.py") {
    			$("#task-config-paragraph").text(f.data);
            	console.log(f.data);
            }

            if (f.filename == "debug/originalPSet.py") {
    			$("#task-pset-paragraph").text(f.data);
            	console.log(f.data);
            }
    	}, null, function(xhr, e){ console.log(e ? e : xhr.status); });

    	console.log(url);
    	console.log("eh");
    }


    /**
     * Task info search form listener
     */
    $("#task-search-form").submit(function(e) {
    	e.preventDefault();
        inputTaskName = $("#task-search-form-input").val();

        try {
        	displayTaskInfo();	
        }
        catch(err) {
        	console.log(err);
        }

        try {
        	displayConfigAndPset();	
        }
        catch(err) {
        	console.log(err);
        }

        try {
        	displayTaskWorkerLog();	
        }
        catch(err) {
        	console.log(err);
        } 
        
        // displayGraphs();
        
        // displayPset();
    });
})


function untarTest() {
    var tgz = TarGZ.stream("https://mmascher-mon.cern.ch/scheddmon/5/cms1425/150714_090340:erupeika_crab_tutorial_May2015_MC_analyss/sandbox.tar.gz",
        function(f, h) {
            //var tar = new TarGZ;
            // tar.parseTar(h.data.join(''));;
            if (f.filename == "debug/crabConfig.py") {
            	console.log(f.data);
            }
            // console.log(h);
            // tar.files.forEach(function(f) {
            // 	console.log(f.filename);
            }, null, function(xhr, e){ alert(e ? e : xhr.status); });
        
}

// $.ajax({
//     url: "https://mmascher-mon.cern.ch/crabcache/logfile?name=150714_090340:erupeika_crab_tutorial_May2015_MC_analysis_TaskWorker.log&username=erupeika",
//     dataType: "text",
//     success: function(data) {
//         console.log(data);
//     }
// });