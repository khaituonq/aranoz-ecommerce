import { Alert } from 'react-bootstrap';

export default function MessageBox({variant, children}) {
  return <Alert variant={variant || 'info'}>{children}</Alert>;
}