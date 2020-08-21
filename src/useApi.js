const useApi = (api) => {
  const [value, setValue] = React.useState(null);
  const [isFetching, setIsFetching] = React.useState(false);
  const [error, setError] = React.useState(null);

  const reset = () => {
    setError(null);
    setValue(null);
    setIsFetching(true);
  };
  const exec = async (...args) => {
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

  exec.value = value;
  exec.isFetching = isFetching;
  exec.error = error;
  return exec;
};
