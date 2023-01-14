import { useEffect, useState } from "react";

// const useDynamicImport = (path) => {
//   const [props, setProps] = useState(null);
//   useEffect(() => {
//     let resolved = false;
//     console.log("path", path);
//     import(path)
//       .then((props2) => {
//         if (!resolved) {
//           console.log("props2", props2);
//           resolved = true;
//           setProps(props2.default);
//         }
//       })
//       .catch(console.error);
//     return () => {
//       resolved = true;
//     };
//   }, [path]);
//   return props;
// };
const useDynamicDocgenImport = () => {
  const [props, setProps] = useState(null);
  useEffect(() => {
    let resolved = false;
    import(`@generated/docusaurus-plugin-react-docgen/docgen-creator/docgen.json`)
      // import(`${path}`)
      .then((props2) => {
        if (!resolved) {
          resolved = true;
          setProps(props2.default);
        }
      })
      .catch(console.error);
    return () => {
      resolved = true;
    };
  }, []);
  return props;
};

export default useDynamicDocgenImport;
