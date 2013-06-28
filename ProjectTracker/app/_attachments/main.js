/**
 * Deus Duke
 * ASDI 1306
 * Week 04
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

lihtml = "<li class='project_li' data-project-id='{0}'>{1}</li>";

// initialize home
$(document).on('pageinit', '#pgHome', function(){
    loadJSON();

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

        //resetProjectList();
        //$('form').submit();
        localStorage.clear();
        loadJSON();
        $.mobile.changePage('index.html');
    });

    if (currentProject != null) {
    	var p = currentProject;
    	
	    $('#name').val(p.name);
	    $('#start_date').val(p.start_date);
	    $('#end_date').val(p.due_date);
	    $('#priority').val(p.priority);
	    $('#description').val(p.description);
	
	    $('#btnSave').val('Save');
    }
});

$(document).on('pageinit', '#pgView', function() {
    updateView(currentProject);
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
function saveProject(project) {

    // make sure all data is valid, if not return
    if (!validateForm()) return;

    var p = project;
    
    if (p)
    	p._id = "project_" + p.id;
    else {
    	p = {};
    	p._id = "project_" + $.couch.newUUID();
    }

    // get vars
    p.name = $('#name').val();
    p.start_date = $('#start_date').val();
    p.due_date = $('#end_date').val();
    p.priority = $('#priority').val();
    p.description = $('#description').val();
    
    $.couch.db("project_tracker").saveDoc(p, {
        success: function(data) {
            console.log(data);
        },
        error: function(status) {
            console.log(status);
        }
    });
}

/**
 * View a project based off the id
 * @param  {string/int} projectid
 * @return {void}
 */
function viewProject(projectid) {
	$.couch.db('project_tracker').openDoc('project_' + projectid, {
		success: function(data) {
			var p = data;
			p.id = projectid;
			
			console.log(p);
			currentProject = p;
		},
		error: function(jqXHR, textStatus, errorThrown) {
			console.log(jqXHR);
	        console.log(textStatus);
	        console.log('could not load data');
		}
	});
			
    $.mobile.changePage("view.html");
}

function getItemFromLocalStorage(projectid) {
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
        var p = getItemFromLocalStorage(key);

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
function deleteCurrentProject() {
	$.couch.db("project_tracker").removeDoc(currentProject, {
		success: function() {
			loadJSON();
			$.mobile.changePage("index.html");
		}
	});
}

/**
 * Deletes the project from display and from localStorage
 * @return {void} 
 */
function deleteLinkClicked() {
    var li = $(this).parent();

    deleteProject(li.attr('data-project-id'));

    return false;
}

/**
 * Edit the project
 * @return {void} 
 */
function editLinkClicked() {
    var li = $(this).parent();

    $.mobile.changePage('create.html');

    return false;
}

/**
 * loads JSON data from remote server
 * @return {void} 
 */
function loadJSON() {
	$.couch.db('project_tracker').view("project_tracker/projects", {
		success: function(data) {
			console.log(data);
	        // clear local storage
	        localStorage.clear();
	        
	        // now load data back in
	        if (data && data.rows && data.rows.length > 0){
		        $.each(data.rows, function(index, item){
		        	var p = item.value;
		        	localStorage.setItem(p.id, JSON.stringify(p));
		        });
	        }
	        
	        resetProjectList();
		},
		error: function(jqXHR, textStatus, errorThrown) {
			console.log(jqXHR);
	        console.log(textStatus);
	        console.log('could not load data');
		}
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
        
        viewProject(li.attr('data-project-id'));

        return false;
    });
    
    ul.listview('refresh');
}

/**
 * Updates the view by retrieving the given project
 * @param  {object} The project object
 * @return {void}     
 */
function updateView(p) {
	$('#lb_project_name').text(p.name);
    $('#lb_project_description').text(p.description);
    $('#lb_project_start_date').text(p.start_date);
    $('#lb_project_due_date').text(p.end_date);
    $('#lb_project_priority').text(p.priority);

    // $('.delete_link').click(deleteLinkClicked);
    $('.edit_link').click(editLinkClicked);
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
