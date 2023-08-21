import * as React from "react";
import { forwardRef } from "react";
const sort = (props, ref) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 16" ref={ref} {...props}><path stroke="currentColor" strokeLinejoin="round" d="M7.578 1.663 4.99 5.732a.5.5 0 0 0 .422.768h5.178a.5.5 0 0 0 .422-.768l-2.59-4.07a.5.5 0 0 0-.843 0ZM10.59 9.5H5.41a.5.5 0 0 0-.421.768l2.59 4.07a.5.5 0 0 0 .843 0l2.589-4.07a.5.5 0 0 0-.422-.768Z" /></svg>;
const ForwardRef = forwardRef(sort);
export default ForwardRef;