import {UpdateProblem} from "@/app/problems/[problem_id]/edit/actions";
import {ProblemForm} from "@/components/ProblemsPage/ProblemForm";
import {getProblem, uploadProblem as uploadProblemAction,} from "@/lib/actions";
import {Metadata} from "next";
import {notFound} from "next/navigation";

type Props = {
  params: Promise<{ problem_id: string }>;
};

export const generateMetadata = async (props: Props): Promise<Metadata> => {
  const { problem_id } = await props.params;
  const response = await getProblem(problem_id);

  if (!response) {
    return {
      title: "Задача не найдена",
    };
  }

  const problem = response.problem;

  return {
    title: `Редактирование ${problem.title}`,
    description: "",
  };
};

const Page = async (props: Props) => {
  const { problem_id } = await props.params;
  const response = await getProblem(problem_id);

  if (!response) {
    notFound();
  }

  const onUploadFn = async (id: string, data: FormData) => {
    "use server";

    const file = data.get("file");
    if (!file || !(file instanceof File)) {
      throw new Error("Invalid file");
    }

    try {
        return await uploadProblemAction(id, file);
    } catch (error) {
      console.error("Failed to upload problem:", error);
      throw error;
    }
  };

  const problem = response.problem;

  return (
    <ProblemForm
      problem={problem}
      onSubmitFn={UpdateProblem}
      onUploadFn={onUploadFn}
    />
  );
};

export { Page as default };
