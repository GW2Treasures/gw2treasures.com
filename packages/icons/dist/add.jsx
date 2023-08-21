import * as React from "react";
import { forwardRef } from "react";
const add = (props, ref) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 16" ref={ref} {...props}><path stroke="currentColor" strokeLinecap="round" d="M7.5 12.5v-10m-5 5h10" /></svg>;
const ForwardRef = forwardRef(add);
export default ForwardRef;