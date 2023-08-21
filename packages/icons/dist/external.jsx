import * as React from "react";
import { forwardRef } from "react";
const external = (props, ref) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 16" ref={ref} {...props}><path stroke="currentColor" strokeLinecap="round" d="M6.5 2.5h-3a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-3" /><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" d="M8.5 1.5h6m0 0v6m0-6-7 7" /></svg>;
const ForwardRef = forwardRef(external);
export default ForwardRef;