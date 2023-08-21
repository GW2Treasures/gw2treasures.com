import * as React from "react";
import { forwardRef } from "react";
const external-link = (props, ref) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 16" ref={ref} {...props}><path stroke="currentColor" strokeLinecap="round" d="M6.5 6.5h-2a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h3a2 2 0 0 0 2-2v-2" /><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" d="M7.5 4.5h4m0 0v4m0-4-5 5" /></svg>;
const ForwardRef = forwardRef(external-link);
export default ForwardRef;