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
      return target[prop];
    },
    set: (target, prop, newValue) => {
      target[prop] = newValue;
      if (prop !== '__subscribers') {
        for (const subscriber of p.__subscribers) {
          if (subscriber.props[prop])
            subscriber.render();
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
const useService = (service) => {
  const render = useRerender();
  const subscription = React.useRef({
    render,
    props: {},
  });
  const s = getService(service);

  React.useEffect(() => {
    s.__subscribers.push(subscription.current);
  }, [s]);
  
  currentSubscription = subscription.current;
  currentSubscription.props = {};
  return s;
};
