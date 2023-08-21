import * as React from "react";
import { forwardRef } from "react";
const info = (props, ref) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 16" ref={ref} {...props}><circle cx={7.5} cy={7.5} r={7} stroke="currentColor" /><path fill="currentColor" d="M8.12 11.495a.625.625 0 1 1-1.25 0 .625.625 0 0 1 1.25 0Z" /><path stroke="currentColor" strokeLinecap="round" d="M7.5 9.5c0-1.5 2-2.5 2-4a2 2 0 1 0-4 0" /></svg>;
const ForwardRef = forwardRef(info);
export default ForwardRef;