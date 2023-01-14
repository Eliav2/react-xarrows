import React from "react";
import { useDynamicImport } from "docusaurus-plugin-react-docgen-typescript/pkg/dist-src/hooks/useDynamicImport";
import DocgenPropsTableC from "react-docgen-props-table";
import { usePropsTable } from "react-docgen-props-table";

export const DocusarusTable = ({ props }) => {
  if (!props) {
    return null;
  }

  return (
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Type</th>
          <th>Raw</th>
          <th>Default Value</th>
          <th>Required</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
        {Object.keys(props).map((key) => {
          return (
            <tr key={key}>
              <td>
                <code>{key}</code>
              </td>
              <td>
                <code>{props[key].tsType?.name}</code>
              </td>
              <td>
                <code>{props[key].tsType?.raw}</code>
              </td>
              <td>{props[key].defaultValue && <code>{props[key].defaultValue.value}</code>}</td>
              <td>{props[key].required ? "Yes" : "No"}</td>
              <td>{props[key].description}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export const DocusarusPropsTable = ({ name }) => {
  const props = useDynamicImport(name);
  return <DocusarusTable props={props} />;
};

export const DocgenPropsTable = ({ name }) => {
  const props = useDynamicImport(name);

  if (!props) {
    return null;
  }
  return <DocgenPropsTableC props={props} />;
};

import useDocgenImport from "@site/src/hooks/useDynamicDocgenImport";

export const MyDynamicDocgenPropsTable = ({ path, name }) => {
  const docgen = useDocgenImport();
  if (!docgen) return null;
  return (
    <>
      <DocgenPropsTableC props={docgen.resizable.props} />
    </>
  );
};

export default DocusarusPropsTable;
