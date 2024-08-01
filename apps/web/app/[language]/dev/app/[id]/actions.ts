'use server';
import { getUser } from '@/lib/getUser';
import { db } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { getLoginUrlWithReturnTo } from '@/lib/login-url';
import { type FormState } from '@gw2treasures/ui/components/Form/Form';
import { revalidatePath } from 'next/cache';

export async function deleteApplication(id: string) {
  const user = await getUser();

  if(!user) {
    redirect(getLoginUrlWithReturnTo());
  }

  await db.application.deleteMany({ where: { id, ownerId: user.id }});

  redirect('/dev#applications');
}

export async function saveApplication(id: string, prev: FormState, data: FormData): Promise<FormState> {
  const user = await getUser();

  if(!user) {
    redirect(getLoginUrlWithReturnTo());
  }

  const name = data.get('name');

  if(!name || typeof name !== 'string') {
    return { error: 'Invalid name' };
  }

  await db.application.update({
    where: { id },
    data: { name }
  });

  revalidatePath(`/dev/app/${id}`);
  return { success: 'Application saved' };
}

export async function updateOrigins(id: string, prev: FormState, data: FormData): Promise<FormState> {
  const user = await getUser();

  if(!user) {
    redirect(getLoginUrlWithReturnTo());
  }

  const application = await db.application.findUnique({ where: { id }, select: { origins: true }});

  if(!application) {
    return { error: 'Application not found' };
  }

  const origin = data.get('origin');
  const originToDelete = data.get('delete');

  const hasNewOrigin = origin !== null && typeof origin === 'string';
  const hasDeleteOrigin = originToDelete !== null && typeof originToDelete === 'string';

  if(!hasNewOrigin && !hasDeleteOrigin) {
    return { error: 'Bad request' };
  }

  if(hasDeleteOrigin) {
    const updatedOrigins = application.origins.filter((origin) => origin !== originToDelete);

    if(updatedOrigins.length === application.origins.length) {
      return { error: 'Origin to delete not found' };
    }

    await db.application.update({
      where: { id },
      data: { origins: updatedOrigins }
    });
  } else if(hasNewOrigin) {
    let url;
    try {
      url = new URL(origin);
    } catch {
      return { error: 'Wrong format. Please provide the origin format <schema>://<domain>(:<port>)' };
    }

    const formattedOrigin = url.origin;

    if(application.origins.includes(formattedOrigin)) {
      return { error: 'Duplicate origin' };
    }

    await db.application.update({
      where: { id },
      data: { origins: { push: formattedOrigin }}
    });
  }

  revalidatePath(`/dev/app/${id}`);
  return { success: 'Application saved' };
}
