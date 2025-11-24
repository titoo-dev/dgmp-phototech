import { getProfileAction } from "@/actions/user/update-profile-action";
import { getSessionAction } from "@/actions/get-session";
import { ProfileForm } from "@/components/profile/profile-form";
import { redirect } from "next/navigation";
import { Container } from "@/components/container/container";
import { AuthUser } from "@/lib/auth-utils";

export const dynamic = 'force-dynamic';

export default async function ProfilePage() {
  const { user } = await getSessionAction();

  if (!user) {
    return redirect('/auth/signin');
  }

  const result = await getProfileAction();

  if (!result.success || !result.data) {
    return (
      <Container>
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold text-red-600 mb-2">
            Erreur lors du chargement du profil
          </h2>
          <p className="text-muted-foreground">
            {result.error || "Une erreur est survenue"}
          </p>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div className="flex justify-center mt-8">
        <div className="w-full max-w-2xl space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Mon Profil</h1>
            <p className="text-muted-foreground">
              Gérez vos informations personnelles et paramètres de compte
            </p>
          </div>

          <ProfileForm user={result.data as AuthUser} />
        </div>
      </div>
    </Container>
  );
}
