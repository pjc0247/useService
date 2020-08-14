const services = {};
let currentSubscription = null;

const getService = (service) => {
  let s = services[service];
  if (!s) {
    s = createService(service);
    services[service] = s;
  }
  return s;
};
const createService = (service) => {
  const s = new service();
  const publishChange = (p, prop) => {
    for (const subscriber of p.__subscribers) {
      if (subscriber.props[prop]) {
        subscriber.render();
      }
    }
  };
  const p = new Proxy(s, {
    get: (target, prop) => {
      if (prop !== '__subscribers') {
        if (currentSubscription)
          currentSubscription.props[prop] = true;
      }
      const value = target[prop];
      if (typeof value === 'function') {
        return (...args) => {
          const subscription = currentSubscription;
          currentSubscription = { props: {} };
          const ret = value.bind(p)(...args);
          currentSubscription = subscription;
          return ret;
        };
      } else if (value && Array.isArray(value) && !value.__proxied) {
        const wrapped = createObservedArray(value, () => {
          publishChange(p, prop);
        });
        wrapped.__proxied = true;
        p[prop] = wrapped;
      }
      return value;
    },
    set: (target, prop, newValue) => {
      target[prop] = newValue;
      if (prop !== '__subscribers') {
        publishChange(p, prop);
      }
      return newValue;
    },
  });
  p.__subscribers = [];
  return p;
};

const createObservedArray = (ary, onChange) => {
  const p = new Proxy(ary, {
    get: (target, prop) => {
      const value = target[prop];
      if (typeof value === 'function') {
        if (prop === 'push' || prop === 'unshift' || prop === 'pop') {
          onChange();
        }
      }
      return value;
    },
    set: (target, prop, value) => {
      target[prop] = value;

      if (!prop.startsWith('__'))
        onChange(prop);
      return value;
    },
  });
  return p;
};
const createObservedObject = (obj, onChange) => {
  const p = new Proxy(obj, {
    set: (target, prop, value) => {
      target[prop] = value;
      if (!prop.startsWith('__'))
        onChange(prop);
      return value;
    },
    deleteProperty: (target, prop) => {
      if (!prop.startsWith('__'))
        onChange(prop);
      delete target[prop];
      return true;
    },
  });
  return p;
};

const useRerender = () => {
  const [, renderSelf] = React.useState(0);
  return () => renderSelf(Date.now());
};
const useComponentService = (service) => {
  const render = useRerender();
  const subscription = React.useRef({
    render,
    props: {},
  });
  const s = React.useMemo(() => { 
    return createService(service);
  }, [service]);
  React.useEffect(() => {
    s.__subscribers= [subscription.current];
  }, [s]);
  return s;
};
const useService = (service, name) => {
  const render = useRerender();
  const subscription = React.useRef({
    name: name,
    render,
    props: {},
  });
  const s = getService(service);

  React.useEffect(() => {
    s.__subscribers.unshift(subscription.current);
  }, [s]);
  React.useEffect(() => {
    currentSubscription = null;
  });
  
  currentSubscription = subscription.current;
  currentSubscription.props = {};
  return s;
};
