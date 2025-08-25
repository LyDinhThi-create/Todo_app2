import { useState, useEffect } from "react";
import { Button, Modal, Select, Space, DatePicker } from "antd";
import { Tag } from "antd";
import dayjs from "dayjs";
import "./style.css";
const { RangePicker } = DatePicker;

function ListTodo() {
  let todos = [
    {
      id: 1,
      title: "Learn React",
      completed: false,
      tags: ["hoc_tap"],
      deadline: ["01/01/2022", "01/02/2022"],
    },
    {
      id: 2,
      title: "Work project",
      completed: false,
      tags: ["cong_viec"],
      deadline: ["01/01/2023", "01/02/2023"],
    },
    {
      id: 3,
      title: "Play football",
      completed: false,
      tags: ["ca_nhan"],
      deadline: ["01/01/2024", "01/02/2024"],
    },
  ];
  const options = [
    { value: "hoc_tap", label: "Học tập" },
    { value: "cong_viec", label: "Công việc" },
    { value: "ca_nhan", label: "Cá nhân" },
  ];
  const [todoList, setTodoList] = useState(() => {
    const saved = localStorage.getItem("todos");
    return saved ? JSON.parse(saved) : todos;
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState(null);
  const [selectedTags, setSelectedTags] = useState(["hoc_tap"]);
  const [search, setSearch] = useState(todoList);
  const [deadline, setDeadline] = useState(null);
  const [sortType, setSortType] = useState("mac_dinh");
  // ✅ Mỗi lần todoList thay đổi → lưu vào localStorage
  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todoList));
  }, [todoList]);

  const handleAdd = (values) => {
    setSelectedTags(values);
  };
  const showModal = (todo) => {
    setEditingTodo(todo);
    setSelectedTags(todo.tags);
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setTodoList(
      todoList.map((item) => (item.id === editingTodo.id ? editingTodo : item))
    );
    setSearch(
      todoList.map((item) => (item.id === editingTodo.id ? editingTodo : item))
    );
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const handleChange = (e) => {
    const { id, value } = e.target;
    if (id === "status") {
      setEditingTodo({
        ...editingTodo,
        completed: value === "completed" ? true : false,
        tags: selectedTags,
      });
    } else {
      setEditingTodo({
        ...editingTodo,
        [id]: value,
        tags: selectedTags,
      });
    }
  };
  const handleSort = (e) => {
    if (e === "All") {
      setSearch(todoList);
    } else {
      setSearch(todoList.filter((todo) => todo.tags.includes(e)));
    }
  };
  const handleSortDay = (value) => {
    setSortType(value);
  };
  const handleDay = (_, datestring) => {
    setDeadline(datestring);
  };
  const pendingTodos = search.filter((todo) => !todo.completed);
  const completedTodos = todoList.filter((todo) => todo.completed);
  let displayTodos = [...pendingTodos];

  if (sortType === "som_nhat") {
    displayTodos.sort((a, b) => {
      const endA = dayjs(a.deadline[1], "DD/MM/YYYY").valueOf();
      const endB = dayjs(b.deadline[1], "DD/MM/YYYY").valueOf();
      return endA - endB; // sớm nhất -> muộn nhất
    });
  } else if (sortType === "muon_nhat") {
    displayTodos.sort((a, b) => {
      const endA = dayjs(a.deadline[1], "DD/MM/YYYY").valueOf();
      const endB = dayjs(b.deadline[1], "DD/MM/YYYY").valueOf();
      return endB - endA; // muộn nhất -> sớm nhất
    });
  }
  const addTodo = () => {
    const id = document.getElementById("id").value;
    const title = document.getElementById("title").value;
    const newTodo = {
      id: id,
      title: title,
      completed: false,
      tags: selectedTags,
      deadline: deadline,
    };
    setTodoList([...todoList, newTodo]);
    setSearch([...todoList, newTodo]);
    document.getElementById("id").value = "";
    document.getElementById("title").value = "";
    setSelectedTags(["hoc_tap"]);
    setDeadline(null);
  };
  const hoanthanh = (id) => {
    setTodoList(
      todoList.map((todo) =>
        todo.id === id ? { ...todo, completed: true } : todo
      )
    );
    setSearch(
      todoList.map((todo) =>
        todo.id === id ? { ...todo, completed: true } : todo
      )
    );
  };
  const chuahoanthanh = (id) => {
    setTodoList(
      todoList.map((todo) =>
        todo.id === id ? { ...todo, completed: false } : todo
      )
    );
    setSearch(
      todoList.map((todo) =>
        todo.id === id ? { ...todo, completed: false } : todo
      )
    );
  };
  const xoa = (id) => {
    setTodoList(todoList.filter((todo) => todo.id !== id));
    setSearch(todoList.filter((todo) => todo.id !== id));
  };
  return (
    <>
      <div className="addtodo">
        <h1>Thêm công việc</h1>
        <form>
          <div className="form-group">
            <div className="form-label">ID:</div>
            <input type="text" id="id" className="form-control" />
          </div>
          <div className="form-group">
            <div className="form-label">Tiêu đề:</div>
            <input type="text" id="title" className="form-control" />
          </div>
          <div className="form-group">
            <div className="form-label">Tags:</div>
            <Space style={{ width: "100%" }} direction="vertical">
              <Select
                mode="multiple"
                allowClear
                style={{ width: "100%" }}
                placeholder="Please select"
                value={selectedTags}
                options={options}
                onChange={handleAdd}
              />
            </Space>
          </div>
          <div className="form-group">
            <div className="form-label">Deadline:</div>
            <RangePicker format="DD/MM/YYYY" onChange={handleDay} />
          </div>
        </form>
        <button className="btn-add" onClick={() => addTodo()}>
          Add Todo
        </button>
      </div>
      <div className="todo-list">
        <div
          className="todo-list-pending"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h1>Todo List pending</h1>
          <div>
            <Select
              defaultValue="mac_dinh"
              style={{ width: 120 }}
              onChange={handleSortDay}
              options={[
                { value: "mac_dinh", label: "Mặc định" },
                { value: "som_nhat", label: "Sớm nhất" },
                { value: "muon_nhat", label: "Muộn nhất" },
              ]}
            />
            <Select
              defaultValue="All"
              style={{ width: 120 }}
              onChange={handleSort}
              options={[
                { value: "All", label: "Tất cả" },
                { value: "hoc_tap", label: "Học tập" },
                { value: "cong_viec", label: "Công việc" },
                { value: "ca_nhan", label: "Cá nhân" },
              ]}
            />
          </div>
        </div>
        <table>
          <tr>
            <th>ID</th>
            <th>Tags</th>
            <th>Tiêu đề</th>
            <th>Trạng thái</th>
            <th>Deadline</th>
            <th>Hoạt động</th>
            <th>Chỉnh sửa</th>
          </tr>
          {displayTodos.length > 0 ? (
            <>
              {displayTodos.map((todo) => {
                const day = dayjs();
                const deadlineDay = dayjs(todo.deadline[1], "DD/MM/YYYY");
                const daydiff = day.diff(deadlineDay, "day");
                const color =
                  daydiff > 0
                    ? "red"
                    : Math.abs(daydiff) <= 2
                    ? "orange"
                    : "lightgreen";
                return (
                  <>
                    <tr
                      key={todo.id}
                      className="todo-item"
                      style={{ backgroundColor: color }}
                    >
                      <td>{todo.id}</td>
                      <td>
                        {todo.tags.map((tag) => {
                          let color =
                            tag === "hoc_tap"
                              ? "blue"
                              : tag === "cong_viec"
                              ? "volcano"
                              : "green";
                          return (
                            <>
                              <Tag color={color} key={tag}>
                                {tag.toUpperCase()}
                              </Tag>
                            </>
                          );
                        })}
                      </td>
                      <td>{todo.title}</td>
                      <td>Pending</td>
                      <td>
                        Ngày bắt đầu: {todo.deadline[0]}
                        <br /> Ngày kết thúc: {todo.deadline[1]}
                      </td>
                      <td>
                        <button
                          className="btn btn-primary"
                          onClick={() => hoanthanh(todo.id)}
                        >
                          Hoàn thành
                        </button>
                        <button
                          className="btn btn-danger"
                          onClick={() => xoa(todo.id)}
                        >
                          Xóa
                        </button>
                      </td>

                      <td>
                        <Button type="primary" onClick={() => showModal(todo)}>
                          Chỉnh sửa
                        </Button>
                      </td>
                    </tr>
                  </>
                );
              })}
            </>
          ) : (
            <>
              <tr>
                <td
                  colSpan="7"
                  className="text-center"
                  style={{ textAlign: "center" }}
                >
                  Không có công việc chưa hoàn thành
                </td>
              </tr>
            </>
          )}
        </table>
        <h1>Todo List completed</h1>
        <table>
          {completedTodos.length > 0 ? (
            <>
              <tr>
                <th>ID</th>
                <th>Tags</th>
                <th>Tiêu đề</th>
                <th>Trạng thái</th>
                <th>Deadline</th>
                <th>Hoạt động</th>
                <th>Chỉnh sửa</th>
              </tr>
              {completedTodos.map((todo) => (
                <tr key={todo.id}>
                  <td>{todo.id}</td>
                  <td>
                    {todo.tags.map((tag) => {
                      let color =
                        tag === "hoc_tap"
                          ? "blue"
                          : tag === "cong_viec"
                          ? "volcano"
                          : "green";
                      return (
                        <>
                          <Tag color={color} key={tag}>
                            {tag.toUpperCase()}
                          </Tag>
                        </>
                      );
                    })}
                  </td>
                  <td>{todo.title}</td>
                  <td>Completed</td>
                  <td>
                    Ngày bắt đầu: {todo.deadline[0]}
                    <br /> Ngày kết thúc: {todo.deadline[1]}
                  </td>
                  <td>
                    <button
                      className="btn btn-primary"
                      onClick={() => chuahoanthanh(todo.id)}
                    >
                      Chưa hoàn thành
                    </button>
                    <button
                      className="btn btn-danger"
                      onClick={() => xoa(todo.id)}
                    >
                      Xóa
                    </button>
                  </td>

                  <td>
                    <Button type="primary" onClick={() => showModal(todo)}>
                      Chỉnh sửa
                    </Button>
                  </td>
                </tr>
              ))}
            </>
          ) : (
            <>
              <tr>
                <th>ID</th>
                <th>Tags</th>
                <th>Tiêu đề</th>
                <th>Trạng thái</th>
                <th>Deadline</th>
                <th>Hoạt động</th>
                <th>Chỉnh sửa</th>
              </tr>
              <tr>
                <td
                  colSpan="7"
                  className="text-center"
                  style={{ textAlign: "center" }}
                >
                  Không có công việc đã hoàn thành
                </td>
              </tr>
            </>
          )}
        </table>
        {editingTodo && (
          <Modal
            title="Basic Modal"
            closable={{ "aria-label": "Custom Close Button" }}
            open={isModalOpen}
            onOk={handleOk}
            okText="Save"
            onCancel={handleCancel}
            cancelButtonProps={{ style: { display: "none" } }}
          >
            <p>Chỉnh sửa công việc</p>
            <form>
              <div className="form-group">
                <div className="form-label">Tiêu đề:</div>
                <input
                  type="text"
                  id="title"
                  className="form-control"
                  value={editingTodo.title}
                  onChange={(e) => handleChange(e)}
                />
              </div>
              <div className="form-group">
                <div className="form-label">Trạng thái:</div>
                <select
                  id="status"
                  value={
                    editingTodo.completed === false ? "pending" : "completed"
                  }
                  onChange={(e) => handleChange(e)}
                  className="form-control"
                >
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
              <div className="form-group">
                <div className="form-label">Tags:</div>
                <Space style={{ width: "100%" }} direction="vertical">
                  <Select
                    mode="multiple"
                    allowClear
                    style={{ width: "100%" }}
                    placeholder="Please select"
                    value={editingTodo.tags}
                    options={options}
                    onChange={(values) =>
                      setEditingTodo({ ...editingTodo, tags: values })
                    }
                  />
                </Space>
              </div>
              <div className="form-group">
                <div className="form-label">Deadline:</div>
                <RangePicker
                  value={
                    editingTodo.deadline
                      ? [
                          dayjs(editingTodo.deadline[0], "DD/MM/YYYY"),
                          dayjs(editingTodo.deadline[1], "DD/MM/YYYY"),
                        ]
                      : null
                  }
                  format="DD/MM/YYYY"
                  onChange={(date, dateString) => {
                    setEditingTodo({
                      ...editingTodo,
                      deadline: [dateString[0], dateString[1]],
                    });
                  }}
                />
              </div>
            </form>
          </Modal>
        )}
      </div>
    </>
  );
}
export default ListTodo;
