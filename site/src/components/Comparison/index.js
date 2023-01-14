import React, { FC } from "react";
import { Resizable as ReResizable } from "re-resizable";
import TrueResizable from "react-true-resizable";
import { BoxStyle } from "@site/src/demos/Basic";

const Comparison = (props) => {
  return (
    <div>
      <table>
        <tr>
          <th>react-true-resizable</th>
          <th>re-resizable</th>
        </tr>
        <tr>
          <td>
            <TrueResizable>
              <div style={BoxStyle}>TrueResizable</div>
            </TrueResizable>
          </td>
          <td>
            <ReResizable>
              <div style={BoxStyle}>ReResizable</div>
            </ReResizable>
          </td>
        </tr>
      </table>
    </div>
  );
};

export default Comparison;
