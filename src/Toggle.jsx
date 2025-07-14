import * as React from "react";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";

export default function SwitchLabels(props) {
  function handleclick() {
    props.setToggle(!props.Toggle);
    const toggle = !props.Toggle;
    props.toggleData(toggle, props.city);
  }

  return (
    <FormGroup>
      <FormControlLabel
        control={<Switch />}
        label="custom data"
        onClick={() => handleclick()}
      />
    </FormGroup>
  );
}
