/**
 * Deus Duke
 * ASDI 1306
 * Week 03
 */

var currentProject = null;
var data = [];

// utility function to create formatted string similar to .Net
String.prototype.format = function() {
    str = this;
    var oldStr = "";

    for (var i in arguments) {
        // loop so that we can support multiple same numbers
        do{
            oldStr = str;
            str = str.replace('{' + i.toString() + '}', arguments[i]);

        } while (str != oldStr);
        ++i;
    }

    return str;
};

var jsonLoaded = false;
var yamlLoaded = false;
var createMode = false;

lihtml = "<li class='project_li' data-project-id='{0}'><p>{1}</p></li>";

// this is used to expand the list view on click
li_expanded = " \
<p>{0}</p> \
<p>{1}</p> \
<p>{2}</p> \
<p>{3}</p> \
<p>{4}</p> \
<a href='#' class='edit_link'>Edit</a> \
<a href='#' class='close_link'>Close</a> \
<a href='#' class='delete_link'>Delete</a> \
";

// initialize home
$(document).on('pageinit', '#pgHome', function(){
    resetProjectList();

    // handle the clicking of the edit a for
    // editing a project
    $('.edit_link').click(function() {
        return false;
    });
});

$(document).on('pageinit', '#pgCreate', function() {
    // create / save project clicked
    $('#btnSave').click(function() {
        saveProject(currentProject);

        resetProjectList();
        $('form').submit();
    });
});

// document ready shortcut
$(function() {
    // save project button clicked
    $("#btnGoCreate").click(function() {
        currentProject = null;
        $('btnSave').text('Create');

        clearForm();
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

    // get vars
    p.name = $('#name').val();
    p.start_date = $('#start_date').val();
    p.due_date = $('#end_date').val();
    p.priority = $('#priority').val();
    p.description = $('#description').val();

    localStorage.setItem(p.id, JSON.stringify(p));
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
 * Retrieve all the projects from local storage
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

function closeLinkClicked() {
    var li = $(this).parent();

    // make sure that we are expanded
    if (li.hasClass('expand')) {
        li.removeClass('expand');

        // get project and set li html back to text
        var p = getProject(li.attr('data-project-id'));
        li.html('<p>' + p.name + '</p>');
    }

    return false;
}

/**
 * Deletes the project from display and from localStorage
 * @return {void} 
 */
function deleteLinkClicked() {
    var li = $(this).parent();

    deleteProject(li.attr('data-project-id'));
    li.remove();

    $('#main_list').listview('refresh');

    return false;
}

/**
 * Edit the project
 * @return {void} 
 */
function editLinkClicked() {
    var li = $(this).parent();

    currentProject = li.attr('data-project-id');

    // set fields
    project = getProject(currentProject);

    $('#name').val(p.name);
    $('#start_date').val(p.start_date);
    $('#end_date').val(p.due_date);
    $('#priority').val(p.priority);
    $('#description').val(p.description);

    $('#btnSave').text('Save');
    $.mobile.changePage('#pgCreate');

    return false;
}

/**
 * loads JSON data from remote server
 * @return {void} 
 */
function loadJSON() {
    $.getJSON('/project_tracker/_design/project_tracker/_view/projects', function() {
    })
    .done(function(data){
        console.log(data);
        // clear local storage
        localStorage.clear();
        
        // now load data back in
        $.each(data.rows, function(index, item){
        	var p = item.value;
        	localStorage.setItem(p.id, JSON.stringify(p));
        });

        resetProjectList();
    })
    .fail(function(jqXHR, textStatus){
        console.log(jqXHR);
        console.log(textStatus);
        console.log('could not load data');
    });
}

/**
 * Resets the project list on page one and loads all projects
 * @return {void} 
 */
function resetProjectList() {
    var projects = getAllProjects();
    var ul = $('#main_list');
    ul.html('');

    // loop over projects and add elements
    for(var i in projects) {
        p = projects[i];

        ul.append(lihtml.format(p.id, p.name));
    }

    // expand list item on click
    $('.project_li').click(function(){
        var li = $(this);

        // make sure we are not expanded
        if (!li.hasClass('expand')) {
            li.addClass('expand');
            var p = getProject(li.attr('data-project-id'));
            var newdom = $(li_expanded.format(p.name, p.description, p.start_date, p.due_date, p.priority));
            li.html(newdom);

            $('.close_link').click(closeLinkClicked);
            $('.delete_link').click(deleteLinkClicked);
            $('.edit_link').click(editLinkClicked);
        }

        return false;
    });

    ul.listview('refresh');
}

/**
 * Clear all the form fields
 * @return {void} 
 */
function clearForm() {
    $('#name').val('');
    $('#start_date').val('');
    $('#end_date').val('');
    $('#priority').val('');
    $('#description').val('');

    $('#btnSave').text('Save');
}