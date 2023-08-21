import * as React from "react";
import { forwardRef } from "react";
const eye = (props, ref) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 16" ref={ref} {...props}><circle cx={8} cy={9.5} r={3} stroke="currentColor" /><path stroke="currentColor" strokeLinecap="round" d="M15.5 9.5c-.695-3.423-3.872-6-7.5-6S1.195 6.077.5 9.5" /></svg>;
const ForwardRef = forwardRef(eye);
export default ForwardRef;