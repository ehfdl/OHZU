import Layout from "@/components/layout";
import { dbService, storageService } from "@/firebase";
import { collection, doc, getDoc, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import { GetServerSideProps } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { BsFillXCircleFill, BsPlusLg } from "react-icons/bs";
import { FaRegEdit } from "react-icons/fa";
import { FiEdit2 } from "react-icons/fi";
import { v4 as uuidv4 } from "uuid";

interface ParamsPropsType {
  id: string;
}
const EditDetail = ({ id }: ParamsPropsType) => {
  const router = useRouter();
  const [post, setPost] = useState<Form>({
    userId: "",
    img: [],
    title: "",
    type: "",
    ingredient: "",
    recipe: "",
    text: "",
    like: [],
    view: 0,
  });

  const [editPost, setEditPost] = useState<Form>({
    userId: "",
    img: [],
    title: "",
    type: "",
    ingredient: "",
    recipe: "",
    text: "",
    like: [],
    view: 0,
  });

  const [editImgFile_01, setEditImgFile_01] = useState<File | null>();
  const [editImgFile_02, setEditImgFile_02] = useState<File | null>();
  const [editImgFile_03, setEditImgFile_03] = useState<File | null>();

  const [editPreview_01, setEditPreview_01] = useState<string | null>();
  const [editPreview_02, setEditPreview_02] = useState<string | null>();
  const [editPreview_03, setEditPreview_03] = useState<string | null>();

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

  const getPost = async () => {
    const docRef = doc(dbService, "Posts", id);
    const docSnap = await getDoc(docRef);
    const data = docSnap.data();
    const newPost = {
      ...data,
    };

    setPost(newPost);
  };

  const onSubmit = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
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
          } else {
            return savePreview[i];
          }
        })
      );

      // downloadPreview

      downloadPreview.forEach((item: any, i) => {
        if (item.value !== savePreview[i]) {
          savePreview[i] = item.value;
        } else {
          return savePreview[i];
        }
      });

      // downloadPreview.forEach((item: any, i) => savePreview.push(item.value));

      let newEditPost = {
        ...editPost,
        img: savePreview,
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
    getPost();
  }, []);

  useEffect(() => {
    setEditPost(post);
  }, [post]);

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
              {editPreview_01 === null ? (
                <>
                  <img
                    src={post.img![0]}
                    className="w-[186px] aspect-square object-cover"
                  />
                  <label className="w-12 h-12 bg-black bg-opacity-40 flex justify-center items-center absolute rounded-full cursor-pointer group">
                    <input
                      name="img"
                      type="file"
                      accept="image/*"
                      onChange={onChangeImg_01}
                      className="hidden"
                    />
                    <FiEdit2
                      size={24}
                      className=" text-white group-hover:text-[#ff6161]"
                    />
                  </label>
                </>
              ) : (
                <>
                  <label className="w-[186px] aspect-square bg-transparent flex p-2 justify-end absolute">
                    <BsFillXCircleFill
                      onClick={() => {
                        setEditImgFile_01(null);
                      }}
                      className=" text-[#666666] scale-150 bg-white rounded-full hover:scale-[1.6] box-border"
                    />
                  </label>
                  <img
                    src={editPreview_01 as string}
                    className="w-[186px] aspect-square object-cover"
                  />
                </>
              )}
            </div>
            <div className="flex flex-col gap-[10px]">
              <div className="w-[88px] aspect-square bg-[#f2f2f2] flex justify-center items-center overflow-hidden">
                {editPreview_02 === null ? (
                  <>
                    <img
                      src={post.img![1]}
                      className="w-[186px] aspect-square object-cover"
                    />
                    <label className="w-12 h-12 bg-black bg-opacity-40 flex justify-center items-center absolute rounded-full cursor-pointer group">
                      <input
                        name="img"
                        type="file"
                        accept="image/*"
                        onChange={onChangeImg_02}
                        className="hidden"
                      />
                      <FiEdit2
                        size={24}
                        className=" text-white group-hover:text-[#ff6161]"
                      />
                    </label>
                  </>
                ) : (
                  <>
                    <label className="w-[88px] aspect-square bg-transparent flex p-2 justify-end absolute">
                      <BsFillXCircleFill
                        onClick={() => {
                          setEditImgFile_02(null);
                        }}
                        className=" text-[#666666] scale-150 bg-white rounded-full hover:scale-[1.6] box-border"
                      />
                    </label>
                    <img
                      src={editPreview_02 as string}
                      className="w-[88px] aspect-square object-cover"
                    />
                  </>
                )}
              </div>
              <div className="w-[88px] aspect-square bg-[#f2f2f2] flex justify-center items-center overflow-hidden">
                {editPreview_03 === null ? (
                  <>
                    <img
                      src={post.img![2]}
                      className="w-[186px] aspect-square object-cover"
                    />
                    <label className="w-12 h-12 bg-black bg-opacity-40 flex justify-center items-center absolute rounded-full cursor-pointer group">
                      <input
                        name="img"
                        type="file"
                        accept="image/*"
                        onChange={onChangeImg_03}
                        className="hidden"
                      />
                      <FiEdit2
                        size={24}
                        className=" text-white group-hover:text-[#ff6161]"
                      />
                    </label>
                  </>
                ) : (
                  <>
                    <label className="w-[88px] aspect-square bg-transparent flex p-2 justify-end absolute">
                      <BsFillXCircleFill
                        onClick={() => {
                          setEditImgFile_03(null);
                        }}
                        className=" text-[#666666] scale-150 bg-white rounded-full hover:scale-[1.6] box-border"
                      />
                    </label>
                    <img
                      src={editPreview_03 as string}
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
            value={editPost.title}
            onChange={onChangeValue}
            placeholder={post.title}
            className="w-full"
          />

          <div className="w-full border-[1px] border-[#d9d9d9] mt-[10px]" />

          <div className="font-bold text-[20px] my-5">소개</div>
          <textarea
            className="h-7 resize-none overflow-hidden"
            name="text"
            value={editPost.text}
            onChange={onChangeValue}
            placeholder={post.text}
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
            value={editPost.ingredient}
            onChange={onChangeValue}
            placeholder={post.ingredient}
          />
          <div className="w-full border-[1px] border-[#d9d9d9] mt-2" />

          <div className="font-bold text-[20px] my-5">만드는 방법</div>

          <textarea
            className="h-24 resize-none overflow-hidden"
            name="recipe"
            value={editPost.recipe}
            onChange={onChangeValue}
            placeholder={post.recipe}
          />
          <div className="w-full flex justify-center items-center space-x-2">
            <button onClick={onSubmit} className="bg-[#ff6161] px-14 py-2 h-12">
              수정
            </button>
            <Link
              className="bg-[#ff6161] px-14 py-2 h-12 flex justify-center items-center text-center"
              href={`/post/${id}`}
            >
              취소
            </Link>
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
  return {
    props: { id },
  };
};
