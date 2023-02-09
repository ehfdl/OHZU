import React from "react";

const useForm = () => {
  return <div></div>;
};

export default useForm;

// import { useState } from "react";
// import { useMutation } from "react-query";
// import { addTodo } from "../api";
// import { Form } from "../d";

// const useForm = (initialState: Form): any => {
//   const [form, setForm] = useState(initialState);

//   const onChangeValue = (event: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = event.target;
//     setForm((prev) => {
//       return { ...prev, [name]: value };
//     });
//   };

//   const { mutate: mutateAdd } = useMutation<void, unknown, Form, unknown>(
//     ["addTodo", form],
//     (form) => addTodo(form),
//     {
//       onSuccess: () => {
//         console.log("추가성공");
//       },
//       onError: (err) => {
//         console.log("err in add:", err);
//       },
//     }
//   );

//   const onSubmitValue = async (event: React.FormEvent<HTMLFormElement>) => {
//     // event.preventDefault();
//     // mutateAdd(form);
//     setForm({
//       title: "",
//       text: "",
//       isDone: false,
//     });
//   };

//   return [form, onChangeValue, onSubmitValue];
// };

// export default useForm;
