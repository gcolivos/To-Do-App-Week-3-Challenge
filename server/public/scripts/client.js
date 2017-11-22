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
        console.log('got some tasks: ', data);
        // getTasks();
      } // end success
    }); //end ajax
  }