/**
 * Deus Duke
 * ASDI 1306
 * Assignment Details
 */

lihtml = "<li class='' data-project-id='{0}'>{1}</li>"

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

}