import React, { FC } from "react";

import DocusaurusCodeBlock, { Props as DocusaurusCodeBlockProps } from "@theme/CodeBlock";
import { Box, Tab, Tabs, ToggleButton, ToggleButtonGroup, Tooltip, Typography } from "@mui/material";
import CodeIcon from "@mui/icons-material/Code";
import CodeOffIcon from "@mui/icons-material/CodeOff";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
// import Tabs from "@theme/Tabs";
// import TabItem from "@theme/TabItem";

interface CodeBlockProps {
  simpleSource?: string;
  fullSource?: string;
  codeTitle?: string;
  // live?: string;
  // extraTabs?: { title: string; elem: JSX.Element }[];
}

// const CodeBlock: FC<CodeBlockProps> = (props) => {
//   const tabs = [
//     <TabItem
//       key={"simple"}
//       value="simple"
//       // @ts-ignore
//       label={
//         <Tooltip title="Simple Source">
//           <CodeOffIcon />
//         </Tooltip>
//       }
//       default
//     >
//       <DocusaurusCodeBlock showLineNumbers language="jsx">
//         {props.simpleSource}
//       </DocusaurusCodeBlock>
//     </TabItem>,
//     <TabItem
//       key={"full"}
//       value="full"
//       // @ts-ignore
//       label={
//         <Tooltip title="Full Source">
//           <CodeIcon />
//         </Tooltip>
//       }
//     >
//       <DocusaurusCodeBlock showLineNumbers language="jsx">
//         {props.fullSource}
//       </DocusaurusCodeBlock>
//     </TabItem>,
//   ];
//
//   return (
//     <Box sx={{ my: 2 }}>
//       <Tabs>{tabs}</Tabs>
//     </Box>
//   );
// };

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && children}
    </div>
  );
}

export const DemoCodeBlockMui: FC<CodeBlockProps> = (props) => {
  const [tabIndex, setTabIndex] = React.useState(0);

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ borderBottom: 1, borderTop: 1, borderColor: "divider" }}>
        <Tabs value={tabIndex} onChange={(e, v) => setTabIndex(v)}>
          <Tab
            label={
              <Tooltip title="Simple Source">
                <CodeOffIcon />
              </Tooltip>
            }
          />
          <Tab
            label={
              <Tooltip title="Full Source">
                <CodeIcon />
              </Tooltip>
            }
          />
        </Tabs>
      </Box>
      <TabPanel value={tabIndex} index={0}>
        <DocusaurusCodeBlock showLineNumbers language="jsx" title={props.codeTitle}>
          {props.simpleSource}
        </DocusaurusCodeBlock>
      </TabPanel>
      <TabPanel value={tabIndex} index={1}>
        <DocusaurusCodeBlock showLineNumbers language="jsx" title={props.codeTitle}>
          {props.fullSource}
        </DocusaurusCodeBlock>
      </TabPanel>
    </Box>
  );
};
// // mui implementation
// const CodeBlock: FC<CodeBlockProps> = (props) => {
//   const [alignment, setAlignment] = React.useState("simple");
//   console.log(props.simpleSource);
//
//   return (
//     <Box sx={{ my: 2 }}>
//       <ToggleButtonGroup color="primary" value={alignment} exclusive onChange={(e, v) => setAlignment(v)}>
//         <ToggleButton value="simple">
//           <Tooltip title="Simple Source">
//             <CodeOffIcon />
//           </Tooltip>
//         </ToggleButton>
//         <ToggleButton value="full">
//           <Tooltip title="Full Source">
//             <CodeIcon />
//           </Tooltip>
//         </ToggleButton>
//       </ToggleButtonGroup>
//       {alignment === "simple" && (
//         <DocusaurusCodeBlock showLineNumbers language="jsx">
//           {props.simpleSource}
//         </DocusaurusCodeBlock>
//       )}
//       {alignment === "full" && (
//         <DocusaurusCodeBlock showLineNumbers language="jsx">
//           {props.fullSource}
//         </DocusaurusCodeBlock>
//       )}
//     </Box>
//   );
// };

export default DemoCodeBlockMui;
