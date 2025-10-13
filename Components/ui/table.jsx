export function Table({ children, className = '', ...props }) { return <table className={`w-full caption-bottom text-sm ${className}`} {...props}>{children}</table> }
export function TableHeader({ children, className = '', ...props }) { return <thead className={`[&_tr]:border-b ${className}`} {...props}>{children}</thead> }
export function TableBody({ children, className = '', ...props }) { return <tbody className={`divide-y divide-gray-100 ${className}`} {...props}>{children}</tbody> }
export function TableRow({ children, className = '', ...props }) { return <tr className={`hover:bg-gray-50 ${className}`} {...props}>{children}</tr> }
export function TableHead({ children, className = '', ...props }) { return <th className={`h-10 px-4 text-left align-middle font-medium text-gray-500 ${className}`} {...props}>{children}</th> }
export function TableCell({ children, className = '', ...props }) { return <td className={`p-4 align-middle ${className}`} {...props}>{children}</td> }

export default { Table, TableHeader, TableBody, TableRow, TableHead, TableCell }
