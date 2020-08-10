const services = {};
const getService = (service) => {
  const name = service.name;
  return services[name];
};
const createService = (service, render) => {
  const s = new service();
  const p = new Proxy(s, {
    get: (target, prop) => {
      // TODO: build read-map
      return target[prop];
    },
    set: (target, prop, newValue) => {
      target[prop] = newValue;
      if (prop !== '__subscribers') {
        for (const subscriber of p.__subscribers)
          subscriber();
      }
      return newValue;
    },
  });
  p.__subscribers = [];
  return p;
};

const useRerender = () => {
  const [, renderSelf] = React.useState(0);
  return () => renderSelf(Date.now());
};
const useComponentService = (service) => {
  const render = useRerender();
  const instance = React.useMemo(() => {
    return createService(service, render);
  }, [service]);
  return instance;
};
const useService = (service) => {
  const render = useRerender();
  let s = services[service.name];
  if (!s) {
    s = createService(service, render);
    services[service.name] = s;
  }

  React.useEffect(() => {
    s.__subscribers.push(render);
  }, [s]);
  
  return s;
};
