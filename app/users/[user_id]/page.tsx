import { DefaultLayout } from "@/components/Layout";
import { Profile } from "@/components/Profile";
import { getUser } from "@/lib/actions";
import { isValidUUIDV4 } from "@/lib/lib";
import { Metadata } from "next";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "Профиль пользователя",
};

type Props = {
  params: Promise<{ user_id: string }>;
};

const Page = async ({ params }: Props) => {
  const resolvedParams = await params;
  const user_id = resolvedParams.user_id;

  if (!user_id || !isValidUUIDV4(user_id)) {
    notFound();
  }

  const userData = await getUser(user_id);

  if (!userData) {
    notFound();
  }

  return (
    <DefaultLayout>
      <Profile username={userData.user.username} userId={user_id} />
    </DefaultLayout>
  );
};

export default Page;
