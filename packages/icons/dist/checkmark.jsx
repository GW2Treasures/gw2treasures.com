import * as React from "react";
import { forwardRef } from "react";
const checkmark = (props, ref) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 16" ref={ref} {...props}><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" d="M2.5 8.5 6 12l7.5-7.5" /></svg>;
const ForwardRef = forwardRef(checkmark);
export default ForwardRef;