import Layout from "@/components/layout";
import { dbService, storageService } from "@/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadString,
} from "firebase/storage";
import { GetServerSideProps } from "next";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { BsFillXCircleFill, BsPlusLg } from "react-icons/bs";
import { v4 as uuidv4 } from "uuid";

interface ParamsPropsType {
  id: string;
  post: Form;
}
const EditDetail = ({ id, post }: ParamsPropsType) => {
  const router = useRouter();

  const [editPost, setEditPost] = useState<Form>(post);

  const [editImgFile_01, setEditImgFile_01] = useState<File | null>();
  const [editImgFile_02, setEditImgFile_02] = useState<File | null>();
  const [editImgFile_03, setEditImgFile_03] = useState<File | null>();

  const [editPreview_01, setEditPreview_01] = useState<string | null>();
  const [editPreview_02, setEditPreview_02] = useState<string | null>();
  const [editPreview_03, setEditPreview_03] = useState<string | null>();

  const [editIng, setEditIng] = useState({
    editIng_01: "",
    editIng_02: "",
    editIng_03: "",
    editIng_04: "",
    editIng_05: "",
    editIng_06: "",
  });

  const [editPlusIng, setEditPlusIng] = useState(false);

  const [validateTitle, setValidateTitle] = useState("");
  const [validateIntro, setValidateIntro] = useState("");
  const [validateCate, setValidateCate] = useState("");
  const [validateIng, setValidateIng] = useState("최대 6개까지 작성 가능");
  const [validateRecipe, setValidateRecipe] = useState("");

  const onChangeValue = (
    event:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;

    setEditPost((prev) => {
      return { ...prev, [name]: value };
    });
  };

  const onChangeImg_01 = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files !== null) {
      const file = event.target.files[0];
      if (file && file.type.substring(0, 5) === "image") {
        setEditImgFile_01(file);
      }
    }
  };
  const onChangeImg_02 = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files !== null) {
      const file = event.target.files[0];
      if (file && file.type.substring(0, 5) === "image") {
        setEditImgFile_02(file);
      }
    }
  };
  const onChangeImg_03 = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files !== null) {
      const file = event.target.files[0];
      if (file && file.type.substring(0, 5) === "image") {
        setEditImgFile_03(file);
      }
    }
  };

  const onChangeIngre = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setEditIng((prev) => {
      return { ...prev, [name]: value };
    });
  };

  const onChangePlusIngre = () => {
    if (
      editIng.editIng_01 !== "" &&
      editIng.editIng_02 !== "" &&
      editIng.editIng_03 !== ""
    ) {
      setEditPlusIng(true);
    } else {
      setValidateIng("준비물를 입력해주세요.");
    }
  };

  const validateChangePost = () => {
    if (editPost.title!.length > 10) {
      setValidateTitle("이름을 10자 이하로 입력해 주세요.");
    } else if (editPost.title!.length <= 10) {
      setValidateTitle("");
    }
    if (editPost.text !== "") {
      setValidateIntro("");
    }
    if (editPost.type !== "") {
      setValidateCate("");
    }

    if (editPost.recipe !== "") {
      setValidateRecipe("");
    }
  };

  const validateChangeIng = () => {
    if (
      editIng.editIng_01!.length > 8 ||
      editIng.editIng_02!.length > 8 ||
      editIng.editIng_03!.length > 8 ||
      editIng.editIng_04!.length > 8 ||
      editIng.editIng_05!.length > 8 ||
      editIng.editIng_06!.length > 8
    ) {
      setValidateIng("준비물를 8자 이하로 입력해 주세요.");
    }
    if (
      editIng.editIng_01!.length <= 8 &&
      editIng.editIng_02!.length <= 8 &&
      editIng.editIng_03!.length <= 8 &&
      editIng.editIng_04!.length <= 8 &&
      editIng.editIng_05!.length <= 8 &&
      editIng.editIng_06!.length <= 8
    ) {
      setValidateIng("");
    }
  };

  const validateClickPost = () => {
    if (editPost.title === "" || editPost.title!.length > 10) {
      setValidateTitle("이름을 10자 이하로 입력해 주세요.");
      return true;
    } else if (editPost.text === "") {
      setValidateIntro("소개를 입력해주세요");
      return true;
    } else if (editPost.type === "") {
      setValidateCate("카테고리 한 개를 선택해주세요.");
      return true;
    } else if (
      editIng.editIng_01!.length > 8 ||
      editIng.editIng_02!.length > 8 ||
      editIng.editIng_03!.length > 8 ||
      editIng.editIng_04!.length > 8 ||
      editIng.editIng_05!.length > 8 ||
      editIng.editIng_06!.length > 8
    ) {
      setValidateIng("준비물를 8자 이하로 입력해 주세요.");
      return true;
    } else if (
      editIng.editIng_01 === "" &&
      editIng.editIng_02 === "" &&
      editIng.editIng_03 === "" &&
      editIng.editIng_04 === "" &&
      editIng.editIng_05 === "" &&
      editIng.editIng_06 === ""
    ) {
      setValidateIng("준비물를 한가지 이상 입력해주세요.");
      return true;
    } else if (editPost.recipe === "") {
      setValidateRecipe("방법을 입력해주세요.");
      return true;
    }
  };

  useEffect(() => {
    validateChangePost();
  }, [editPost]);

  useEffect(() => {
    validateChangeIng();
  }, [editIng]);

  const onSubmit = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    let totalIngre = [
      editIng.editIng_01,
      editIng.editIng_02,
      editIng.editIng_03,
      editIng.editIng_04,
      editIng.editIng_05,
      editIng.editIng_06,
    ];

    let filterIngre = totalIngre.filter((ing) => ing !== "");

    if (validateClickPost()) {
      return;
    }

    let imgFileUrl = "";
    let editPreview = [editPreview_01, editPreview_02, editPreview_03];
    // let newEditPreview = editPreview.filter((view) => view != null);
    let savePreview: any = [...editPost.img!];

    if (editPreview.length !== 0) {
      let downloadPreview = await Promise.allSettled(
        editPreview?.map(async (view, i) => {
          if (view !== null && view !== undefined) {
            const editPreviewRef = ref(storageService, `post/${uuidv4()}`);
            await uploadString(editPreviewRef, view as string, "data_url");
            imgFileUrl = await getDownloadURL(editPreviewRef);
            return imgFileUrl;
          }
        })
      );

      // downloadPreview

      downloadPreview.forEach((item: any, i) => {
        if (
          item.value !== savePreview[i] &&
          item.status !== "rejected" &&
          savePreview[i] !== null &&
          savePreview[i] !== undefined
        ) {
          if (
            savePreview[i] !==
              "https://mblogthumb-phinf.pstatic.net/MjAxODAxMDhfMTI0/MDAxNTE1MzM4MzgyOTgw.JGPYfKZh1Zq15968iGm6eAepu5T4x-9LEAq_0aRSPSsg.vlICAPGyOq_JDoJWSj4iVuh9SHA6wYbLFBK8oQRE8xAg.JPEG.aflashofhope/%EC%86%8C%EC%A3%BC.jpg?type=w800" &&
            savePreview[i] !==
              "https://steptohealth.co.kr/wp-content/uploads/2016/08/9-benefits-from-drinking-beer-in-moderation.jpg?auto=webp&quality=45&width=1920&crop=16:9,smart,safe" &&
            savePreview[i] !==
              "http://i.fltcdn.net/contents/3285/original_1475799965087_vijbl1k0529.jpeg" &&
            savePreview[i] !==
              "https://t1.daumcdn.net/cfile/tistory/1526D4524E0160C330"
          ) {
            const imgId = savePreview[i].split("2F")[1].split("?")[0];
            const desertRef = ref(storageService, `post/${imgId}`);
            deleteObject(desertRef)
              .then(() => {
                console.log("success", imgId);
                // File deleted successfully
              })
              .catch((error) => {
                console.log("error", error, imgId);
                // Uh-oh, an error occurred!
              });
          }
          savePreview[i] = item.value;
        } else if (
          item.value !== null &&
          item.value !== undefined &&
          item.value !== savePreview[i]
        ) {
          savePreview[i] = item.value;
        } else if (
          (savePreview.includes(
            "https://mblogthumb-phinf.pstatic.net/MjAxODAxMDhfMTI0/MDAxNTE1MzM4MzgyOTgw.JGPYfKZh1Zq15968iGm6eAepu5T4x-9LEAq_0aRSPSsg.vlICAPGyOq_JDoJWSj4iVuh9SHA6wYbLFBK8oQRE8xAg.JPEG.aflashofhope/%EC%86%8C%EC%A3%BC.jpg?type=w800"
          ) ||
            savePreview.includes(
              "https://steptohealth.co.kr/wp-content/uploads/2016/08/9-benefits-from-drinking-beer-in-moderation.jpg?auto=webp&quality=45&width=1920&crop=16:9,smart,safe"
            ) ||
            savePreview.includes(
              "http://i.fltcdn.net/contents/3285/original_1475799965087_vijbl1k0529.jpeg"
            ) ||
            savePreview.includes(
              "https://t1.daumcdn.net/cfile/tistory/1526D4524E0160C330"
            ) ||
            savePreview.filter((i: any) => i === undefined).length ===
              savePreview.length) &&
          downloadPreview.filter((i: any) => i.value === undefined).length ===
            downloadPreview.length
        ) {
          if (editPost.type === "소주") {
            savePreview[0] =
              "https://mblogthumb-phinf.pstatic.net/MjAxODAxMDhfMTI0/MDAxNTE1MzM4MzgyOTgw.JGPYfKZh1Zq15968iGm6eAepu5T4x-9LEAq_0aRSPSsg.vlICAPGyOq_JDoJWSj4iVuh9SHA6wYbLFBK8oQRE8xAg.JPEG.aflashofhope/%EC%86%8C%EC%A3%BC.jpg?type=w800";
          } else if (editPost.type === "맥주") {
            savePreview[0] =
              "https://steptohealth.co.kr/wp-content/uploads/2016/08/9-benefits-from-drinking-beer-in-moderation.jpg?auto=webp&quality=45&width=1920&crop=16:9,smart,safe";
          } else if (editPost.type === "양주") {
            savePreview[0] =
              "http://i.fltcdn.net/contents/3285/original_1475799965087_vijbl1k0529.jpeg";
          } else if (editPost.type === "기타") {
            savePreview[0] =
              "https://t1.daumcdn.net/cfile/tistory/1526D4524E0160C330";
          }
        } else {
          return savePreview[i];
        }
      });

      const newPreview = savePreview.filter(
        (i: any) => i !== null && i !== undefined
      );

      let newEditPost = {
        ...editPost,
        img: newPreview,
        ingredient: filterIngre,
      };

      await updateDoc(doc(dbService, "Posts", id), newEditPost);
    } else {
      await updateDoc(doc(dbService, "Posts", id), editPost as any);
    }
    router.push(`/post/${id}`);
  };

  useEffect(() => {
    if (editImgFile_01) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditPreview_01(reader.result as string);
      };
      reader.readAsDataURL(editImgFile_01);
    } else {
      setEditPreview_01(null);
    }
  }, [editImgFile_01]);

  useEffect(() => {
    if (editImgFile_02) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditPreview_02(reader.result as string);
      };
      reader.readAsDataURL(editImgFile_02);
    } else {
      setEditPreview_02(null);
    }
  }, [editImgFile_02]);

  useEffect(() => {
    if (editImgFile_03) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditPreview_03(reader.result as string);
      };
      reader.readAsDataURL(editImgFile_03);
    } else {
      setEditPreview_03(null);
    }
  }, [editImgFile_03]);

  useEffect(() => {
    if (editPost.img![0]) {
      setEditPreview_01(editPost.img![0]);
    } else {
      setEditPreview_01(null);
    }
    if (editPost.img![1]) {
      setEditPreview_02(editPost.img![1]);
    } else {
      setEditPreview_02(null);
    }
    if (editPost.img![2]) {
      setEditPreview_03(editPost.img![2]);
    } else {
      setEditPreview_03(null);
    }

    if (editPost.ingredient![0]) {
      setEditIng((prev) => {
        return { ...prev, editIng_01: editPost.ingredient![0] };
      });
    }
    if (editPost.ingredient![1]) {
      setEditIng((prev) => {
        return { ...prev, editIng_02: editPost.ingredient![1] };
      });
    }
    if (editPost.ingredient![2]) {
      setEditIng((prev) => {
        return { ...prev, editIng_03: editPost.ingredient![2] };
      });
    }
    if (editPost.ingredient![3]) {
      setEditIng((prev) => {
        return { ...prev, editIng_04: editPost.ingredient![3] };
      });
    }
    if (editPost.ingredient![4]) {
      setEditIng((prev) => {
        return { ...prev, editIng_05: editPost.ingredient![4] };
      });
    }
    if (editPost.ingredient![5]) {
      setEditIng((prev) => {
        return { ...prev, editIng_06: editPost.ingredient![5] };
      });
    }

    if (editPost.ingredient?.length! > 3) {
      setEditPlusIng(true);
    }
  }, []);

  return (
    <Layout>
      <div className="w-full flex justify-center pb-16">
        <form className="w-[352px] sm:w-[588px] flex flex-col">
          <div className="flex gap-3">
            <div className="font-bold sm:text-[20px] mt-5">사진</div>
            <div className="text-[12px] mt-6 sm:mt-7 text-textGray">
              최대 3장까지 업로드 가능
            </div>
          </div>
          <div className="flex w-full mt-3 sm:mt-[18px] gap-4 sm:gap-[10px] justify-center">
            <div className="w-[72px] sm:w-[186px] aspect-square bg-[#f2f2f2] flex justify-center items-center overflow-hidden">
              {editPreview_01 === null ? (
                <>
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
                </>
              ) : (
                <>
                  <label className="w-[72px] sm:w-[186px] aspect-square bg-transparent flex p-2 justify-end absolute">
                    <BsFillXCircleFill
                      onClick={() => {
                        setEditImgFile_01(null);
                      }}
                      className="text-iconHover scale-100 sm:scale-150 bg-white rounded-full hover:scale-110 sm:hover:scale-[1.6] box-border cursor-pointer"
                    />
                  </label>
                  <Image
                    src={editPreview_01 as string}
                    className="w-[72px] sm:w-[186px] aspect-square object-cover border-[1px] border-borderGray"
                    width={72}
                    height={72}
                    alt=""
                  />
                </>
              )}
            </div>
            <div className="flex sm:flex-col gap-4 sm:gap-[10px]">
              <div className="w-[72px] sm:w-[88px] aspect-square bg-[#f2f2f2] flex justify-center items-center overflow-hidden">
                {editPreview_02 === null ? (
                  <>
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
                  </>
                ) : (
                  <>
                    <label className="w-[72px] sm:w-[88px] aspect-square bg-transparent flex p-2 justify-end absolute">
                      <BsFillXCircleFill
                        onClick={() => {
                          setEditImgFile_02(null);
                        }}
                        className="text-iconHover scale-100 sm:scale-150 bg-white rounded-full hover:scale-110 sm:hover:scale-[1.6] box-border cursor-pointer"
                      />
                    </label>
                    <Image
                      src={editPreview_02 as string}
                      className="w-[72px] sm:w-[186px] aspect-square object-cover border-[1px] border-borderGray"
                      width={72}
                      height={72}
                      alt=""
                    />
                  </>
                )}
              </div>
              <div className="w-[72px] sm:w-[88px] aspect-square bg-[#f2f2f2] flex justify-center items-center overflow-hidden">
                {editPreview_03 === null ? (
                  <>
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
                  </>
                ) : (
                  <>
                    <label className="w-[72px] sm:w-[88px] aspect-square bg-transparent flex p-2 justify-end absolute">
                      <BsFillXCircleFill
                        onClick={() => {
                          setEditImgFile_03(null);
                        }}
                        className="text-iconHover scale-100 sm:scale-150 bg-white rounded-full hover:scale-110 sm:hover:scale-[1.6] box-border cursor-pointer"
                      />
                    </label>
                    <Image
                      src={editPreview_03 as string}
                      className="w-[72px] sm:w-[186px] aspect-square object-cover border-[1px] border-borderGray"
                      width={72}
                      height={72}
                      alt=""
                    />
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
            value={editPost.title}
            onChange={onChangeValue}
            placeholder={post.title}
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
            className="w-full h-20 sm:h-[118px] text-[14px] sm:text-base px-4 py-3 border border-phGray scrollbar-none resize-none focus-visible:outline-none"
            name="text"
            value={editPost.text}
            onChange={onChangeValue}
            placeholder={post.text}
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
                checked={editPost.type === "소주" ? true : false}
              />
              <span className="w-full h-full bg-[#ededed] border-2 rounded-[16px] flex items-center justify-center text-center peer-checked:bg-[#909090] peer-checked:text-white peer-checked:border-[#5a5a5a] peer-checked:rounded-[16px]]">
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
                checked={editPost.type === "맥주" ? true : false}
              />
              <span className="w-full h-full bg-[#ededed] border-2 rounded-[16px] flex items-center justify-center text-center peer-checked:bg-[#909090] peer-checked:text-white peer-checked:border-[#5a5a5a] peer-checked:rounded-[16px]]">
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
                checked={editPost.type === "양주" ? true : false}
              />
              <span className="w-full h-full bg-[#ededed] border-2 rounded-[16px] flex items-center justify-center text-center peer-checked:bg-[#909090] peer-checked:text-white peer-checked:border-[#5a5a5a] peer-checked:rounded-[16px]]">
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
                checked={editPost.type === "기타" ? true : false}
              />
              <span className="w-full h-full bg-[#ededed] border-2 rounded-[16px] flex items-center justify-center text-center peer-checked:bg-[#909090] peer-checked:text-white peer-checked:border-[#5a5a5a] peer-checked:rounded-[16px]]">
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
              name="editIng_01"
              value={editIng.editIng_01}
              onChange={onChangeIngre}
              placeholder={`${
                editPost.ingredient![0] !== undefined
                  ? editPost.ingredient![0]
                  : "준비물 1"
              }`}
            />
            <input
              className="border-b-[1px] border-[#d9d9d9] px-1 py-[6px]"
              name="editIng_02"
              value={editIng.editIng_02}
              onChange={onChangeIngre}
              placeholder={`${
                editPost.ingredient![1] !== undefined
                  ? editPost.ingredient![1]
                  : "준비물 2"
              }`}
            />
            <input
              className="border-b-[1px] border-[#d9d9d9] px-1 py-[6px]"
              name="editIng_03"
              value={editIng.editIng_03}
              onChange={onChangeIngre}
              placeholder={`${
                editPost.ingredient![2] !== undefined
                  ? editPost.ingredient![2]
                  : "준비물 3"
              }`}
            />

            {editPlusIng ? (
              <>
                <input
                  className="border-b-[1px] border-[#d9d9d9] px-1 py-[6px]"
                  name="editIng_04"
                  value={editIng.editIng_04}
                  onChange={onChangeIngre}
                  placeholder={`${
                    editPost.ingredient![3] !== undefined
                      ? editPost.ingredient![3]
                      : "준비물 4"
                  }`}
                />
                <input
                  className="border-b-[1px] border-[#d9d9d9] px-1 py-[6px]"
                  name="editIng_05"
                  value={editIng.editIng_05}
                  onChange={onChangeIngre}
                  placeholder={`${
                    editPost.ingredient![4] !== undefined
                      ? editPost.ingredient![4]
                      : "준비물 5"
                  }`}
                />
                <input
                  className="border-b-[1px] border-[#d9d9d9] px-1 py-[6px]"
                  name="editIng_06"
                  value={editIng.editIng_06}
                  onChange={onChangeIngre}
                  placeholder={`${
                    editPost.ingredient![5] !== undefined
                      ? editPost.ingredient![5]
                      : "준비물 6"
                  }`}
                />
              </>
            ) : null}
          </div>
          {editPlusIng ? null : (
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
            className="w-full h-28 sm:h-[170px] text-[14px] sm:text-base px-4 py-3 border border-phGray scrollbar-none resize-none focus-visible:outline-none"
            name="recipe"
            value={editPost.recipe}
            onChange={onChangeValue}
            placeholder={post.recipe}
          />
          <div className="w-full flex flex-col sm:flex-row justify-between gap-6 items-center mt-10">
            <Link
              className="border border-primary text-primary rounded w-full py-3 font-bold text-center"
              href={`/post/${id}`}
            >
              취소
            </Link>
            <button
              onClick={onSubmit}
              className="bg-primary rounded w-full py-3 font-bold text-white"
            >
              저장
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default EditDetail;

export const getServerSideProps: GetServerSideProps = async ({
  params: { id },
}: any) => {
  const docRef = doc(dbService, "Posts", id);
  const docSnap = await getDoc(docRef);
  const data = docSnap.data();
  const post: Form = {
    ...data,
  };

  return {
    props: { id, post },
  };
};
