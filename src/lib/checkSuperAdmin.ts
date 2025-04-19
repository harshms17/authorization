import jwt from 'jsonwebtoken';

export async function checkSuperAdmin(request: Request): Promise<boolean> {
  try {
    const token = request.headers.get('token');
    if (!token) return false;

    const data = jwt.verify(token, process.env.JWT_SECRET as string) as {
      id: string;
      pass: string;
    };

    if (
      data.id !== process.env.SUPER_ADMIN_ID ||
      data.pass !== process.env.SUPER_ADMIN_PASSWORD
    ) {
      return false;
    }

    return true;
  } catch (error: unknown) {
    console.error('checkSuperAdmin error:', (error as Error).message);
    return false;
  }
}
