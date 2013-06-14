/**
 * Deus Duke
 * ASDI 1306
 * Week 02
 */

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
";

// initialize home
$(document).on('pageinit', '#pgHome', function(){
    var projects = getAllProjects();
    var ul = $('#main_list');

    // loop over projects and add elements
    for(var i in projects) {
        p = projects[i];

        ul.append(lihtml.format(p.id, p.name));
    }

    ul.listview('refresh');

    // expand list item on click
    $('.project_li').click(function(){
        var li = $(this);

        // make sure we are not expanded
        if (!li.hasClass('expand')) {
            li.addClass('expand');
            var p = getProject(li.attr('data-project-id'));
            var newdom = $(li_expanded.format(p.name, p.description, p.start_date, p.end_date, p.priority));
            li.html(newdom);

            $('.close_link').click(closeLinkClicked);
        }

        return false;
    });

    // handle the clicking of the edit a for
    // editing a project
    $('.edit_link').click(function() {
        return false;
    });
});

// document ready shortcut
$(function() {

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