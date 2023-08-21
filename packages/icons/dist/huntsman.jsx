import * as React from "react";
import { forwardRef } from "react";
const huntsman = (props, ref) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 16" ref={ref} {...props}><path stroke="currentColor" d="m3.782 10.81 3.755-9.179a.5.5 0 0 1 .926 0l3.755 9.18a.5.5 0 0 1-.463.689H10a.5.5 0 0 0-.5.5v2a1.5 1.5 0 0 1-3 0v-2a.5.5 0 0 0-.5-.5H4.245a.5.5 0 0 1-.463-.69Z" /></svg>;
const ForwardRef = forwardRef(huntsman);
export default ForwardRef;