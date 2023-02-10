import React, { useEffect } from "react";
import Layout from "@/components/layout";
import { useState } from "react";
import { dbService, storageService } from "@/firebase";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";
import { doc, setDoc, addDoc, collection } from "firebase/firestore";
import { AiFillCamera } from "react-icons/ai";

const Post = () => {
  const [form, setForm] = useState<Form>({
    userId: "",
    img: "",
    title: "",
    type: "",
    ingredient: "",
    recipe: "",
    text: "",
    like: [],
    liked: [],
    view: 0,
  });
  const [imgFile, setImgFile] = useState<File | null>();
  const [preview, setPreview] = useState<string | null>("");

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
        setImgFile(file);
      } else {
        setImgFile(null);
      }
    }
  };

  const onSubmit = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    let imgFileUrl = "";
    if (preview !== "") {
      const previewRef = ref(storageService, `user/${uuidv4()}`);
      await uploadString(previewRef, preview as string, "data_url");
      imgFileUrl = await getDownloadURL(previewRef);
      const newForm = {
        ...form,
        img: imgFileUrl,
      };
      await addDoc(collection(dbService, "Posts"), newForm);
      // await setDoc(doc(dbService, "Posts", `${user.id}:${uuidv4}`), form);
    }
  };

  useEffect(() => {
    if (imgFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(imgFile);
    } else {
      setPreview(null);
    }
  }, [imgFile]);

  return (
    <Layout>
      <form className="flex flex-col justify-center items-center bg-slate-400 p-5">
        <div className="w-full h-[200px] bg-slate-100 flex justify-center items-center overflow-hidden">
          {preview === null ? (
            <label className="w-[50px] h-[50px] bg-slate-200 flex justify-center items-center absolute">
              <input
                name="img"
                type="file"
                accept="image/*"
                onChange={onChangeImg}
                className="hidden"
              />
              <AiFillCamera className="scale-[2] text-slate-400 hover:scale-[2.2]" />
            </label>
          ) : (
            <label className="w-full h-[200px] bg-transparent flex justify-end p-5 pr-9 items-end absolute">
              <input
                name="img"
                type="file"
                accept="image/*"
                onChange={onChangeImg}
                className="hidden"
              />
              <AiFillCamera className="scale-[2] text-slate-400 opacity-30 hover:scale-[2.2]" />
            </label>
          )}
          <img src={preview as string} className=" object-cover" />
        </div>

        <div className="mt-3 bg-slate-300 w-full">
          <div>제목</div>
          <input name="title" value={form.title} onChange={onChangeValue} />
        </div>

        <div className="flex bg-slate-300 mt-2 p-2 w-[90%] justify-around">
          <label className="w-[60px] h-[50px] p-1 bg-slate-300">
            <input
              type="radio"
              name="type"
              value="소주"
              onChange={onChangeValue}
              className="hidden peer"
            />
            <span className="w-full h-full bg-white rounded-md flex items-center justify-center text-center peer-checked:bg-slate-500 peer-checked:rounded-md">
              소주
            </span>
          </label>
          <label className="w-[60px] h-[50px] p-1 bg-slate-300">
            <input
              type="radio"
              name="type"
              value="맥주"
              onChange={onChangeValue}
              className="hidden peer"
            />
            <span className="w-full h-full bg-white rounded-md flex items-center justify-center text-center peer-checked:bg-slate-500 peer-checked:rounded-md">
              맥주
            </span>
          </label>
          <label className="w-[60px] h-[50px] p-1 bg-slate-300">
            <input
              type="radio"
              name="type"
              value="양주"
              onChange={onChangeValue}
              className="hidden peer"
            />
            <span className="w-full h-full bg-white rounded-md flex items-center justify-center text-center peer-checked:bg-slate-500 peer-checked:rounded-md">
              양주
            </span>
          </label>
          <label className="w-[60px] h-[50px] p-1 bg-slate-300">
            <input
              type="radio"
              name="type"
              value="Etc"
              onChange={onChangeValue}
              className="hidden peer"
            />
            <span className="w-full h-full bg-white rounded-md flex items-center justify-center text-center peer-checked:bg-slate-500 peer-checked:rounded-md">
              Etc
            </span>
          </label>
        </div>

        <div>재료</div>
        <textarea
          name="ingredient"
          value={form.ingredient}
          onChange={onChangeValue}
        />
        <div>만드는 방법</div>
        <textarea name="recipe" value={form.recipe} onChange={onChangeValue} />
        <div>내용</div>
        <textarea
          className="flex min-h-[200px]"
          name="text"
          value={form.text}
          onChange={onChangeValue}
        />
        <div className="w-full flex justify-end items-center">
          <button onClick={onSubmit} className="bg-white p-2">
            작성
          </button>
        </div>
      </form>
    </Layout>
  );
};

export default Post;
