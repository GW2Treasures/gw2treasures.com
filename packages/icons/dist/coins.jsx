import * as React from "react";
import { forwardRef } from "react";
const coins = (props, ref) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 16" ref={ref} {...props}><path stroke="currentColor" d="M13.5 5.5c0 1.105-2.239 2-5 2s-5-.895-5-2m10 0c0-1.105-2.239-2-5-2s-5 .895-5 2m10 0v2m-10-2v2m10 0c0 1.105-2.239 2-5 2s-5-.895-5-2m10 0v2m-10-2v2m10 0c0 1.105-2.239 2-5 2s-5-.895-5-2m10 0v2c0 1.105-2.239 2-5 2s-5-.895-5-2v-2" /></svg>;
const ForwardRef = forwardRef(coins);
export default ForwardRef;