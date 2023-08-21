import * as React from "react";
import { forwardRef } from "react";
const skin = (props, ref) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 16" ref={ref} {...props}><path stroke="currentColor" strokeLinejoin="round" d="M4.414 2.5H5.5l.195.234a3 3 0 0 0 4.61 0L10.5 2.5h1.086a1 1 0 0 1 .707.293l2.5 2.5a1 1 0 0 1 0 1.414l-1.086 1.086a1 1 0 0 1-1.414 0L11.5 7v6.5a1 1 0 0 1-1 1h-5a1 1 0 0 1-1-1V7l-.793.793a1 1 0 0 1-1.414 0L1.207 6.707a1 1 0 0 1 0-1.414l2.5-2.5a1 1 0 0 1 .707-.293Z" /></svg>;
const ForwardRef = forwardRef(skin);
export default ForwardRef;