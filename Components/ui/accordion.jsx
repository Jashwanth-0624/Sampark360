export function Accordion({ children }) { return <div>{children}</div> }
export function AccordionItem({ children }) { return <div>{children}</div> }
export function AccordionTrigger({ children, ...props }) { return <button {...props}>{children}</button> }
export function AccordionContent({ children }) { return <div>{children}</div> }

export default { Accordion, AccordionItem, AccordionTrigger, AccordionContent }
