console.log('js');

$(document).ready(function () {
    console.log('JQ');
    // getTasks();
    $('#addButton').on('click', addNewTask);
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
        // getTasks();
      } // end success
    }); //end ajax
  }

  function getKoalas() {
    console.log('in getKoalas');
    // ajax call to server to get koalas
    $.ajax({
      url: '/tasks',
      type: 'GET',
      success: function (data) {
        console.log('got some tasks: ', data);
        $('#viewTasks').empty()
        for (i = 0; i < data.length; i++) {
          var task = data[i];
          var $newTask = $("<tr><td>" + data[i].task + "</td><td>" + data[i].due_date + "</td><td>" + data[i].completed + "</td></tr>")
          var $deleteTaskButton = $('<button class="deleteButton">Delete</button>')
          $deleteTaskButton.data('id', task.id);
          $newTask.append($deleteTaskButton);
          if (data[i].completed=="N"){
            var $markCompletedButton = $('<button class="completeButton">Mark Completed?</button>')
            $markCompletedButton.data('id', task.id);
            $newTask.append($markCompletedButton);
          }
          $('#viewTasks').append($newTask);
        }
        $('#taskIn').val("");
        $('#dateIn').val("");
        $('#completedIn').val("");
  
      } // end success
    }); //end ajax