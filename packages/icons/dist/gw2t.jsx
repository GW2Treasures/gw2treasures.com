import * as React from "react";
import { forwardRef } from "react";
const gw2t = (props, ref) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="none" viewBox="0 0 16 16" ref={ref} {...props}><path fill="currentColor" fillRule="evenodd" d="M3.84 2.5h8.32a1 1 0 0 1 .806.409l2.541 3.468a1 1 0 0 1-.08 1.279l-6.7 7.077a1 1 0 0 1-1.453 0l-6.7-7.077a1 1 0 0 1-.081-1.279l2.54-3.468A1 1 0 0 1 3.84 2.5Z" clipRule="evenodd" /></svg>;
const ForwardRef = forwardRef(gw2t);
export default ForwardRef;