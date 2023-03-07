import React, { useCallback, useEffect } from "react";
import Layout from "@/components/layout";
import { useState } from "react";
import { storageService, authService } from "@/firebase";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";
import { BsPlusLg, BsFillXCircleFill } from "react-icons/bs";
import { useRouter } from "next/router";
import Image from "next/image";
import useModal from "@/hooks/useModal";
import { BEER_IMG, ETC_IMG, LIQUOR_IMG, SOJU_IMG } from "@/util";
import useCreatePost from "@/hooks/query/post/useCreatePost";

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
  const { showModal, hideModal } = useModal();

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
        if (router.asPath !== window.location.pathname) {
          window.history.pushState("", "", router.asPath);
        }
        setToUrl(url);
        showModal({
          modalType: "ConfirmModal",
          modalProps: {
            title: "페이지를 이동하시겠습니까?",
            text: "변경사항이 저장되지 않을 수 있습니다.",
            leftbtnfunc: () => {
              setToUrl("");
              hideModal();
            },
            rightbtnfunc: () => setConfirmed(true),
          },
        });

        router.events.emit("routeChangeError");
        throw "Abort route change. Please ignore this error.";
      }
    },
    [confirmed, changeForm, router.asPath, router.events]
  );
  useEffect(() => {
    window.addEventListener("beforeunload", handleBeforeunload);
    router.events.on("routeChangeStart", routeChangeStart);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeunload);
      router.events.off("routeChangeStart", routeChangeStart);
    };
  }, [routeChangeStart, router.events]);

  useEffect(() => {
    if (confirmed) {
      hideModal();
      if (toUrl !== "") {
        router.replace(toUrl);
      } else {
        router.push("/");
      }
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

  const { isLoading: isLoadingAddComment, mutate: createPost } =
    useCreatePost();

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
          savePreview = [SOJU_IMG];
        } else if (form.type === "맥주") {
          savePreview = [BEER_IMG];
        } else if (form.type === "양주") {
          savePreview = [LIQUOR_IMG];
        } else if (form.type === "기타") {
          savePreview = [ETC_IMG];
        }

        let newForm = {
          ...form,
          img: savePreview,
          ingredient: filterIngre,
        };

        createPost(newForm);
        setConfirmed(true);
        // router.push("/");
      } else {
        let newForm = {
          ...form,
          img: savePreview,
          ingredient: filterIngre,
        };
        createPost(newForm);
        setConfirmed(true);
        // router.push("/");
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
        <form className="w-[352px] sm:w-[588px] flex flex-col">
          <div className="flex gap-3">
            <div className="font-bold sm:text-[20px] mt-5">사진</div>
            <div className="text-[12px] text-textGray mt-6 sm:mt-7">
              최대 3장까지 업로드 가능
            </div>
          </div>
          <div className="flex w-full mt-3 sm:mt-[18px] gap-4 sm:gap-[10px] justify-center">
            <div className="w-[72px] sm:w-[186px] aspect-square bg-[#f2f2f2] flex justify-center items-center overflow-hidden">
              {preview_01 === null ? (
                <label className="w-10 sm:w-12 aspect-square bg-[#f2f2f2] flex justify-center items-center absolute">
                  <input
                    name="img"
                    type="file"
                    accept="image/*"
                    onChange={onChangeImg_01}
                    className="hidden"
                  />
                  <BsPlusLg className="scale-[1.8] sm:scale-[2] text-[#b7b7b7] hover:scale-[2] sm:hover:scale-[2.2] cursor-pointer" />
                </label>
              ) : (
                <>
                  <label className="w-[72px] sm:w-[186px] aspect-square bg-transparent flex p-2 justify-end absolute">
                    <BsFillXCircleFill
                      onClick={() => {
                        setImgFile_01(null);
                      }}
                      className="text-iconHover scale-100 sm:scale-150 bg-white rounded-full hover:scale-110 sm:hover:scale-[1.6] box-border cursor-pointer"
                    />
                  </label>
                  {preview_01 && (
                    <Image
                      src={preview_01 as string}
                      className="w-[72px] sm:w-[186px] aspect-square object-cover border-[1px] border-borderGray"
                      width={186}
                      height={186}
                      alt=""
                    />
                  )}
                </>
              )}
            </div>
            <div className="flex sm:flex-col gap-4 sm:gap-[10px]">
              <div className="w-[72px] sm:w-[88px] aspect-square bg-[#f2f2f2] flex justify-center items-center overflow-hidden">
                {preview_02 === null ? (
                  <label className="w-10 sm:w-12 aspect-square bg-[#f2f2f2] flex justify-center items-center absolute">
                    <input
                      name="img"
                      type="file"
                      accept="image/*"
                      onChange={onChangeImg_02}
                      className="hidden"
                    />
                    <BsPlusLg className="scale-[1.8] sm:scale-[2] text-[#b7b7b7] hover:scale-[2] sm:hover:scale-[2.2] cursor-pointer" />
                  </label>
                ) : (
                  <>
                    <label className="w-[72px] sm:w-[88px] aspect-square bg-transparent flex p-2 justify-end absolute">
                      <BsFillXCircleFill
                        onClick={() => {
                          setImgFile_02(null);
                        }}
                        className="text-iconHover scale-100 sm:scale-150 bg-white rounded-full hover:scale-110 sm:hover:scale-[1.6] box-border cursor-pointer"
                      />
                    </label>
                    {preview_02 && (
                      <Image
                        src={preview_02 as string}
                        className="w-[72px] sm:w-[186px] aspect-square object-cover border-[1px] border-borderGray"
                        width={186}
                        height={186}
                        alt=""
                      />
                    )}
                  </>
                )}
              </div>
              <div className="w-[72px] sm:w-[88px] aspect-square bg-[#f2f2f2] flex justify-center items-center overflow-hidden">
                {preview_03 === null ? (
                  <label className="w-10 sm:w-12 aspect-square bg-[#f2f2f2] flex justify-center items-center absolute">
                    <input
                      name="img"
                      type="file"
                      accept="image/*"
                      onChange={onChangeImg_03}
                      className="hidden"
                    />
                    <BsPlusLg className="scale-[1.8] sm:scale-[2] text-[#b7b7b7] hover:scale-[2] sm:hover:scale-[2.2] cursor-pointer" />
                  </label>
                ) : (
                  <>
                    <label className="w-[72px] sm:w-[88px] aspect-square bg-transparent flex p-2 justify-end absolute">
                      <BsFillXCircleFill
                        onClick={() => {
                          setImgFile_03(null);
                        }}
                        className="text-iconHover scale-100 sm:scale-150 bg-white rounded-full hover:scale-110 sm:hover:scale-[1.6] box-border cursor-pointer"
                      />
                    </label>
                    {preview_03 && (
                      <Image
                        src={preview_03 as string}
                        className="w-[72px] sm:w-[186px] aspect-square object-cover border-[1px] border-borderGray"
                        width={186}
                        height={186}
                        alt=""
                      />
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
          <div className=" my-5">
            <span className="font-bold sm:text-[20px]">이름</span>
            <span className="ml-2 text-[11px] sm:text-sm text-[red]  w-full">
              {validateTitle}
            </span>
          </div>
          <input
            name="title"
            value={form.title}
            onChange={onChangeValue}
            placeholder="이름을 작성해주세요."
            className="w-full text-[14px] sm:text-base"
          />

          <div className="w-full border-b-[1px] border-[#d9d9d9] mt-2 sm:mt-[10px]" />

          <div className=" my-5">
            <span className="font-bold sm:text-[20px]">소개</span>
            <span className="ml-2 text-[11px] sm:text-sm text-[red]  w-full">
              {validateIntro}
            </span>
          </div>
          <textarea
            className="h-20 sm:h-[118px] text-[14px] sm:text-base border-[1px] border-iconDefault py-3 px-3 rounded scrollbar-none resize-none focus-visible:outline-none"
            name="text"
            value={form.text}
            onChange={onChangeValue}
            placeholder="간단한 소개글을 작성하세요."
          />

          <div className="mt-6">
            <span className="font-bold sm:text-[20px]">카테고리</span>
            <span className="ml-2 text-[11px] sm:text-sm text-[red]  w-full">
              {validateCate}
            </span>
          </div>
          <div className="flex w-full justify-center gap-6 my-4 text-[11px] sm:text-[14px] text-[#9e9e9e]">
            <label className="w-[53px] h-[23px] sm:w-20 sm:h-8 cursor-pointer rounded-[16px]">
              <input
                type="radio"
                name="type"
                value="소주"
                onChange={onChangeValue}
                className="hidden peer"
              />
              <span className="w-full h-full bg-[#ededed] border-[1px] rounded-[16px] flex items-center justify-center text-center peer-checked:bg-[#909090] peer-checked:text-white peer-checked:border-[#5a5a5a] peer-checked:rounded-[16px]]">
                소주
              </span>
            </label>
            <label className="w-[53px] h-[23px] sm:w-20 sm:h-8 cursor-pointer rounded-[16px]">
              <input
                type="radio"
                name="type"
                value="맥주"
                onChange={onChangeValue}
                className="hidden peer"
              />
              <span className="w-full h-full bg-[#ededed] border-[1px] rounded-[16px] flex items-center justify-center text-center peer-checked:bg-[#909090] peer-checked:text-white peer-checked:border-[#5a5a5a] peer-checked:rounded-[16px]]">
                맥주
              </span>
            </label>
            <label className="w-[53px] h-[23px] sm:w-20 sm:h-8 cursor-pointer rounded-[16px]">
              <input
                type="radio"
                name="type"
                value="양주"
                onChange={onChangeValue}
                className="hidden peer"
              />
              <span className="w-full h-full bg-[#ededed] border-[1px] rounded-[16px] flex items-center justify-center text-center peer-checked:bg-[#909090] peer-checked:text-white peer-checked:border-[#5a5a5a] peer-checked:rounded-[16px]]">
                양주
              </span>
            </label>
            <label className="w-[53px] h-[23px] sm:w-20 sm:h-8 cursor-pointer rounded-[16px]">
              <input
                type="radio"
                name="type"
                value="기타"
                onChange={onChangeValue}
                className="hidden peer"
              />
              <span className="w-full h-full bg-[#ededed] border-[1px] rounded-[16px] flex items-center justify-center text-center peer-checked:bg-[#909090] peer-checked:text-white peer-checked:border-[#5a5a5a] peer-checked:rounded-[16px]]">
                기타
              </span>
            </label>
          </div>

          <div className="w-full border-b-[1px] border-[#d9d9d9]" />

          <div className=" my-5">
            <span className="font-bold sm:text-[20px]">준비물</span>

            {validateIng === "최대 6개까지 작성 가능" ? (
              <span className="ml-2 text-[11px] sm:text-sm text-textGray  w-full">
                {validateIng}
              </span>
            ) : (
              <span className="ml-2 text-[11px] sm:text-sm text-[red]  w-full">
                {validateIng}
              </span>
            )}
          </div>
          <div className="grid grid-cols-2 gap-[18px] sm:grid-cols-3 sm:gap-[38px] text-[14px] sm:text-base">
            <input
              className="border-b-[1px] border-[#d9d9d9] px-1 py-[6px]"
              name="ing_01"
              value={ingre.ing_01}
              onChange={onChangeIngre}
              placeholder="준비물 1"
            />
            <input
              className="border-b-[1px] border-[#d9d9d9] px-1 py-[6px]"
              name="ing_02"
              value={ingre.ing_02}
              onChange={onChangeIngre}
              placeholder="준비물 2"
            />
            <input
              className="border-b-[1px] border-[#d9d9d9] px-1 py-[6px]"
              name="ing_03"
              value={ingre.ing_03}
              onChange={onChangeIngre}
              placeholder="준비물 3"
            />

            {plusIng ? (
              <>
                <input
                  className="border-b-[1px] border-[#d9d9d9] px-1 py-[6px]"
                  name="ing_04"
                  value={ingre.ing_04}
                  onChange={onChangeIngre}
                  placeholder="준비물 4"
                />
                <input
                  className="border-b-[1px] border-[#d9d9d9] px-1 py-[6px]"
                  name="ing_05"
                  value={ingre.ing_05}
                  onChange={onChangeIngre}
                  placeholder="준비물 5"
                />
                <input
                  className="border-b-[1px] border-[#d9d9d9] px-1 py-[6px]"
                  name="ing_06"
                  value={ingre.ing_06}
                  onChange={onChangeIngre}
                  placeholder="준비물 6"
                />
              </>
            ) : null}
          </div>
          {plusIng ? null : (
            <div
              onClick={onChangePlusIngre}
              className="my-5 ml-1 text-[12px] sm:text-sm text-phGray flex justify-start items-center gap-2 cursor-pointer w-[92px]"
            >
              <BsPlusLg className="mb-[1px]" />더 추가하기
            </div>
          )}

          <div className="my-5">
            <span className="font-bold sm:text-[20px]">만드는 방법</span>
            <span className="ml-2 text-[11px] sm:text-sm text-[red]  w-full">
              {validateRecipe}
            </span>
          </div>
          <textarea
            className="h-28 sm:h-[170px] text-[14px] sm:text-base px-3 py-3 border-[1px] border-iconDefault rounded scrollbar-none resize-none focus-visible:outline-none"
            name="recipe"
            value={form.recipe}
            onChange={onChangeValue}
            placeholder="1. Lorem Ipsum is simply dummy text of the..."
          />
          <div className="w-full flex justify-center items-center">
            <button
              aria-label="submit"
              onClick={onSubmit}
              className=" mt-8 mb-20 text-white bg-primary w-[344px] sm:w-[280px] h-14 sm:h-12 rounded"
            >
              등록하기
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default Post;
