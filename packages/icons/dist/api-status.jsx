import * as React from "react";
import { forwardRef } from "react";
const api-status = (props, ref) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 16" ref={ref} {...props}><path stroke="currentColor" d="M.5 9.5a3 3 0 0 0 3 3h9a3 3 0 0 0 .446-5.967.621.621 0 0 1-.518-.475A4.534 4.534 0 0 0 8 2.5a4.534 4.534 0 0 0-4.428 3.558.621.621 0 0 1-.518.475A3 3 0 0 0 .5 9.5Z" /><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" d="M2.5 9.5h2l2-3 2 4 2-3 1 2h2" /></svg>;
const ForwardRef = forwardRef(api-status);
export default ForwardRef;