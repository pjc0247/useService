useService
====
Reactjs service injection just like angular's.

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
