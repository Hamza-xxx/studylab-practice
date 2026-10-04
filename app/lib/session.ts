export type CurrentUser = {
  id: string;
  name: string;
};

export async function getCurrentUser(): Promise<CurrentUser> {
  return {
    id: "demo-learner",
    name: "Demo learner",
  };
}