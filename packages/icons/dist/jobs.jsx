import * as React from "react";
import { forwardRef } from "react";
const jobs = (props, ref) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 16" ref={ref} {...props}><path stroke="currentColor" strokeLinecap="round" d="M7.5 3.5h8m-8 4h8m-8 4h8m-15-8 1 1 3-3m-4 6 1 1 3-3m-4 6 1 1 3-3" /></svg>;
const ForwardRef = forwardRef(jobs);
export default ForwardRef;