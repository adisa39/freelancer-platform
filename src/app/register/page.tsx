import InterlinkAuth from '@/components/auth/InterlinkAuth';
import { GuestOnly } from '@/context/AuthContext';

export default function RegisterPage() {
  return <GuestOnly><InterlinkAuth mode="register" /></GuestOnly>;
}
