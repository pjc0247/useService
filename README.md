useService
====
Reactjs service injection just like angular's.

```js
class AuthService {
  async login() {
    const resp = await fetch(/* ... */);
    this.user = resp.user;
    this.token = resp.token;
  }
}
```
```js
const AuthComponent = () => {
  const [id, setId] = useState('');
  const [pw, setPw] = useState('');
  const auth = useService(AuthService);
  
  const onClickLogin = () => {
    auth.login(id, pw);
  };
  
  return (
    /* ... */
  ); 
};
```
