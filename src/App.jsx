import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

const App = () => {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      email: "test@email.com",
    },
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log(data);
    } catch (error) {
      setError("root", {
        message: "This email is already taken",
      });
    }
  };

  return (
    <form
      className="flex flex-col gap-2 p-6 bg-white border border-gray-200 rounded-md shadow-md"
      onSubmit={handleSubmit(onSubmit)}
    >
      <input
        {...register("email")}
        type="text"
        placeholder="Email"
        className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      {errors.email && (
        <div className="text-red-500 text-sm">{errors.email.message}</div>
      )}

      <input
        {...register("password")}
        type="password"
        placeholder="Password"
        className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      {errors.password && (
        <div className="text-red-500 text-sm">{errors.password.message}</div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className={`p-2 rounded bg-blue-500 text-white ${
          isSubmitting ? "bg-blue-400 cursor-not-allowed" : "hover:bg-blue-600"
        }`}
      >
        {isSubmitting ? "Loading..." : "Submit"}
      </button>

      {errors.root && (
        <div className="text-red-500 text-sm">{errors.root.message}</div>
      )}
    </form>
  );
};

export default App;
