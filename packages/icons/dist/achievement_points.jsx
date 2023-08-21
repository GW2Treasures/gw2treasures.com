import * as React from "react";
import { forwardRef } from "react";
const achievement_points = (props, ref) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 16" ref={ref} {...props}><g clipPath="url(#a)"><path fill="#F6A510" d="M15.5 8a7.5 7.5 0 1 1-15 0 7.5 7.5 0 0 1 15 0Z" /><path fill="#000" d="M3 11V9c3-1.5 7-2 10-2v4h-2V9.5a1 1 0 1 0-2 0V11H7v-1a1 1 0 0 0-2 0v1H3Zm0-3c3-1.5 7-2 10-2V4.5c-.629 0-1.302.022-2 .07v.5a29.06 29.06 0 0 0-2 .209v-.5c-.664.092-1.336.21-2 .358v.5c-.679.15-1.35.332-2 .547v-.5A15.13 15.13 0 0 0 3 6.5V8Z" /></g><defs><clipPath id="a"><path fill="#fff" d="M0 0h16v16H0z" /></clipPath></defs></svg>;
const ForwardRef = forwardRef(achievement_points);
export default ForwardRef;