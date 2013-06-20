function(doc) {
	if (doc._id.substr(0, 8) == "project_") {
		emit(doc._id, {
				"id": doc._id.substr(8),
				"name": doc.name,
				"start_date": doc.start_date,
				"due_date": doc.due_date,
				"priority": doc.priority,
				"description": doc.description,
				"complete": doc.complete
		});
	}
}