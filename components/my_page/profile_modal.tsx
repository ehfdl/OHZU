import React, { useEffect, useState } from "react";
import { FiX } from "react-icons/fi";
import { authService } from "@/firebase";
import { dbService, storageService } from "@/firebase";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import {
  doc,
  getDoc,
  updateDoc,
  setDoc,
  addDoc,
  collection,
} from "firebase/firestore";

import { v4 as uuidv4 } from "uuid";

const ProfileModal = ({ setIsOpenProfileModal, myProfile }: ModalType) => {
  const [form, setForm] = useState(myProfile);
  const [imgFile, setImgFile] = useState<File | null>();

  const [preview, setPreview] = useState<string | null>();

  const onChangeValue = (
    event:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setForm((prev: any) => {
      return { ...prev, [name]: value };
    });
  };

  const onChangeImg = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files !== null) {
      const file = event.target.files[0];
      if (file && file.type.substring(0, 5) === "image") {
        setImgFile(file);
      }
    }
  };

  const onSubmit = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    let imgFileUrl = "";

    if (preview !== null) {
      const previewRef = ref(storageService, `profile/${uuidv4()}`);
      await uploadString(previewRef, preview as string, "data_url");
      imgFileUrl = await getDownloadURL(previewRef);
      let newForm = {
        ...form,
        imageURL: imgFileUrl,
      };
      await updateDoc(doc(dbService, "Users", myProfile.userId), newForm);
    } else {
      await updateDoc(doc(dbService, "Users", myProfile.userId), form);
    }

    setIsOpenProfileModal(false);
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
    <div className=" w-full h-screen flex absolute justify-center top-0 left-0 items-center ">
      <div className="w-full h-full fixed left-0 top-0 z-30 bg-[rgba(0,0,0,0.5)]" />
      <div className="w-[588px] h-[820px] bg-white z-40 flex flex-col justify-start items-center">
        <button
          className="w-10 aspect-square absolute mt-7 ml-[500px]"
          onClick={() => setIsOpenProfileModal(false)}
        >
          <FiX className="w-full h-full text-[#acacac]" />
        </button>

        <div className="text-[40px] font-bold mt-[88px]">프로필 편집</div>
        <div className="w-40 aspect-square mt-8 bg-[#d9d9d9] rounded-full overflow-hidden">
          {preview !== null ? (
            <img
              src={preview as string}
              className="w-40 aspect-square object-cover"
            />
          ) : (
            <img
              src={myProfile.imageURL as string}
              className="w-40 aspect-square object-cover"
            />
          )}
        </div>
        <label className="mt-3 cursor-pointer">
          <input
            onChange={onChangeImg}
            name="img"
            type="file"
            accept="image/*"
            className="hidden"
          />
          <span>프로필 이미지 수정</span>
        </label>
        <div className="w-[472px]">
          <div className="font-bold text-[24px]">닉네임</div>
          <input
            name="nickname"
            value={form.nickname}
            onChange={onChangeValue}
            className="w-full h-11 mt-2 bg-[#f5f5f5] px-4"
          />
          <div className="font-bold text-[24px] mt-9">소개</div>
          <textarea
            name="introduce"
            value={form.introduce}
            onChange={onChangeValue}
            className="w-full min-h-[132px] mt-2 bg-[#f5f5f5] py-2 px-4 resize-none"
          />
        </div>
        <button
          onClick={onSubmit}
          className="w-[472px] h-12 bg-black text-white mt-9"
        >
          수정완료
        </button>
      </div>
    </div>
  );
};

export default ProfileModal;