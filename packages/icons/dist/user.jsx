import * as React from "react";
import { forwardRef } from "react";
const user = (props, ref) => <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} fill="none" viewBox="0 0 16 16" ref={ref} {...props}><g clipPath="url(#a)"><circle cx={8} cy={4} r={3.5} stroke="currentColor" /><path stroke="currentColor" d="M3 9.5h10a1.5 1.5 0 0 1 1.5 1.5c0 1.55-.761 2.651-1.95 3.387-1.21.75-2.86 1.113-4.55 1.113s-3.34-.364-4.55-1.113C2.262 13.651 1.5 12.55 1.5 11A1.5 1.5 0 0 1 3 9.5Z" /></g><defs><clipPath id="a"><path fill="#fff" d="M0 0h16v16H0z" /></clipPath></defs></svg>;
const ForwardRef = forwardRef(user);
export default ForwardRef;