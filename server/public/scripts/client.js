console.log('js');

$(document).ready(function () {
    console.log('JQ');
    getTasks();
    $('#addButton').on('click', addNewTask);
    $('#viewTasks').on('click', '.deleteButton', removeTask);
    $('#viewTasks').on('click', '.completeButton', completeTask);
});

function addNewTask() {
    console.log('in addButton on click');
    var objectToSend = {
        task: $('#taskIn').val(),
        due_date: $('#dateIn').val(),
        completed: $('#completedIn').val(),
    };
    saveTask(objectToSend);
};

function saveTask(newTask) {
    console.log('in saveTask', newTask);
    // ajax call to server to put in new task
    $.ajax({
        method: 'POST',
        url: '/tasks',
        data: newTask,
        success: function (data) {
            console.log('saved a task: ', data);
            getTasks();
            // getTasks();
        } // end success
    }); //end ajax
}

function getTasks() {
    console.log('in getTasks');
    // ajax call to server to get koalas
    $.ajax({
        url: '/tasks',
        type: 'GET',
        success: function (data) {
            console.log('got some tasks: ', data);
            $('#viewTasks').empty()
            for (i = 0; i < data.length; i++) {
                var task = data[i];
                //downloaded moment.js as a script for date conversion on DOM
                cleanDate = moment(data[i].due_date).format("MMM Do YYYY")
                var $newTask = $("<tr class='complete'><td>" + data[i].task + "</td><td>" + cleanDate + "</td><td>" + data[i].completed + "</td></tr>")
                var $deleteTaskButton = $('<button class="deleteButton">Delete</button>')
                $deleteTaskButton.data('id', task.id);
                $newTask.append($deleteTaskButton);
                if (data[i].completed == "N") {
                    var $markCompletedButton = $('<button class="completeButton">Mark Completed?</button>')
                    $markCompletedButton.data('id', task.id);
                    $newTask.append($markCompletedButton);
                    $newTask.addClass('incomplete')
                }
                else{
                    $newTask.addClass('complete')
                }
                $('#viewTasks').append($newTask);
            }
            $('#taskIn').val("");
            $('#dateIn').val("");
            $('#completedIn').val("");
        } // end success
    }); //end ajax
}

function removeTask(e, complete) {
    var taskIdToRemove = $(this).data().id;
    console.log('Remove task was clicked! The task id was', taskIdToRemove);
    $.ajax({
        method: 'DELETE',
        url: '/tasks/' + taskIdToRemove,
        success: function (response) {
            getTasks();
        }
    })
}

function completeTask(e, complete) {
    var taskIdToComplete = $(this).data().id;
    console.log('Complete task was clicked! The task id was', taskIdToComplete);
    $.ajax({
        method: 'PUT',
        url: '/tasks/' + taskIdToComplete,
        success: function (response) {
            getTasks();
        }
    })
}