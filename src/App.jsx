import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState, useEffect } from "react";

// Validation schema
const schema = z.object({
  name: z.string().nonempty("Name is required"),
  email: z.string().email("Invalid email format"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  houseName: z.string().optional(),
  address: z.string().optional(),
  facebookUsername: z.string().optional(),
  instagramUsername: z.string().optional(),
  toggleSocial: z.boolean(),
}).refine(data => {
  // Validate that at least one of houseName or address is filled
  return data.houseName || data.address || (data.toggleSocial && data.facebookUsername);
}, {
  message: "You must provide either a house name or address, or a Facebook username if toggle is on",
  path: ["facebookUsername"],
});

// Component
const App = () => {
  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors, isSubmitting, isValid },
    watch,
  } = useForm({
    defaultValues: {
      email: "test@email.com",
      toggleSocial: false,
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

  // Watch for toggle state
  const toggleSocial = watch("toggleSocial");

  // Determine if the submit button should be enabled
  const isSubmitDisabled = isSubmitting || !isValid || 
    (!(watch("houseName") || watch("address"))) ||
    (toggleSocial && !watch("facebookUsername"));

  // Determine button color
  const buttonClass = isSubmitDisabled ? "bg-red-500 cursor-not-allowed" : "bg-green-500 hover:bg-green-600";
  console.log("sdkjhf");
  return (
    <form
      className="flex flex-col gap-2 p-6 bg-white border border-gray-200 rounded-md shadow-md"
      onSubmit={handleSubmit(onSubmit)}
    >
      <input
        {...register("name")}
        type="text"
        placeholder="Name"
        className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      {errors.name && <div className="text-red-500 text-sm">{errors.name.message}</div>}

      <input
        {...register("email")}
        type="text"
        placeholder="Email"
        className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      {errors.email && <div className="text-red-500 text-sm">{errors.email.message}</div>}

      <input
        {...register("password")}
        type="password"
        placeholder="Password"
        className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      {errors.password && <div className="text-red-500 text-sm">{errors.password.message}</div>}

      <input
        {...register("houseName")}
        type="text"
        placeholder="House Name"
        className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      
      <input
        {...register("address")}
        type="text"
        placeholder="Address"
        className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <div className="flex items-center">
        <input
          type="checkbox"
          {...register("toggleSocial")}
          className="mr-2"
        />
        <label>Use social handles</label>
      </div>

      {toggleSocial && (
        <>
          <input
            {...register("facebookUsername", { required: toggleSocial })}
            type="text"
            placeholder="Facebook Username"
            className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.facebookUsername && (
            <div className="text-red-500 text-sm">{errors.facebookUsername.message}</div>
          )}
          
          <input
            {...register("instagramUsername")}
            type="text"
            placeholder="Instagram Username"
            className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </>
      )}

      <button
        type="submit"
        disabled={isSubmitDisabled}
        className={`p-2 rounded text-white ${buttonClass}`}
      >
        {isSubmitting ? "Loading..." : "Submit"}
      </button>

      {errors.toggleSocial && (
        <div className="text-red-500 text-sm">{errors.toggleSocial.message}</div>
      )}
    </form>
  );
};

export default App;
