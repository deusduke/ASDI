/**
 * Deus Duke
 * ASDI 1306
 * Week 02
 */

var jsonLoaded = false;
var yamlLoaded = false;

lihtml = "<li class='' data-project-id='{0}'>{1}</li>";

// document ready shortcut
$(function() {

	// initialize home
    $('#pgHome').on('pageinit', function(){
        
    });

    // initialze create
    $('#pgCreate').on('pageinit', function(){
    	
    });

    // save project button clicked
    $("#btnGoCreate").click(function() {
        $('btnSave').text('Create');
    });

});

function storeProject() {

}

/**
 * Use this to save an existing project
 */
function saveProject() {

}

/**
 * Retrieve all the project from local storage
 * @return {array} returns an array of project objects
 */
function getAllProjects() {
    var allProjects = [];
    
    // pull all the data from storage
    for (var key in localStorage){
        var p = localStorage.getItem(key);
        
        allProjects.push(p);
    }
}