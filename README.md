useService
====
[Example](https://pjc0247.github.io/useService/)<br>

Reactjs service injection just like angular's.

__Made for replacement of state management library__<br>
This 100~ lines of code can replace your blahblah

Overview
----
```js
class AuthService {
  get isLoggedIn() { return !isNil(this.token); }

  async login() {
    const resp = await fetch(/* ... */);
    
    // Below mutations automatically trigger component update
    this.user = resp.user;
    this.token = resp.token;
  }
}
```
```js
const AuthComponent = () => {
  const auth = useService(AuthService);
  
  const onClickLogin = (id, pw) => {
    auth.login(id, pw);
  };
  
  return (
    { auth.isLoggedIn && <LoginComponent onClickLogin={onClickLogin} /> }
    { !auth.isLoggedIn && <UserProfileComponent /> }
  ); 
};
```

useComponentService
----
use `useComponentService` in case that you want to control more than one instances.
```js
// Get or create per-component service instance.
const auth = useComponentService(AuthService);
```

getService
----
```js
class PostService {
  async write() {
    const auth = getService(AuthService);
    /* ... */
  }
}
```

Error Handling
----

using __catch__

```js
const onClickLogin = async (id, pw) => {
  try {
    await auth.login(id, pw);
  } catch(e) {
    /* do something */
  }
};
```

using __useApi__

```js
const auth = useService(AuthService);
const login = useApi(auth.login);

const onClickLogin = (id, pw) => {
  login(id, pw);
};

return (
  { login.isFetching && "Please wait..." }
  { login.loginResult && "You are successfully logged in" }
  { login.error && "Login failed" }
);
```


변경 감지
----

```js
class UserService {
  changeNickname(newNickname) {
    this.nickname = newNickname;
  }
  setUserStatus(newStatus) {
    this.status = newStatus;
  }
}
```
```js
const UserProfileComponent = () => {
  const user = useService(UserService);
  return (
    <div>
      Nickname: {user.nickname}
    </div>
  );
};
```
```js
const UserStatusComponent = () => {
  const user = useService(UserService);
  return (
    <div>
      Status: {user.status}
      
      <div>
        Set As
        <button onClick={() => use.setUserStatus('online')}> ONLINE </button>
        <button onClick={() => use.setUserStatus('away')}> AWAY </button>
      </div>
    </div>
  );
};
```
