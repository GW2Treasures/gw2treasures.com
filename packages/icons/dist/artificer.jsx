import * as React from "react";
import { forwardRef } from "react";
const artificer = (props, ref) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 16" ref={ref} {...props}><circle cx={8} cy={5} r={4.5} stroke="currentColor" /><path stroke="currentColor" d="M4 7.5H2.748c-.356 0-.596.363-.422.674a6.517 6.517 0 0 0 3.792 3.05.527.527 0 0 1 .382.498V13a.5.5 0 0 1-.5.5A1.5 1.5 0 0 0 4.5 15a.5.5 0 0 0 .5.5h6a.5.5 0 0 0 .5-.5 1.5 1.5 0 0 0-1.5-1.5.5.5 0 0 1-.5-.5v-1.278c0-.232.16-.432.382-.499a6.517 6.517 0 0 0 3.792-3.049c.174-.311-.066-.674-.422-.674H12" /></svg>;
const ForwardRef = forwardRef(artificer);
export default ForwardRef;