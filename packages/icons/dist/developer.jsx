import * as React from "react";
import { forwardRef } from "react";
const developer = (props, ref) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 16" ref={ref} {...props}><path stroke="currentColor" strokeLinejoin="round" d="M3.5 3.5v-3C2.12.5 1 1.843 1 3.5c0 1.19.593 2.24 1.5 2.873V13.5a2 2 0 1 0 4 0V6.373A3.496 3.496 0 0 0 8 3.5c0-1.657-1.12-3-2.5-3v3h-2Zm6 7v3a2 2 0 1 0 4 0v-3m-4 0v-2h1m-1 2h4m0 0v-2h-1m0 0V3c.5-1 .5-1.5 0-2.5h-2c-.5 1-.5 1.5 0 2.5v5.5m2 0h-2" /></svg>;
const ForwardRef = forwardRef(developer);
export default ForwardRef;