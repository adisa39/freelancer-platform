import InterlinkAuth from '@/components/auth/InterlinkAuth';
import { GuestOnly } from '@/context/AuthContext';

export default function LoginPage() {
  return <GuestOnly><InterlinkAuth mode="login" /></GuestOnly>;
}
