import React, { useEffect } from "react";
import Layout from "@/components/layout";
import { useState } from "react";
import { dbService, storageService, authService } from "@/firebase";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";
import { doc, setDoc, addDoc, collection } from "firebase/firestore";
import { BsPlusLg, BsFillXCircleFill } from "react-icons/bs";
import { useRouter } from "next/router";

const Post = () => {
  const router = useRouter();

  const [form, setForm] = useState<Form>({
    userId: authService.currentUser?.uid as string,
    img: [""],
    title: "",
    type: "",
    ingredient: "",
    recipe: "",
    text: "",
    like: [],
    view: 0,
  });

  const [imgFile_01, setImgFile_01] = useState<File | null>();
  const [imgFile_02, setImgFile_02] = useState<File | null>();
  const [imgFile_03, setImgFile_03] = useState<File | null>();

  const [preview_01, setPreview_01] = useState<string | null>();
  const [preview_02, setPreview_02] = useState<string | null>();
  const [preview_03, setPreview_03] = useState<string | null>();

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
  const onChangeImg_01 = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files !== null) {
      const file = event.target.files[0];
      if (file && file.type.substring(0, 5) === "image") {
        setImgFile_01(file);
      }
    }
  };
  const onChangeImg_02 = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files !== null) {
      const file = event.target.files[0];
      if (file && file.type.substring(0, 5) === "image") {
        setImgFile_02(file);
      }
    }
  };
  const onChangeImg_03 = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files !== null) {
      const file = event.target.files[0];
      if (file && file.type.substring(0, 5) === "image") {
        setImgFile_03(file);
      }
    }
  };

  const onSubmit = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    let imgFileUrl = "";
    let preview = [preview_01, preview_02, preview_03];
    let newPreview = preview.filter((view) => view != null);
    let savePreview: any = [];

    if (newPreview !== null) {
      let downloadPreview = await Promise.allSettled(
        newPreview?.map(async (view) => {
          const previewRef = ref(storageService, `post/${uuidv4()}`);
          await uploadString(previewRef, view as string, "data_url");
          imgFileUrl = await getDownloadURL(previewRef);
          return imgFileUrl;
        })
      );

      downloadPreview.forEach((item: any) => savePreview.push(item.value));
      let newForm = {
        ...form,
        img: savePreview,
      };
      console.log("newForm", newForm);

      await addDoc(collection(dbService, "Posts"), newForm);

      router.push("/");
    }
  };

  useEffect(() => {
    if (imgFile_01) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview_01(reader.result as string);
      };
      reader.readAsDataURL(imgFile_01);
    } else {
      setPreview_01(null);
    }
  }, [imgFile_01]);

  useEffect(() => {
    if (imgFile_02) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview_02(reader.result as string);
      };
      reader.readAsDataURL(imgFile_02);
    } else {
      setPreview_02(null);
    }
  }, [imgFile_02]);

  useEffect(() => {
    if (imgFile_03) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview_03(reader.result as string);
      };
      reader.readAsDataURL(imgFile_03);
    } else {
      setPreview_03(null);
    }
  }, [imgFile_03]);

  return (
    <Layout>
      <div className="w-full h-screen flex justify-center">
        <form className="w-[588px] flex flex-col">
          <div className="flex gap-3">
            <div className="font-bold text-[20px] mt-5">사진</div>
            <div className="text-[12px] mt-7">최대 3장까지 업로드 가능</div>
          </div>
          <div className="flex w-full mt-[18px] gap-[10px] justify-center">
            <div className="w-[186px] aspect-square bg-[#f2f2f2] flex justify-center items-center overflow-hidden">
              {preview_01 === null ? (
                <label className="w-12 h-12 bg-[#f2f2f2] flex justify-center items-center absolute">
                  <input
                    name="img"
                    type="file"
                    accept="image/*"
                    onChange={onChangeImg_01}
                    className="hidden"
                  />
                  <BsPlusLg className="scale-[2] text-[#b7b7b7] hover:scale-[2.2]" />
                </label>
              ) : (
                <>
                  <label className="w-[186px] aspect-square bg-transparent flex p-2 justify-end absolute">
                    <BsFillXCircleFill
                      onClick={() => {
                        setImgFile_01(null);
                      }}
                      className=" text-[#666666] scale-150 bg-white rounded-full hover:scale-[1.6] box-border"
                    />
                  </label>
                  <img
                    src={preview_01 as string}
                    className="w-[186px] aspect-square object-cover"
                  />
                </>
              )}
            </div>
            <div className="flex flex-col gap-[10px]">
              <div className="w-[88px] aspect-square bg-[#f2f2f2] flex justify-center items-center overflow-hidden">
                {preview_02 === null ? (
                  <label className="w-12 h-12 bg-[#f2f2f2] flex justify-center items-center absolute">
                    <input
                      name="img"
                      type="file"
                      accept="image/*"
                      onChange={onChangeImg_02}
                      className="hidden"
                    />
                    <BsPlusLg className="scale-[2] text-[#b7b7b7] hover:scale-[2.2]" />
                  </label>
                ) : (
                  <>
                    <label className="w-[88px] aspect-square bg-transparent flex p-2 justify-end absolute">
                      <BsFillXCircleFill
                        onClick={() => {
                          setImgFile_02(null);
                        }}
                        className=" text-[#666666] scale-150 bg-white rounded-full hover:scale-[1.6] box-border"
                      />
                    </label>
                    <img
                      src={preview_02 as string}
                      className="w-[88px] aspect-square object-cover"
                    />
                  </>
                )}
              </div>
              <div className="w-[88px] aspect-square bg-[#f2f2f2] flex justify-center items-center overflow-hidden">
                {preview_03 === null ? (
                  <label className="w-12 h-12 bg-[#f2f2f2] flex justify-center items-center absolute">
                    <input
                      name="img"
                      type="file"
                      accept="image/*"
                      onChange={onChangeImg_03}
                      className="hidden"
                    />
                    <BsPlusLg className="scale-[2] text-[#b7b7b7] hover:scale-[2.2]" />
                  </label>
                ) : (
                  <>
                    <label className="w-[88px] aspect-square bg-transparent flex p-2 justify-end absolute">
                      <BsFillXCircleFill
                        onClick={() => {
                          setImgFile_03(null);
                        }}
                        className=" text-[#666666] scale-150 bg-white rounded-full hover:scale-[1.6] box-border"
                      />
                    </label>
                    <img
                      src={preview_03 as string}
                      className="w-[88px] aspect-square object-cover"
                    />
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="font-bold text-[20px] my-5">제목</div>
          <input
            name="title"
            value={form.title}
            onChange={onChangeValue}
            placeholder="커피칵테일"
            className="w-full"
          />

          <div className="w-full border-[1px] border-[#d9d9d9] mt-[10px]" />

          <div className="font-bold text-[20px] my-5">소개</div>
          <textarea
            className="h-7 resize-none overflow-hidden"
            name="text"
            value={form.text}
            onChange={onChangeValue}
            placeholder="Lorem lpsum is simply dummy text..."
          />

          <div className="w-full border-[1px] border-[#d9d9d9] mt-2" />
          <div className="flex gap-7">
            <div className="font-bold text-[20px] my-5">카테고리</div>
            <div className="flex  gap-5 my-5 text-[#9e9e9e]">
              <label className="w-20 h-8  rounded-[16px]">
                <input
                  type="radio"
                  name="type"
                  value="소주"
                  onChange={onChangeValue}
                  className="hidden peer"
                />
                <span className="w-full h-full bg-[#ededed] border-2 rounded-[16px] flex items-center justify-center text-center peer-checked:bg-[#909090] peer-checked:text-white peer-checked:border-[#5a5a5a] peer-checked:rounded-[16px]]">
                  소주
                </span>
              </label>
              <label className="w-20 h-8  rounded-[16px]">
                <input
                  type="radio"
                  name="type"
                  value="맥주"
                  onChange={onChangeValue}
                  className="hidden peer"
                />
                <span className="w-full h-full bg-[#ededed] border-2 rounded-[16px] flex items-center justify-center text-center peer-checked:bg-[#909090] peer-checked:text-white peer-checked:border-[#5a5a5a] peer-checked:rounded-[16px]]">
                  맥주
                </span>
              </label>
              <label className="w-20 h-8  rounded-[16px]">
                <input
                  type="radio"
                  name="type"
                  value="양주"
                  onChange={onChangeValue}
                  className="hidden peer"
                />
                <span className="w-full h-full bg-[#ededed] border-2 rounded-[16px] flex items-center justify-center text-center peer-checked:bg-[#909090] peer-checked:text-white peer-checked:border-[#5a5a5a] peer-checked:rounded-[16px]]">
                  양주
                </span>
              </label>
              <label className="w-20 h-8 rounded-[16px]">
                <input
                  type="radio"
                  name="type"
                  value="Etc"
                  onChange={onChangeValue}
                  className="hidden peer"
                />
                <span className="w-full h-full bg-[#ededed] border-2 rounded-[16px] flex items-center justify-center text-center peer-checked:bg-[#909090] peer-checked:text-white peer-checked:border-[#5a5a5a] peer-checked:rounded-[16px]]">
                  Etc
                </span>
              </label>
            </div>
          </div>

          <div className="w-full border-[1px] border-[#d9d9d9]" />

          <div className="font-bold text-[20px] my-5">재료</div>
          <textarea
            className="h-7 resize-none overflow-hidden"
            name="ingredient"
            value={form.ingredient}
            onChange={onChangeValue}
            placeholder="ex) 소주잔/소주/크랜베리주스/오렌지주스"
          />
          <div className="w-full border-[1px] border-[#d9d9d9] mt-2" />

          <div className="font-bold text-[20px] my-5">만드는 방법</div>

          <textarea
            className="h-24 resize-none overflow-hidden"
            name="recipe"
            value={form.recipe}
            onChange={onChangeValue}
            placeholder="1. Lorem Ipsum is simply dummy text of the..."
          />
          <div className="w-full flex justify-center items-center">
            <button onClick={onSubmit} className="bg-[#ff6161] w-[280px] h-12">
              작성
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default Post;

// 모바일 css 적용

{
  /* <Layout>
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
      <label className="w-full h-[200px] bg-transparent flex justify-end p-5 pr-9 items-start absolute">
        <AiOutlineClose
          onClick={onClickCancelImg}
          className=" text-black p-[2px] bg-white rounded-full hover:scale-[2.2] box-border"
        />
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
</Layout> */
}
