import * as React from "react";
import { forwardRef } from "react";
const wvw = (props, ref) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 16" ref={ref} {...props}><g clipPath="url(#a)"><circle cx={8} cy={8} r={7.5} stroke="currentColor" /><path stroke="currentColor" d="M7 .5c.5 3 1 4.5-1 5S5.5 8 5.5 9 3 9 2 12.5M12.5 2c-1 2-3 2-3 3S11 6.5 11 8.5s1.458.404 2 1c.947 1.042-2.427 1.658-2 3 .251.79.71 1.249 1.5 1.5" /></g><defs><clipPath id="a"><path fill="#fff" d="M0 0h16v16H0z" /></clipPath></defs></svg>;
const ForwardRef = forwardRef(wvw);
export default ForwardRef;