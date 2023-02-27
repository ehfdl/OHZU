import React, { useCallback, useEffect } from "react";
import Layout from "@/components/layout";
import { useState } from "react";
import { dbService, storageService, authService } from "@/firebase";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";
import { addDoc, collection } from "firebase/firestore";
import { BsPlusLg, BsFillXCircleFill } from "react-icons/bs";
import { Router, useRouter } from "next/router";
import Mmodal from "@/components/mmodal";

const Post = () => {
  const router = useRouter();
  const date = new Date();
  const dateForm = new Intl.DateTimeFormat("ko-KR", {
    dateStyle: "long",
    timeStyle: "medium",
  }).format(date);
  const initialForm = {
    userId: authService.currentUser?.uid as string,
    img: [""],
    title: "",
    type: "",
    ingredient: [""],
    recipe: "",
    text: "",
    like: [],
    createdAt: dateForm,
    view: 0,
  };

  const [form, setForm] = useState<WriteForm>(initialForm);
  const [ingre, setIngre] = useState({
    ing_01: "",
    ing_02: "",
    ing_03: "",
    ing_04: "",
    ing_05: "",
    ing_06: "",
  });

  const [plusIng, setPlusIng] = useState(false);

  const [validateTitle, setValidateTitle] = useState("");
  const [validateIntro, setValidateIntro] = useState("");
  const [validateCate, setValidateCate] = useState("");
  const [validateIng, setValidateIng] = useState("최대 6개까지 작성 가능");
  const [validateRecipe, setValidateRecipe] = useState("");

  const [imgFile_01, setImgFile_01] = useState<File | null>();
  const [imgFile_02, setImgFile_02] = useState<File | null>();
  const [imgFile_03, setImgFile_03] = useState<File | null>();

  const [preview_01, setPreview_01] = useState<string | null>();
  const [preview_02, setPreview_02] = useState<string | null>();
  const [preview_03, setPreview_03] = useState<string | null>();

  const [changeForm, setChangeForm] = useState(false);
  const [toUrl, setToUrl] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [openmmodal, setopenMmodal] = useState(false);

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
  const onChangeIngre = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setIngre((prev) => {
      return { ...prev, [name]: value };
    });
  };
  const onChangePlusIngre = () => {
    if (ingre.ing_01 !== "" && ingre.ing_02 !== "" && ingre.ing_03 !== "") {
      setPlusIng(true);
    } else {
      setValidateIng("준비물를 입력해주세요.");
    }
  };

  const validateChangePost = () => {
    if (form.title!.length > 10) {
      setValidateTitle("이름을 10자 이하로 입력해 주세요.");
    } else if (form.title!.length <= 10) {
      setValidateTitle("");
    }
    if (form.text !== "") {
      setValidateIntro("");
    }
    if (form.type !== "") {
      setValidateCate("");
    }

    if (form.recipe !== "") {
      setValidateRecipe("");
    }
  };
  const validateChangeIng = () => {
    if (
      ingre.ing_01!.length > 8 ||
      ingre.ing_02!.length > 8 ||
      ingre.ing_03!.length > 8 ||
      ingre.ing_04!.length > 8 ||
      ingre.ing_05!.length > 8 ||
      ingre.ing_06!.length > 8
    ) {
      setValidateIng("준비물를 8자 이하로 입력해 주세요.");
    }
    if (
      ingre.ing_01!.length <= 8 &&
      ingre.ing_02!.length <= 8 &&
      ingre.ing_03!.length <= 8 &&
      ingre.ing_04!.length <= 8 &&
      ingre.ing_05!.length <= 8 &&
      ingre.ing_06!.length <= 8
    ) {
      setValidateIng("");
    }
  };

  const validateClickPost = () => {
    if (form.title === "" || form.title!.length > 10) {
      setValidateTitle("이름을 10자 이하로 입력해 주세요.");
      return true;
    } else if (form.text === "") {
      setValidateIntro("소개를 입력해주세요");
      return true;
    } else if (form.type === "") {
      setValidateCate("카테고리 한 개를 선택해주세요.");
      return true;
    } else if (
      ingre.ing_01!.length > 8 ||
      ingre.ing_02!.length > 8 ||
      ingre.ing_03!.length > 8 ||
      ingre.ing_04!.length > 8 ||
      ingre.ing_05!.length > 8 ||
      ingre.ing_06!.length > 8
    ) {
      setValidateIng("준비물를 8자 이하로 입력해 주세요.");
      return true;
    } else if (
      ingre.ing_01 === "" &&
      ingre.ing_02 === "" &&
      ingre.ing_03 === "" &&
      ingre.ing_04 === "" &&
      ingre.ing_05 === "" &&
      ingre.ing_06 === ""
    ) {
      setValidateIng("준비물를 한가지 이상 입력해주세요.");
      return true;
    } else if (form.recipe === "") {
      setValidateRecipe("방법을 입력해주세요.");
      return true;
    }
  };

  const handleBeforeunload = (e: BeforeUnloadEvent) => {
    if (changeForm) {
      e.preventDefault();
      e.returnValue = "";

      return "";
    }
    return undefined;
  };

  const routeChangeStart = useCallback(
    (url: string) => {
      if (
        router.asPath.split("?")[0] !== url.split("?")[0] &&
        !confirmed &&
        changeForm
      ) {
        setToUrl(url);
        setopenMmodal(true);
        router.events.emit("routeChangeError");
        throw "Abort route change. Please ignore this error.";
      }
    },
    [confirmed, changeForm, router.asPath, router.events, openmmodal]
  );

  useEffect(() => {
    window.addEventListener("beforeunload", handleBeforeunload);
    router.events.on("routeChangeStart", routeChangeStart);
    if (router.asPath !== window.location.pathname) {
      window.history.pushState("", "", router.asPath);
    }
    return () => {
      window.removeEventListener("beforeunload", handleBeforeunload);
      router.events.off("routeChangeStart", routeChangeStart);
    };
  }, [routeChangeStart, router.events]);

  useEffect(() => {
    if (confirmed) {
      setopenMmodal(false);
      router.replace(toUrl);
    }
  }, [toUrl, confirmed]);

  useEffect(() => {
    validateChangePost();
  }, [form]);

  useEffect(() => {
    validateChangeIng();
  }, [ingre]);

  useEffect(() => {
    if (
      form.title === "" &&
      form.text === "" &&
      form.recipe === "" &&
      preview_01 === null &&
      preview_02 === null &&
      preview_03 === null &&
      ingre.ing_01 === "" &&
      ingre.ing_02 === "" &&
      ingre.ing_03 === "" &&
      ingre.ing_04 === "" &&
      ingre.ing_05 === "" &&
      ingre.ing_06 === ""
    ) {
      setChangeForm(false);
    } else {
      setChangeForm(true);
    }
  }, [form, ingre, preview_01, preview_02, preview_03]);

  const onSubmit = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    let totalIngre = [
      ingre.ing_01,
      ingre.ing_02,
      ingre.ing_03,
      ingre.ing_04,
      ingre.ing_05,
      ingre.ing_06,
    ];
    let filterIngre = totalIngre.filter((ing) => ing !== "");

    if (validateClickPost()) {
      return;
    }
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

      if (savePreview.length === 0) {
        if (form.type === "소주") {
          savePreview = [
            "https://mblogthumb-phinf.pstatic.net/MjAxODAxMDhfMTI0/MDAxNTE1MzM4MzgyOTgw.JGPYfKZh1Zq15968iGm6eAepu5T4x-9LEAq_0aRSPSsg.vlICAPGyOq_JDoJWSj4iVuh9SHA6wYbLFBK8oQRE8xAg.JPEG.aflashofhope/%EC%86%8C%EC%A3%BC.jpg?type=w800",
          ];
        } else if (form.type === "맥주") {
          savePreview = [
            "https://steptohealth.co.kr/wp-content/uploads/2016/08/9-benefits-from-drinking-beer-in-moderation.jpg?auto=webp&quality=45&width=1920&crop=16:9,smart,safe",
          ];
        } else if (form.type === "양주") {
          savePreview = [
            "http://i.fltcdn.net/contents/3285/original_1475799965087_vijbl1k0529.jpeg",
          ];
        } else if (form.type === "기타") {
          savePreview = [
            "https://t1.daumcdn.net/cfile/tistory/1526D4524E0160C330",
          ];
        }

        let newForm = {
          ...form,
          img: savePreview,
          ingredient: filterIngre,
        };

        await addDoc(collection(dbService, "Posts"), newForm);
        setConfirmed(true);
        router.push("/");
      } else {
        let newForm = {
          ...form,
          img: savePreview,
          ingredient: filterIngre,
        };

        await addDoc(collection(dbService, "Posts"), newForm);
        setConfirmed(true);
        router.push("/");
      }
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
      <div className="w-full flex justify-center">
        <form className="w-[588px] flex flex-col">
          <div className="flex gap-3">
            <div className="font-bold text-[20px] mt-5">사진</div>
            <div className="text-[12px] text-textGray mt-7">
              최대 3장까지 업로드 가능
            </div>
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
                  <BsPlusLg className="scale-[2] text-[#b7b7b7] hover:scale-[2.2] cursor-pointer" />
                </label>
              ) : (
                <>
                  <label className="w-[186px] aspect-square bg-transparent flex p-2 justify-end absolute">
                    <BsFillXCircleFill
                      onClick={() => {
                        setImgFile_01(null);
                      }}
                      className=" text-iconHover scale-150 bg-white rounded-full hover:scale-[1.6] box-border cursor-pointer"
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
                    <BsPlusLg className="scale-[2] text-[#b7b7b7] hover:scale-[2.2] cursor-pointer" />
                  </label>
                ) : (
                  <>
                    <label className="w-[88px] aspect-square bg-transparent flex p-2 justify-end absolute">
                      <BsFillXCircleFill
                        onClick={() => {
                          setImgFile_02(null);
                        }}
                        className=" text-iconHover scale-150 bg-white rounded-full hover:scale-[1.6] box-border cursor-pointer"
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
                    <BsPlusLg className="scale-[2] text-[#b7b7b7] hover:scale-[2.2] cursor-pointer" />
                  </label>
                ) : (
                  <>
                    <label className="w-[88px] aspect-square bg-transparent flex p-2 justify-end absolute">
                      <BsFillXCircleFill
                        onClick={() => {
                          setImgFile_03(null);
                        }}
                        className=" text-iconHover scale-150 bg-white rounded-full hover:scale-[1.6] box-border cursor-pointer"
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
          <div className=" my-5">
            <span className="font-bold text-[20px]">이름</span>
            <span className="ml-2 text-sm text-[red]  w-full">
              {validateTitle}
            </span>
          </div>
          <input
            name="title"
            value={form.title}
            onChange={onChangeValue}
            placeholder="이름을 작성해주세요."
            className="w-full"
          />

          <div className="w-full border-[1px] border-[#d9d9d9] mt-[10px]" />

          <div className=" my-5">
            <span className="font-bold text-[20px]">소개</span>
            <span className="ml-2 text-sm text-[red]  w-full">
              {validateIntro}
            </span>
          </div>
          <textarea
            className="h-[118px] border-[1px] border-iconDefault py-3 px-3 rounded resize-none overflow-hidden"
            name="text"
            value={form.text}
            onChange={onChangeValue}
            placeholder="간단한 소개글을 작성하세요."
          />

          <div className="mt-6">
            <span className="font-bold text-[20px]">카테고리</span>
            <span className="ml-2 text-sm text-[red]  w-full">
              {validateCate}
            </span>
          </div>
          <div className="flex w-full justify-center gap-6 my-4 text-[#9e9e9e]">
            <label className="w-20 h-8 cursor-pointer rounded-[16px]">
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
            <label className="w-20 h-8 cursor-pointer rounded-[16px]">
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
            <label className="w-20 h-8 cursor-pointer rounded-[16px]">
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
            <label className="w-20 h-8 cursor-pointer rounded-[16px]">
              <input
                type="radio"
                name="type"
                value="기타"
                onChange={onChangeValue}
                className="hidden peer"
              />
              <span className="w-full h-full bg-[#ededed] border-2 rounded-[16px] flex items-center justify-center text-center peer-checked:bg-[#909090] peer-checked:text-white peer-checked:border-[#5a5a5a] peer-checked:rounded-[16px]]">
                기타
              </span>
            </label>
          </div>

          <div className="w-full border-[1px] border-[#d9d9d9]" />

          <div className=" my-5">
            <span className="font-bold text-[20px]">준비물</span>

            {validateIng === "최대 6개까지 작성 가능" ? (
              <span className="ml-2 text-sm text-textGray  w-full">
                {validateIng}
              </span>
            ) : (
              <span className="ml-2 text-sm text-[red]  w-full">
                {validateIng}
              </span>
            )}
          </div>
          <div className="flex justify-between">
            <input
              className="border-b-[1.5px] border-[#d9d9d9] px-1 py-[6px]"
              name="ing_01"
              value={ingre.ing_01}
              onChange={onChangeIngre}
              placeholder="준비물 1"
            />
            <input
              className="border-b-[1.5px] border-[#d9d9d9] px-1 py-[6px]"
              name="ing_02"
              value={ingre.ing_02}
              onChange={onChangeIngre}
              placeholder="준비물 2"
            />
            <input
              className="border-b-[1.5px] border-[#d9d9d9] px-1 py-[6px]"
              name="ing_03"
              value={ingre.ing_03}
              onChange={onChangeIngre}
              placeholder="준비물 3"
            />
          </div>
          {plusIng ? (
            <div className="flex justify-between mt-5">
              <input
                className="border-b-[1.5px] border-[#d9d9d9] px-1 py-[6px]"
                name="ing_04"
                value={ingre.ing_04}
                onChange={onChangeIngre}
                placeholder="준비물 4"
              />
              <input
                className="border-b-[1.5px] border-[#d9d9d9] px-1 py-[6px]"
                name="ing_05"
                value={ingre.ing_05}
                onChange={onChangeIngre}
                placeholder="준비물 5"
              />
              <input
                className="border-b-[1.5px] border-[#d9d9d9] px-1 py-[6px]"
                name="ing_06"
                value={ingre.ing_06}
                onChange={onChangeIngre}
                placeholder="준비물 6"
              />
            </div>
          ) : (
            <div
              onClick={onChangePlusIngre}
              className="my-5 ml-1 text-[14px] text-phGray flex justify-start items-center gap-2 cursor-pointer w-[92px]"
            >
              <BsPlusLg className="mb-[3px]" />더 추가하기
            </div>
          )}

          <div className=" my-5">
            <span className="font-bold text-[20px]">만드는 방법</span>
            <span className="ml-2 text-sm text-[red]  w-full">
              {validateRecipe}
            </span>
          </div>
          <textarea
            className="h-[170px] px-3 py-3 border-[1.5px] border-iconDefault rounded resize-none overflow-hidden"
            name="recipe"
            value={form.recipe}
            onChange={onChangeValue}
            placeholder="1. Lorem Ipsum is simply dummy text of the..."
          />
          <div className="w-full flex justify-center items-center">
            <button
              onClick={onSubmit}
              className=" mt-8 mb-20 text-white bg-primary w-[280px] h-12 rounded"
            >
              등록하기
            </button>
          </div>
        </form>
      </div>
      {openmmodal ? (
        <Mmodal setConfirmed={setConfirmed} setopenMmodal={setopenMmodal} />
      ) : null}
    </Layout>
  );
};

export default Post;
