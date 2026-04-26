import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function getAuthenticatedUserId() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return null;
  }
  return (session.user as any).id as string;
}
