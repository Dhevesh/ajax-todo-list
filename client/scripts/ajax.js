// DISPLAY

$.ajax({
    url : 'http://localhost:3000/todos'
}).done(getTodos);

$('.btn-ico').on('click', ()=>{
    $('.new-item').toggle();
    $('#new-todo-item').focus();
    
});

function getTodos(todos){
    for (todo of todos){
        $("#todo-list").append(
            `
            <li class="list-group-item">
            <form id="editItem" class="editItem" action="/todos/${todo._id}" method="POST">
                <input id="${todo._id} type="text" value="${todo.text}" name="todo[text]" class="form-control mb-4" required>
            <button class="btn btn-sm btn-success">Update Item</button>
            </form>
            <span class="lead">
                ${todo.text}
            </span>
            <div class="d-inline float-right">
                <button class="btn btn-sm btn-warning edit-button">Edit</button>
                <form id="removeItem" class="form d-inline" method="POST" action="/todos/${todo._id}">
                    <button type="submit" class="btn btn-sm btn-danger delete-button">Delete</button>
                </form>
            </div>
            <div class="clearfix"></div>
            </li>
            `
        );
    }
}

// NEW ITEM
$('#newItem').submit(function(e){
    e.preventDefault();
    var todoItem = $(this).serialize();
    $.post("http://localhost:3000/todos", todoItem, function(newTodo){
        $("#todo-list").append(
            `
            <li class="list-group-item">
            <form id="editItem" class="editItem" action="/todos/${newTodo._id}" method="POST">
                <input id="${newTodo._id} type="text" value="${newTodo.text}" name="todo[text]" class="form-control mb-4" required>
            <button class="btn btn-sm btn-success">Update Item</button>
            </form>
            <span class="lead">
                ${newTodo.text}
            </span>
            <div class="d-inline float-right">
                <button class="btn btn-sm btn-warning edit-button">Edit</button>
                <form id="removeItem" class="form d-inline" method="POST" action="/todos/${newTodo._id}">
                    <button type="submit" class="btn btn-sm btn-danger delete-button">Delete</button>
                </form>
            </div>
            <div class="clearfix"></div>
            </li>
            `
        );
    });
    $(this).find(".form-control").val("");
    $(this).find('.form-control').focus();
});

// EDIT FUNCTIONALITY

$("#todo-list").on("click", ".edit-button", function(){
    $(this).parent().siblings("#editItem").toggle();
    $(this).parent().siblings("#editItem").trigger('reset');
    $(this).parent().siblings("form").children('input').focus();
    if ($(this).text() == 'Edit'){
        $(this).text('Cancel');
        $(this).removeClass('btn-warning');
        $(this).addClass('btn-secondary');
    } else {
        $(this).text('Edit');
        $(this).removeClass('btn-secondary');
        $(this).addClass('btn-warning');
    }
});

$('#todo-list').on("submit", ".editItem", function(e){
    e.preventDefault();
    var todoItem = $(this).serialize();
    var formAction = "http://localhost:3000" + $(this).attr('action');
    $originalItem = $(this).parent(".list-group-item");
    $.ajax({
        url:  formAction,
        data: todoItem,
        type: 'PUT',
        originalItem : $originalItem,
        success: function(todo){
            this.originalItem.html(
           `
           <form id="editItem" class="editItem" action="/todos/${todo._id}" method="POST">
                    <input id="${todo._id}" type="text" value="${todo.text}" name="todo[text]" class="form-control mb-4" required>
                <button class="btn btn-sm btn-success">Update Item</button>
                </form>
                <span class="lead">
                    ${todo.text}
                </span>
                <div class="d-inline float-right">
                    <button class="btn btn-sm btn-warning edit-button">Edit</button>
                    <form id="removeItem" class="form d-inline" method="POST" action="/todos/${todo._id}">
                        <button type="submit" class="btn btn-sm btn-danger delete-button">Delete</button>
                    </form>
                </div>
            <div class="clearfix"></div>
           `
            );
        }
    }
    );
});

// DELETE FUNCTIONALITY
$("#todo-list").on("submit", "#removeItem", function(e){
    e.preventDefault();
    var confirmResponse = confirm("Are you sure?");
    if (confirmResponse){
        var actionUrl = "http://localhost:3000" + $(this).attr('action');
        $itemToDelete = $(this).closest(".list-group-item");
        $.ajax({
            url: actionUrl,
            type: "DELETE",
            itemToDelete: $itemToDelete,
            success: function(data){
                this.itemToDelete.remove();
            }
        });
    }
});