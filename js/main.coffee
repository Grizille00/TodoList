
# Bootstrapers

get = (e)=> 
    document.querySelector e 


getAll = (e)=> 
    document.querySelectorAll e 


add  = (e)=>
    document.createElement e


# Classes

# Timer Class
class Timer
    constructor: (@setTime,@hash_id) ->
        @load()

    load: =>
        @target_todo = get(@hash_id)
        if @setTime 
            @set_time = new Date(@setTime)
            current_time = new Date()
            @remaining_time = @set_time - current_time
        else
            @invalid()

    invalid: =>
        cur_list = get ".current-todo-list"
        cur_list.removeChild @target_todo.parentElement.parentElement
    
    show: =>
        days = Math.floor(@remaining_time / (1000 * 60 * 60 * 24));
        hours = Math.floor((@remaining_time % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        minutes = Math.floor((@remaining_time % (1000 * 60 * 60)) / (1000 * 60));
        seconds = Math.floor((@remaining_time % (1000 * 60)) / 1000);
        @file = "#{days}d:#{hours}h:#{minutes}m:#{seconds}s"

    timeout: =>
        clearInterval @set 
        @target_todo.textContent = "Expired!"
        @target_todo.disabled = true
        @target_todo.parentElement.parentElement.classList.toggle "freeze"
        to_list = get ".expired-todo-list"
        from_list = get ".current-todo-list"
        from_list.removeChild @target_todo.parentElement.parentElement
        to_list.appendChild @target_todo.parentElement.parentElement
    update: =>
        @target_todo.textContent = @file
        




    run: =>
        @set = setInterval =>
            @remaining_time -= 1000
            @show()
            @update()
            @timeout() if @remaining_time < 0
        ,1000


# Variables

addBtn = get ".addTodo .add"

addBtn.addEventListener 'click',()=>
    # get time
    timer = get ".bliss"
    timer.classList.toggle 'ghost'

# Save

dirty_save = ()=>
    inputField = get ".addTodo input"
    text = inputField.value
    timerField = get "input[name='lifetime']"
    timer = timerField.value
    tmz = get ".bliss"
    tmz.classList.toggle 'ghost'
    inputField.value = ""
    addCurrent text,timer if text




gloak = (item)=>
    val = get ".#{item}"
    val.classList.toggle "gloak"
    1

# Map


# Current Field Control

curBtn = get ".current .toggle"

curBtn.addEventListener 'click',()=>
    curField = gloak 'current'


# Completed Field Control

curBtn = get ".completed .toggle"

curBtn.addEventListener 'click',()=>
    curField = gloak 'completed'



expBtn = get ".expired .toggle"

expBtn.addEventListener 'click',()=>
    curField = gloak 'expired'

timerBtn = get ".bliss .save"
timerBtn.addEventListener 'click',()=>
    dirty_save()


randomId = ()=>
    vals =  [[0..10]...,'A','B','C','D','E','F']
    st = []
    st = [...st,vals[Math.floor(Math.random() * vals.length)]] for nw in [0...6]
    return st.join ""

addCurrent = (text,timer)=>
    console.log timer
    myid = randomId() 
    li = add "li"
    li.setAttribute "todo_id",myid 
    p = add "p"
    span01 = add "span"
    span11 = add "span"
    span01.textContent = text
    span2 = add "span"
    span2.setAttribute "class","ctls" 
    i1 = add "i"
    i1.setAttribute "class","bi bi-check2-square" 
    i1.setAttribute "todo_id", myid
    i2 = add "i"
    i2.setAttribute "class","bi bi-x-square close"
    i2.setAttribute "todo_id", myid
    # completed action
    i1.addEventListener 'click',()=>
        to_list = get ".completed-todo-list"
        from_list = get ".current-todo-list"
        cur_item = get ".current-todo-list li[todo_id = '#{i1.getAttribute 'todo_id'}']"
        from_list.removeChild cur_item
        to_list.appendChild cur_item
    
    # Cancel action
    i2.addEventListener 'click',()=>
        from_list = get ".current-todo-list"
        cur_item = get ".current-todo-list li[todo_id = '#{i2.getAttribute 'todo_id'}']"
        from_list.removeChild cur_item
    span11.setAttribute 'class',"life"
    span2.appendChild i1
    span2.appendChild i2
    p.appendChild span01
    p.appendChild span11
    li.appendChild p
    li.appendChild span2
    field = get ".current-todo-list"
    field.appendChild li
    app = new Timer(timer,".current-todo-list li[todo_id = '#{i2.getAttribute 'todo_id'}'] .life")
    app.run() if app
    
input_btn = get ".addTodo input"
input_btn.addEventListener 'blur',()=>
    el = get "i.add"
    el.focus()


$ window
.on "load", ->
    $ '#preloader' 
        .fadeOut 500
    1
