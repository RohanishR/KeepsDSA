import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import SettingsClient from './SettingsClient';
import dbConnect from '@/lib/dbConnect';
import { User } from '@/models/User';

export const metadata = {
  title: 'Settings - KeepsDSA',
};

export default async function SettingsPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect('/login');
  }

  await dbConnect();
  
  // Also generates a username if one is missing
  let user = await User.findById(session.user.id).select('username privacySettings email name image').lean();
  
  if (!user) {
    redirect('/login');
  }

  if (!user.username) {
    const baseUsername = user.email.split('@')[0].replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
    const randomSuffix = Math.floor(Math.random() * 10000);
    const generatedUsername = `${baseUsername}${randomSuffix}`;
    
    await User.findByIdAndUpdate(session.user.id, { username: generatedUsername });
    user.username = generatedUsername;
  }

  const initialData = {
    name: user.name,
    email: user.email,
    image: user.image,
    username: user.username,
    privacySettings: user.privacySettings || {
      isProfilePublic: false,
      showStats: true,
      showSolutions: true,
      showNotes: true,
    }
  };

  return <SettingsClient initialData={JSON.parse(JSON.stringify(initialData))} />;
}
