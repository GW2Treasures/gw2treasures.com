import * as React from "react";
import { forwardRef } from "react";
const loading = (props, ref) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 16" ref={ref} {...props}><path stroke="currentColor" strokeLinecap="round" d="M2 5.5a6.502 6.502 0 0 1 12.002 0" transform-origin="8 8" className="path" /></svg>;
const ForwardRef = forwardRef(loading);
export default ForwardRef;