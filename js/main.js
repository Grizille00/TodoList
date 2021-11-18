(function() {
  // Bootstrapers
  var Timer, add, addBtn, addCurrent, curBtn, dirty_save, expBtn, get, getAll, gloak, input_btn, randomId, timerBtn;

  get = (e) => {
    return document.querySelector(e);
  };

  getAll = (e) => {
    return document.querySelectorAll(e);
  };

  add = (e) => {
    return document.createElement(e);
  };

  // Classes

  // Timer Class
  Timer = class Timer {
    constructor(setTime, hash_id) {
      this.load = this.load.bind(this);
      this.invalid = this.invalid.bind(this);
      this.show = this.show.bind(this);
      this.timeout = this.timeout.bind(this);
      this.update = this.update.bind(this);
      this.run = this.run.bind(this);
      this.setTime = setTime;
      this.hash_id = hash_id;
      this.load();
    }

    load() {
      var current_time;
      this.target_todo = get(this.hash_id);
      if (this.setTime) {
        this.set_time = new Date(this.setTime);
        current_time = new Date();
        return this.remaining_time = this.set_time - current_time;
      } else {
        return this.invalid();
      }
    }

    invalid() {
      var cur_list;
      cur_list = get(".current-todo-list");
      return cur_list.removeChild(this.target_todo.parentElement.parentElement);
    }

    show() {
      var days, hours, minutes, seconds;
      days = Math.floor(this.remaining_time / (1000 * 60 * 60 * 24));
      hours = Math.floor((this.remaining_time % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      minutes = Math.floor((this.remaining_time % (1000 * 60 * 60)) / (1000 * 60));
      seconds = Math.floor((this.remaining_time % (1000 * 60)) / 1000);
      return this.file = `${days}d:${hours}h:${minutes}m:${seconds}s`;
    }

    timeout() {
      var from_list, to_list;
      clearInterval(this.set);
      this.target_todo.textContent = "Expired!";
      this.target_todo.disabled = true;
      this.target_todo.parentElement.parentElement.classList.toggle("freeze");
      to_list = get(".expired-todo-list");
      from_list = get(".current-todo-list");
      from_list.removeChild(this.target_todo.parentElement.parentElement);
      return to_list.appendChild(this.target_todo.parentElement.parentElement);
    }

    update() {
      return this.target_todo.textContent = this.file;
    }

    run() {
      return this.set = setInterval(() => {
        this.remaining_time -= 1000;
        this.show();
        this.update();
        if (this.remaining_time < 0) {
          return this.timeout();
        }
      }, 1000);
    }

  };

  // Variables
  addBtn = get(".addTodo .add");

  addBtn.addEventListener('click', () => {
    var timer;
    // get time
    timer = get(".bliss");
    return timer.classList.toggle('ghost');
  });

  // Save
  dirty_save = () => {
    var inputField, text, timer, timerField, tmz;
    inputField = get(".addTodo input");
    text = inputField.value;
    timerField = get("input[name='lifetime']");
    timer = timerField.value;
    tmz = get(".bliss");
    tmz.classList.toggle('ghost');
    inputField.value = "";
    if (text) {
      return addCurrent(text, timer);
    }
  };

  gloak = (item) => {
    var val;
    val = get(`.${item}`);
    val.classList.toggle("gloak");
    return 1;
  };

  // Map

  // Current Field Control
  curBtn = get(".current .toggle");

  curBtn.addEventListener('click', () => {
    var curField;
    return curField = gloak('current');
  });

  // Completed Field Control
  curBtn = get(".completed .toggle");

  curBtn.addEventListener('click', () => {
    var curField;
    return curField = gloak('completed');
  });

  expBtn = get(".expired .toggle");

  expBtn.addEventListener('click', () => {
    var curField;
    return curField = gloak('expired');
  });

  timerBtn = get(".bliss .save");

  timerBtn.addEventListener('click', () => {
    return dirty_save();
  });

  randomId = () => {
    var i, nw, st, vals;
    vals = [...[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 'A', 'B', 'C', 'D', 'E', 'F'];
    st = [];
    for (nw = i = 0; i < 6; nw = ++i) {
      st = [...st, vals[Math.floor(Math.random() * vals.length)]];
    }
    return st.join("");
  };

  addCurrent = (text, timer) => {
    var app, field, i1, i2, li, myid, p, span01, span11, span2;
    console.log(timer);
    myid = randomId();
    li = add("li");
    li.setAttribute("todo_id", myid);
    p = add("p");
    span01 = add("span");
    span11 = add("span");
    span01.textContent = text;
    span2 = add("span");
    span2.setAttribute("class", "ctls");
    i1 = add("i");
    i1.setAttribute("class", "bi bi-check2-square");
    i1.setAttribute("todo_id", myid);
    i2 = add("i");
    i2.setAttribute("class", "bi bi-x-square close");
    i2.setAttribute("todo_id", myid);
    // completed action
    i1.addEventListener('click', () => {
      var cur_item, from_list, to_list;
      to_list = get(".completed-todo-list");
      from_list = get(".current-todo-list");
      cur_item = get(`.current-todo-list li[todo_id = '${i1.getAttribute('todo_id')}']`);
      from_list.removeChild(cur_item);
      return to_list.appendChild(cur_item);
    });
    
    // Cancel action
    i2.addEventListener('click', () => {
      var cur_item, from_list;
      from_list = get(".current-todo-list");
      cur_item = get(`.current-todo-list li[todo_id = '${i2.getAttribute('todo_id')}']`);
      return from_list.removeChild(cur_item);
    });
    span11.setAttribute('class', "life");
    span2.appendChild(i1);
    span2.appendChild(i2);
    p.appendChild(span01);
    p.appendChild(span11);
    li.appendChild(p);
    li.appendChild(span2);
    field = get(".current-todo-list");
    field.appendChild(li);
    app = new Timer(timer, `.current-todo-list li[todo_id = '${i2.getAttribute('todo_id')}'] .life`);
    if (app) {
      return app.run();
    }
  };

  input_btn = get(".addTodo input");

  input_btn.addEventListener('blur', () => {
    var el;
    el = get("i.add");
    return el.focus();
  });

}).call(this);


//# sourceMappingURL=main.js.map
//# sourceURL=coffeescript