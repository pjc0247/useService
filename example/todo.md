Todo Application
====

```js
class TodoService {
  constructor() {
    this.items = [];
  }
  
  add(name) {
    this.items.push({
      name,
    });
  }
}
```
```js
const TodoComponent = () => {
  const todo = useService(TodoService);

  const addTodo = (name) => todo.add(name);

  return (
    <ul>
      {todo.items.map(x => (
        <li>{item.name}</li> 
      ))}
    </ul>
  );
};
```
