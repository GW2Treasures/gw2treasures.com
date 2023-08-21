import * as React from "react";
import { forwardRef } from "react";
const search = (props, ref) => <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} fill="none" viewBox="0 0 16 16" ref={ref} {...props}><circle cx={9.5} cy={6.5} r={5} stroke="currentColor" /><path stroke="currentColor" strokeLinecap="round" d="M5.75 10.25 1.5 14.5" /></svg>;
const ForwardRef = forwardRef(search);
export default ForwardRef;