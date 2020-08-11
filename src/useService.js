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
  const p = new Proxy(s, {
    get: (target, prop) => {
      if (prop !== '__subscribers') {
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
      }
      return value;
    },
    set: (target, prop, newValue) => {
      target[prop] = newValue;
      if (prop !== '__subscribers') {
        for (const subscriber of p.__subscribers) {
          if (subscriber.props[prop]) {
            subscriber.render();
          }
        }
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
    return createService(service);
  }, [service]);
  return instance;
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

const useApi = (api) => {
  const [value, setValue] = React.useState(null);
  const [isFetching, setIsFetching] = React.useState(false);
  const [error, setError] = React.useState(null);

  const reset = () => {
    setError(null);
    setValue(null);
    setIsFetching(true);
  };
  const run = async (...args) => {
    try {
      reset();
      const v = await api(...args);
      setValue(v);
    } catch(e) {
      setError(e);
    } finally {
      setIsFetching(false);
    }
  };

  return [run, value, isFetching, error];
};
