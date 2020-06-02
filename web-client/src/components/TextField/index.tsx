import React from "react";
import { TextField as MuiTextField } from "@material-ui/core";

export type FieldInputProp = {
  input: any;
  meta: any;
};

export default function TextField(props: FieldInputProp) {
  const { input, meta, ...rest } = props;
  function handleChange(event: any) {
    input.onChange(event.target.value);
  }
  return <MuiTextField
    {...input}
    {...rest}
    onChange={handleChange}
    helperText={meta.touched ? meta.error : ""}
  />;
}
