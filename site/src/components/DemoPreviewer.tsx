import React, { FC, useEffect, useLayoutEffect, useState } from "react";
import Basic from "@site/src/demos/Basic";
import DemoCodeBlock from "@site/src/components/DemoCodeBlock";
import {
  Box,
  Button,
  IconButton,
  Menu,
  MenuItem,
  MenuList,
  Paper,
  Checkbox,
  FormControlLabel,
  Tooltip,
  Switch,
} from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";

const useDynamicDemoImport = (name) => {
  const [raw, setRaw] = useState(null);
  const [rawSimple, setRawSimple] = useState(null);
  // const Comp = React.lazy(() => import(`@site/src/demos/${name}`)); @react18
  useEffect(() => {
    let resolvedRaw = false;
    let resolvedRawSimple = false;
    let resolvedComp = false;
    import(`!!raw-loader!@site/src/demos/${name}/index`)
      .then((m) => {
        if (!resolvedRaw) {
          resolvedRaw = true;
          setRaw(m.default);
        }
      })
      .catch(console.error);
    import(`!!raw-loader!@site/src/demos/${name}/simple`)
      .then((m) => {
        if (!resolvedRawSimple) {
          resolvedRawSimple = true;
          setRawSimple(m.default);
        }
      })
      .catch(console.error);
    return () => {
      resolvedRaw = true;
      resolvedRawSimple = true;
      resolvedComp = true;
    };
  }, []);
  return [
    // Comp, // @react18
    raw,
    rawSimple,
  ];
};

interface DemoPreviewerProps {
  name: string;
  Comp: React.FC; // @react18
}

const RootDemoPreviewer: FC<DemoPreviewerProps> = (props) => {
  return (
    // <React.Suspense fallback={<div>Loading...</div>}> // @react18
    <DemoPreviewer {...props} />
    // </React.Suspense> // @react18
  );
};

const DemoPreviewer: FC<DemoPreviewerProps> = (props) => {
  const [
    // Comp, // @react18
    raw,
    rawSimple,
  ] = useDynamicDemoImport(props.name);
  const [shouldReset, setShouldReset] = useState(false);
  useLayoutEffect(() => {
    setShouldReset(false);
  }, [shouldReset]);

  const [showSettings, setShowSettings] = useState(false);
  const [overflowHidden, setOverflowHidden] = useState(true);

  const settingButtonRef = React.useRef(null);
  return (
    <Paper
      sx={{
        position: "relative",
        // verticalAlign: "top",
        // display: "flex",
        // flexDirection: "column",
      }}
      elevation={5}
    >
      <Box sx={{ display: "flex" }}>
        {/* reset button */}
        <Box className={"button button--secondary"} onClick={() => setShouldReset(true)}>
          reset
        </Box>
        <Box sx={{ flexGrow: 1 }} />
        {/* settings button */}
        <Tooltip title={"Demo Options"}>
          <IconButton onClick={() => setShowSettings(true)} ref={settingButtonRef}>
            <SettingsIcon />
          </IconButton>
        </Tooltip>
        <Menu anchorEl={settingButtonRef.current} open={showSettings} onClose={() => setShowSettings(false)}>
          <MenuList dense>
            <MenuItem>
              <FormControlLabel
                control={<Checkbox checked={overflowHidden ?? true} onChange={(e, v) => setOverflowHidden(v)} />}
                label={<code>overflow:"hidden"</code>}
              />
            </MenuItem>
          </MenuList>
        </Menu>
      </Box>
      {/* the rendered demo */}
      <Box
        sx={{
          position: "relative",
          m: 2,
          overflow: overflowHidden ? "hidden" : "visible",
          zIndex: overflowHidden ? 0 : 1,
        }}
      >
        {!shouldReset && <props.Comp />}
      </Box>
      {/* the demo code preview */}
      <Paper>
        <DemoCodeBlock simpleSource={rawSimple} fullSource={raw} />
      </Paper>
    </Paper>
  );
};

export default RootDemoPreviewer;
