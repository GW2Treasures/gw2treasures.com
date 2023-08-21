import * as React from "react";
import { forwardRef } from "react";
const locale = (props, ref) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 16" ref={ref} {...props}><circle cx={7.5} cy={7.5} r={7} stroke="currentColor" /><path stroke="currentColor" d="M10.5 7.5c0 2.015-.382 3.815-.978 5.092C8.907 13.91 8.157 14.5 7.5 14.5c-.657 0-1.407-.59-2.022-1.908C4.882 11.315 4.5 9.515 4.5 7.5c0-2.015.382-3.815.978-5.092C6.093 1.09 6.843.5 7.5.5c.657 0 1.407.59 2.022 1.908.596 1.277.978 3.077.978 5.092ZM1 5.5h13m-13 4h13" /></svg>;
const ForwardRef = forwardRef(locale);
export default ForwardRef;