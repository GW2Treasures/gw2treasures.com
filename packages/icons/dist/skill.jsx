import * as React from "react";
import { forwardRef } from "react";
const skill = (props, ref) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 16" ref={ref} {...props}><rect width={13} height={13} x={1.5} y={1.5} stroke="currentColor" rx={2.5} /><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" d="M8 9.5c-2-1-2-6 0-6s2 5 0 6Zm0 0s-.5 1.5 0 3c.5-1.5 0-3 0-3Zm0 0h2.5M8 9.5H5.5" /></svg>;
const ForwardRef = forwardRef(skill);
export default ForwardRef;