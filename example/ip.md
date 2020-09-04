```js
class IpService {
  constructor() {
    this.ip = null;
  }
  
  async getIp() {
    const resp = await fetch('https://x-y.net/ip');
    this.ip = await resp.text();
  }
}
```
```js
const ConnectionStatus = () => {
  const ip = useService(IpService);
  
  return (
    <div>
      {ip.ip}
    </div>
  );
};
```
