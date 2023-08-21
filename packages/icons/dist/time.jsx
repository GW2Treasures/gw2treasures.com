import * as React from "react";
import { forwardRef } from "react";
const time = (props, ref) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 16" ref={ref} {...props}><g clipPath="url(#a)"><circle cx={7.5} cy={8.5} r={6} stroke="currentColor" /><path stroke="currentColor" strokeLinecap="round" d="M7.493 4.5v5M5.5.5h4m5 3-2-2" /></g><defs><clipPath id="a"><path fill="#fff" d="M0 0h16v16H0z" /></clipPath></defs></svg>;
const ForwardRef = forwardRef(time);
export default ForwardRef;