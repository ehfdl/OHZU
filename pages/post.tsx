import React, { useEffect } from "react";
import Layout from "@/components/layout";
import { useState } from "react";
import { Form } from "@/d";
const Post = () => {
  const [form, setForm] = useState<Form>({
    userId: "",
    img: "",
    title: "",
    type: "",
    ingredient: "",
    receipe: "",
    text: "",
    like: [],
    view: 0,
  });

  const [preview, setPreview] = useState<File | null>();

  const onChangeValue = (
    event:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setForm((prev) => {
      return { ...prev, [name]: value };
    });
  };
  const onChangeImg = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files !== null) {
      const file = event.target.files[0];
      if (file && file.type.substring(0, 5) === "image") {
        setPreview(file);
      } else {
        setPreview(null);
      }
    }
  };

  useEffect(() => {
    if (preview) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm((prev) => {
          return { ...prev, img: reader.result as string };
        });
      };
      reader.readAsDataURL(preview);
    } else {
      setForm((prev) => {
        return { ...prev, img: null };
      });
    }
  }, [preview]);

  console.log(form);

  return (
    <Layout>
      <form className="flex flex-col justify-center items-center bg-slate-400 p-5">
        <label className="w-full h-[200px] bg-slate-100">
          <input
            name="img"
            type="file"
            accept="image/*"
            onChange={onChangeImg}
            className="hidden"
          />
          <img src={form.img as string} />
        </label>

        <div className="mt-3 bg-slate-300 w-full">
          <div>제목</div>
          <input name="title" value={form.title} onChange={onChangeValue} />
        </div>
        <div className="flex bg-white mt-2 gap-2 p-3 w-[90%] justify-around">
          <label className="w-30 p-2 bg-slate-500">
            <input
              type="radio"
              name="type"
              value="소주"
              onChange={onChangeValue}
              className="hidden"
            />
            소주
          </label>
          <label className="w-30 p-2 bg-slate-500">
            <input
              type="radio"
              name="type"
              value="맥주"
              onChange={onChangeValue}
              className="hidden"
            />
            맥주
          </label>
          <label className="w-30 p-2 bg-slate-500">
            <input
              type="radio"
              name="type"
              value="양주"
              onChange={onChangeValue}
              className="hidden"
            />
            양주
          </label>
          <label className="w-30 p-2 bg-slate-500">
            <input
              type="radio"
              name="type"
              value="Etc"
              onChange={onChangeValue}
              className="hidden"
            />
            Etc
          </label>
        </div>
        <div>ingredient</div>
        <textarea
          name="ingredient"
          value={form.ingredient}
          onChange={onChangeValue}
        />
        <div>Receipe</div>
        <textarea
          name="receipe"
          value={form.receipe}
          onChange={onChangeValue}
        />
        <div>내용</div>
        <textarea
          className="flex min-h-[200px]"
          name="text"
          value={form.text}
          onChange={onChangeValue}
        />
        <div className="w-full flex justify-end items-center">
          <button className="bg-white p-2">작성</button>
        </div>
      </form>
    </Layout>
  );
};

export default Post;
