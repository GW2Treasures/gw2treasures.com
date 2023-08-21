import * as React from "react";
import { forwardRef } from "react";
const unlock = (props, ref) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 16" ref={ref} {...props}><rect width={11} height={9} x={2.5} y={6.5} stroke="currentColor" rx={1.5} /><circle cx={8} cy={11} r={1} fill="currentColor" /><path stroke="currentColor" strokeLinecap="round" d="M4.5 6.5V4a3.5 3.5 0 0 1 6.663-1.5" /></svg>;
const ForwardRef = forwardRef(unlock);
export default ForwardRef;