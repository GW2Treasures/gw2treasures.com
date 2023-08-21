import * as React from "react";
import { forwardRef } from "react";
const menu = (props, ref) => <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} fill="none" viewBox="0 0 16 16" ref={ref} {...props}><path stroke="currentColor" strokeLinecap="round" d="M.5 4.5h15m-15 4h15m-15 4h15" /></svg>;
const ForwardRef = forwardRef(menu);
export default ForwardRef;