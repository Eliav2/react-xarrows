const AmazingApp = () => {
  const selfRef = useRef(null);
  const [domPosition, setDomPosition] = useState(null);

  const funcThatDependesOnImported = () => {
    let storeImportent = domPosition;
  };

  useEffect(() => {
    // equilavent to componentDidMount
    setImportent(self);
    let importentValue = funcThatDependesOnImported(); //error! 'domPosition' not initialized yet
  }, []);

  return <div ref={selfRef}> my great div</div>;
};

const AmazingApp = () => {
  const selfRef = useRef(null);
  const [domPosition, setImportent] = useState(null);
  const [hasMounted, setHasMounted] = useState(false);

  const funcThatDependesOnImported = () => {
    let storeImportent = domPosition;
  };

  useEffect(() => {
    setImportent("domPosition value");
    setHasMounted(true);
  }, []);

  useEffect(() => {
    let importentValue = funcThatDependesOnImported(); //still an error! 'domPosition' not initialized yet
  }, [hasMounted]);

  return <div ref={selfRef}> my great div</div>;
};
