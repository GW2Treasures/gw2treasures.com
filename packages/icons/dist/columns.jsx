import * as React from "react";
import { forwardRef } from "react";
const columns = (props, ref) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 16" ref={ref} {...props}><g clipPath="url(#a)"><path stroke="currentColor" d="M14 .5H2A1.5 1.5 0 0 0 .5 2v12A1.5 1.5 0 0 0 2 15.5h12a1.5 1.5 0 0 0 1.5-1.5V2A1.5 1.5 0 0 0 14 .5ZM5.5 1v14m5 0V1M1 3.5h14" /></g><defs><clipPath id="a"><path fill="#fff" d="M0 0h16v16H0z" /></clipPath></defs></svg>;
const ForwardRef = forwardRef(columns);
export default ForwardRef;