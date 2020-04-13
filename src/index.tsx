import * as React from "react";
import { render } from "react-dom";
import "./index.css";

import SimpleExample from "./../examples/src/SimpleExample";
const rootElement = document.getElementById("root");
render(<SimpleExample />, rootElement);
