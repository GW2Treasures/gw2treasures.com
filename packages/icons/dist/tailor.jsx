import * as React from "react";
import { forwardRef } from "react";
const tailor = (props, ref) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 16" ref={ref} {...props}><circle cx={7.5} cy={2.5} r={2} stroke="currentColor" /><circle cx={13.5} cy={6.5} r={2} stroke="currentColor" /><path stroke="currentColor" strokeLinecap="round" d="M7.5 4.5v11m-6-4 4-1.667m6-2.5L7.5 9" /></svg>;
const ForwardRef = forwardRef(tailor);
export default ForwardRef;