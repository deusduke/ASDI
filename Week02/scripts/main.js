/**
 * Deus Duke
 * ASDI 1306
 * Week 02
 */

var jsonLoaded = false;
var yamlLoaded = false;
var createMode = false;

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

    // create / save project clicked
    $('#btnSave').click(function() {
        saveProject();

        $('form').submit();
        return false;
    });

});

/**
 * Validate the edit form, show / hide errors
 * and return if there true / false if there are
 * any problems
 * @return {boolean}
 */
function validateForm() {
    // TODO - Validate

    return true;
}

/**
 * Use this to save or update an existing project
 */
function saveProject(projectid) {

    // make sure all data is valid, if not return
    if (!validateForm()) return;

    var p = {};

    // create or store the id
    if (projectid)
        p.id = projectid;
    else
        p.id = Date.now().getTime();    // create id based off timestamp for guaranteed uniqueness

    if (!projectid) {
        // get vars
        p.name = $('#name').val();
        p.start_date = $('#start_date').val();
        p.end_date = $('#end_date').val();
        p.priority = $('#priority').val();
        p.description = $('#description').val();

        localStorage.setItem(p.id, JSON.stringify(p));
    }

    else {
        // TODO
    }
}

/**
 * Get a project baseed off the id
 * @param  {string/int} projectid
 * @return {void}
 */
function getProject(projectid) {
    return JSON.parse(localStorage.getItem(projectid));
}

/**
 * Retrieve all the project from local storage
 * @return {array} returns an array of project objects
 */
function getAllProjects() {
    var allProjects = [];

    // pull all the data from storage
    for (var key in localStorage){
        var p = getProject(key);

        allProjects.push(p);
    }

    return allProjects;
}

/**
 * Remove a project from local storage baseed off
 * id
 * @param  {int/string} projectid
 * @return {void}
 */
function deleteProject(projectid) {
    localStorage.removeItem(projectid);
}