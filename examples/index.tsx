import * as React from "react";
import { render } from "react-dom";
import "./index.css";

import ExamplePage from "./ExamplePage";
const rootElement = document.getElementById("root");
console.log(rootElement.parentElement.parentElement.parentElement);
render(<ExamplePage />, rootElement);
