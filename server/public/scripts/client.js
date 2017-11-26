console.log('js');
var noAnimateOnLoad = true;

$(document).ready(function () {
    console.log('JQ');
    console.log("Moment is working, moment right now is " + moment());
    getTasks();
    $('#completedIn').val("N");
    $('#addButton').on('click', addNewTask);
    $('#viewTasks').on('click', '.deleteButton', removeTask);
    $('#viewTasks').on('click', '.completeButton', completeTask);
});

function addNewTask() {
    if (checkFields()) {
        taskDate = new Date($('#dateIn').val())
        todayDate = new Date();
        if (taskDate < todayDate) {
            if (!confirm("You entered a due date in the past. Do you wish to still proceed?")) {
                return false;
            }
        }
        console.log('in addButton on click');
        var objectToSend = {
            task: $('#taskIn').val(),
            due_date: $('#dateIn').val(),
            completed: $('#completedIn').val(),
        };
        saveTask(objectToSend);
        //global variable addedTaskId will be 0 going into the table update if a task is added
        addedTaskId = 0;
    };
}
function saveTask(newTask) {
    console.log('in saveTask', newTask);
    // ajax call to server to put in new task
    setTimeout(function () {
        $.ajax({
            method: 'POST',
            url: '/tasks',
            data: newTask,
            success: function (data) {
                console.log('saved a task: ', data);
                getTasks();
            } // end success
        }), //end ajax
            2000
    }); //end timeout
}

var highestId = 0; //global variable for looking up most recently added row

function getTasks() {
    console.log('in getTasks');
    $.ajax({
        url: '/tasks',
        type: 'GET',
        success: function (data) {
            console.log('got some tasks: ', data);
            $('#viewTasks').empty()
            $('#overdueBoxDiv').empty()
            var overdueItems = 0;
            for (i = 0; i < data.length; i++) {
                if (data[i].id > highestId) {
                    highestId = data[i].id;
                }
            }
            // now highestId variable is equal to the data.id of the most recently added row
            for (i = 0; i < data.length; i++) {
                var task = data[i];
                //downloaded moment.js as a script for date conversion on DOM
                cleanDate = moment(data[i].due_date).format("MMM Do YYYY")
                var $newTask = $("<tr class='complete'><td>" + data[i].task + "</td><td>" + cleanDate + "</td><td>" + data[i].completed + "</td></tr>")
                var $deleteTaskButton = $('<button class="deleteButton btn btn-danger">Delete</button>')
                $deleteTaskButton.data('id', task.id);
                $newTask.append("<td></td>");
                $newTask.find('td').last().append($deleteTaskButton);
                if (data[i].completed == "N") {
                    var $markCompletedButton = $('<button class="completeButton btn btn-success">Mark Completed?</button>')
                    $markCompletedButton.data('id', task.id);
                    $newTask.append("<td></td>");
                    $newTask.find('td').last().append($markCompletedButton);
                    $newTask.addClass('warning')
                }
                else {
                    $newTask.append("<td></td>");
                    $newTask.addClass('success');
                }
                //below conditional is to add the animation to the newest item added
                if (data[i].id == highestId) {
                    $newTask.addClass('rowJustAdded');
                    console.log("added rowJustAdded class to " + data[i].id)
                };
                //below code checks if task is overdue and incomplete
                taskDate = new Date(data[i].due_date);
                todayDate = new Date();
                if (taskDate < todayDate && data[i].completed == "N") {
                    $newTask.removeClass('warning');
                    $newTask.addClass('overdue text-uppercase danger');
                    overdueItems += 1;
                }
                //add task to table
                $('#viewTasks').append($newTask);
            }
            if (overdueItems > 0) {
                $('#overdueBoxDiv').append("<H2>You have " + overdueItems + " overdue tasks that require attention!</H2>")
            } else {
                $('#overdueBoxDiv').append("<H2>All caught up!</H2>")
            }
            // Conditional to make sure on first load or delete that the highestId animation doesn't run
            if (!noAnimateOnLoad) {
                $('.rowJustAdded').fadeOut(1000).fadeIn(1000)
                $("table").removeClass('rowJustAdded');
            }
            else {
                noAnimateOnLoad = false; //so that now the newest item will be animated on table refresh, UNLESS this
                //boolean switches back to true (as it does at the start of the remove task function)
            }
            $('#taskIn').val("");
            $('#dateIn').val("");
            $('#completedIn').val("N");

        } // end success
    }); //end ajax
}

function removeTask(e, complete) {
    if (confirm("Are you sure you want to delete this task?") == false) {
        return false
    } else {
        noAnimateOnLoad = true;
        var taskIdToRemove = $(this).data().id;
        // Adding temporary class to the row to be deleted for animation to come
        $(this).closest('tr').addClass('aboutToDelete');
        console.log('Remove task was clicked! The task id was', taskIdToRemove);
        // animation effect total time=1000ms
        $('.aboutToDelete').fadeOut(1000)
        setTimeout(function () {
            $.ajax({
                method: 'DELETE',
                url: '/tasks/' + taskIdToRemove,
                success: function (response) {
                    getTasks();
                }
            })
            //ajax function in setTimeout, on delay of 1000ms, equal to animation length
        }, 1000);
    }
}

function completeTask(e, complete) {
    var taskIdToComplete = $(this).data().id;
    // Adding temporary class to the row to be deleted for animation to come
    $(this).closest('tr').addClass('aboutToComplete');
    console.log('Complete task was clicked! The task id was', taskIdToComplete);
    // animation effect total time=1000ms
    $('.aboutToComplete').fadeOut(1000)
    setTimeout(function () {
        $.ajax({
            method: 'PUT',
            url: '/tasks/' + taskIdToComplete,
            success: function (response) {
                noAnimateOnLoad = true;
                getTasks();
            }
        })
    }, 1000);
}

function checkFields() {
    if (($('#taskIn').val() === "" || $('#dateIn').val() === "" || $('#completedIn').val() === "")) {
        alert("Please fill out all fields completely!")
        return false;
    } else {
        return true;
    }
}