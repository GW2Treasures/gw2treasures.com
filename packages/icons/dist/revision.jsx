import * as React from "react";
import { forwardRef } from "react";
const revision = (props, ref) => <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} fill="none" viewBox="0 0 16 16" ref={ref} {...props}><g clipPath="url(#a)"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" d="M1.5.5v4h4" /><path stroke="currentColor" strokeLinecap="round" d="M7.5 3.5v4l3 3" /><path stroke="currentColor" strokeLinecap="round" d="M.5 8a7.5 7.5 0 1 0 1.105-3.92" /></g><defs><clipPath id="a"><path fill="#fff" d="M0 0h16v16H0z" /></clipPath></defs></svg>;
const ForwardRef = forwardRef(revision);
export default ForwardRef;