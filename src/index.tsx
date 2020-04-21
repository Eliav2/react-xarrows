import * as React from "react";
import { render } from "react-dom";
import "./index.css";

import ExamplePage from "./tests/ExamplePage";
const rootElement = document.getElementById("root");
render(<ExamplePage />, rootElement);
