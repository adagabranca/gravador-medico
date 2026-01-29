export type AdminUser = {
  id: string;
  email?: string;
  name?: string;
  role?: string;
  has_access?: boolean;
};

export async function fetchAdminUser(): Promise<AdminUser | null> {
  try {
    const response = await fetch('/api/auth/me', { credentials: 'include' });
    if (!response.ok) return null;
    const data = await response.json();
    return data?.user || null;
  } catch (error) {
    console.error('Erro ao buscar usuário admin:', error);
    return null;
  }
}
