import * as React from "react";
import { forwardRef } from "react";
const scribe = (props, ref) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 16" ref={ref} {...props}><g clipPath="url(#a)"><path stroke="currentColor" strokeLinecap="round" d="m.5 15.5 2-2m0 0c7.167-2.096 10.698-5.683 12.74-12.137a.477.477 0 0 0-.601-.602c-1.952.627-3.657 1.425-5.139 2.418M2.5 13.5c.723-2.53 1.707-4.669 3-6.462m0 2.462V7.038m0 0a15.52 15.52 0 0 1 2-2.275m0 2.737V4.763m0 0a15.82 15.82 0 0 1 2-1.584m0 2.321V3.179" /></g><defs><clipPath id="a"><path fill="#fff" d="M0 0h16v16H0z" /></clipPath></defs></svg>;
const ForwardRef = forwardRef(scribe);
export default ForwardRef;